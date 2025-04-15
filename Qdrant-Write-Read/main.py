import asyncio
import uuid
from dotenv import load_dotenv
import os
from sentence_transformers import SentenceTransformer
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import VectorParams, Distance
from qdrant_client.models import PointStruct
from tqdm.asyncio import tqdm_asyncio
import json
from datetime import datetime, timezone

# Load environment variables from .env
load_dotenv()

# Load the GTE model from Sentence-Transformers
model_path = 'Alibaba-NLP/gte-large-en-v1.5'
model = SentenceTransformer(model_path, trust_remote_code=True)

async def upsert_to_index(dataset,client,collection_name):
    # Generate embeddings for movie plots
    movie_prompts = [movie["prompt"] for movie in dataset]
    movie_embeddings = model.encode(movie_prompts, normalize_embeddings=True)

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding.tolist(),
            payload=
            {
            "IMBDID": movie["expected_output"], 
            "plot": movie["plot"] if movie["plot"] is not None else "", 
            "type": movie["type"] if movie["type"] is not None else "",
            "title": movie["title"] if movie["title"] is not None else "",
            "genres": movie["genres"] if movie["genres"] is not None else "",
            "director":movie["director"] if movie["director"] is not None else "",
            "casts":str(movie["casts"]) if movie["casts"] is not None else "",
            "date":movie["release"] if movie["release"] is not None else 0,
            "runtime":movie["runtime"] if movie["runtime"] is not None else 0,
            "score":movie["rating"] if movie["rating"] is not None else 0,
            "poster":movie["poster"] if movie["poster"] is not None else ""
            }
        )
        for idx,(movie, embedding) in enumerate(zip(dataset, movie_embeddings))
    ]
    await client.upsert(collection_name=collection_name, points=points)

def logging(data,logs_path):
    with open(logs_path, "a", encoding="utf-8") as file:
        file.write(data+"\n")

# Main Function
async def main(file_path,dataset_size,batch_size):
    # Connect to Qdrant
    client = AsyncQdrantClient(
        host="localhost", 
        port=6333,
        api_key=os.getenv("API_KEY"),
        https=False
        )
    collection_name = "movies-recommendation"

    if not client.collection_exists(collection_name=collection_name):
        await client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
        )

    tasks=[]
    
    #Write data from file_path to index in batches
    with open("./data/"+file_path, "r", encoding="utf-8") as file:
        dataset=[]
        for line in file:
                dataset.append(json.loads(line))
                #Upsert batch
                if len(dataset)>=batch_size:
                    tasks.append(upsert_to_index(dataset,client,collection_name)) 
                    dataset=[]

    await tqdm_asyncio.gather(*tasks)
            
# Main
if __name__ == "__main__":
    while True:
        file_path=input("Dataset jsonl file from /data folder (e.g movies_data.jsonl): ")
        file_name, file_extension = os.path.splitext(file_path)
        
        #Check if file exist and have jsonl extension
        if os.path.exists("./data/"+file_path) and file_extension=='.jsonl':
            break
        else:
            print("\nWrong file!\n")

    #File dataset size
    dataset_size=100
    #How many at once should be upsert to index
    batch_size = 10

    asyncio.run(main(file_path,dataset_size,batch_size))