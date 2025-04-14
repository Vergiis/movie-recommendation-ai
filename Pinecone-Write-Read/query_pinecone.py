from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Init Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_APIKEY"))

# Connect to the index
index_name = os.getenv("PINECONE_INDEX")
index = pc.Index(index_name)

# Load the SentenceTransformer GTE model
model_path = 'Alibaba-NLP/gte-large-en-v1.5'
model = SentenceTransformer(model_path, trust_remote_code=True)

def Query(prompt):
    query_embedding = model.encode([prompt], convert_to_numpy=True)
    search_results = index.query(vector=query_embedding.tolist(), top_k=3, include_metadata=True)
    if search_results is not None:
        return [item["metadata"] for item in search_results["matches"]]
    else:
        return None

#Main
if __name__ == "__main__":
    out=Query("Movie about superheros")
    print(out)

