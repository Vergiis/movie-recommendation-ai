from flask import Flask
from flask_restful import Api 
from movie_list_API import ListFromPrompt
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from .env
load_dotenv()

# Init flask 
app = Flask(__name__) 
api = Api(app) 
CORS(app)

# Flask route
api.add_resource(ListFromPrompt,'/get_movie_list')

# Main
if __name__ == '__main__': 
    app.run(debug = True,port=os.getenv("PORT")) 