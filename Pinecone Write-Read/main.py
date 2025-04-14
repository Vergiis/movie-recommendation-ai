from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import json
from tqdm import tqdm
import uuid
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Init Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_APIKEY"))

# Connect to the index
index_name = os.getenv("PINECONE_INDEX")
index = pc.Index(index_name)

# Load the GTE model from Sentence-Transformers
model_path = 'Alibaba-NLP/gte-large-en-v1.5'
model = SentenceTransformer(model_path, trust_remote_code=True)

def upsert_to_index(dataset):
    # Generate embeddings for movie plots
    movie_prompts = [movie["prompt"] for movie in dataset]
    movie_embeddings = model.encode(movie_prompts, convert_to_numpy=True)

    # Insert data into Pinecone
    vectors = [
        ((f"{int(time.time())}-{uuid.uuid4().hex[:6]}"), embedding.tolist(), 
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
        })
        for idx,(movie, embedding) in enumerate(zip(dataset, movie_embeddings))
    ]
    index.upsert(vectors)

def logging(data,logs_path):
    with open(logs_path, "a", encoding="utf-8") as file:
        file.write(data+"\n")

#Main
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
    dataset_size=191651
    #How many at once should be upsert to index
    batch_size = 10

    #Write data from file_path to index in batches
    with open("./data/"+file_path, "r", encoding="utf-8") as file, tqdm(total=dataset_size, desc="Loading Data", unit="lines") as pbar:
        dataset=[]
        for line in file:
            try:
                dataset.append(json.loads(line))
                #Upsert batch
                if len(dataset)>=batch_size:
                    upsert_to_index(dataset)
                    #log after batch
                    logging(
                        "["+str(datetime.now(timezone.utc))+"] Upsert to index "+index_name+": "+str([item["expected_output"] for item in dataset]),
                        "./logs/"+str(datetime.today().date())+".log"
                        )
                    dataset=[]
                    #Progress progress bar
                    pbar.update(batch_size)
            except:
                #log after error
                logging(
                    "["+str(datetime.now(timezone.utc))+"] Upsert Error to index "+index_name,
                    "./logs/"+str(datetime.today().date())+".log"
                    )





