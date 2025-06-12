from pinecone import Pinecone
import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModel
import torch

class MovieListIndex:

    def __init__(self):
        load_dotenv()
         # Init Pinecone
        pc = Pinecone(api_key=os.getenv("PINECONE_APIKEY"))

        # Connect to the index
        index_name = os.getenv("PINECONE_INDEX")
        self.index = pc.Index(index_name)

        # Load the SentenceTransformer GTE model
        model_path = 'Alibaba-NLP/gte-large-en-v1.5'
        self.tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
        self.model = AutoModel.from_pretrained(model_path, trust_remote_code=True)

    def get_embedding(self,text):
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            embedding = outputs.last_hidden_state[:, 0, :]
            return embedding.squeeze().numpy()
    
    def query_from_id(self,ids):
        search_results=self.index.fetch(ids=ids)
        if search_results is not None:
            return [{**search_results.vectors[item]["metadata"],"id":item} for item in search_results.vectors]
        else: return None 

    def query(self,prompt,size,genres,score,date_start,date_end,types):
        if size<=0:
            return None
        query_embedding = self.get_embedding(prompt)
        filter = {
            "genres": {"$in": genres},
            "score": {"$gt": score},
            "date": {"$gte": date_start, "$lte": date_end},
            "type": {"$in": types}
            }  
        search_results = self.index.query(vector=query_embedding.tolist(), top_k=size, filter=filter, include_metadata=True)
        if search_results is not None:
            return [{**item["metadata"], "id": item["id"]} for item in search_results["matches"]]
        else:
            return None
