from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

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
        self.model = SentenceTransformer(model_path, trust_remote_code=True)

    def query(self,prompt,size,genres,score,date_start,date_end,types):
        if size<=0:
            return None
        query_embedding = self.model.encode([prompt], convert_to_numpy=True)
        filter = {
            "genres": {"$in": genres},
            "score": {"$gt": score},
            "date": {"$gte": date_start, "$lte": date_end},
            "type": {"$in": types}
            }  
        search_results = self.index.query(vector=query_embedding.tolist(), top_k=size, filter=filter, include_metadata=True)
        if search_results is not None:
            return [item["metadata"] for item in search_results["matches"]]
        else:
            return None
