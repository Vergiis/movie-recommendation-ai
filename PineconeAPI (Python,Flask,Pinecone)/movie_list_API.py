from flask import json, request
from flask_restful import Resource
from marshmallow import Schema, fields, ValidationError
from utils.query_pinecone import MovieListIndex

# Movie List post request validator
class ListRequest(Schema):
    prompt = fields.String(required=True)
    size = fields.Integer(validate= lambda x:x>0)
    genres = fields.List(fields.String())
    types = fields.List(fields.String())
    score = fields.Float()
    date_start = fields.Integer()
    date_end = fields.Integer()

list_req=ListRequest()
movie_list_index=MovieListIndex()

# /get_movie_list
class ListFromPrompt(Resource):
    def post(self):
        try:
            data=list_req.load(request.json)
            movie_list=movie_list_index.query(
                data.get("prompt",""),
                data.get("size",0),
                data.get("genres",[]),
                data.get("score",0),
                data.get("date_start",0),
                data.get("date_end",0),
                data.get("types",[])
                )
            #Parse casts field
            for item in movie_list:
                try:
                    cast=json.loads(item["casts"].replace("'", "\"").replace("None", "null"))
                    out=[]
                    for person in cast:
                        out.append({
                            "name":person["name"]["display_name"],
                            "avatar":person["name"]["avatars"][0]["url"] if person["name"]["avatars"] is not None else None,
                            "character":person["characters"][0] if person["characters"] is not None else ""
                        })
                    item["casts"]=json.dumps(out)
                except:
                    item["casts"]=json.dumps([])

            return {"data": movie_list}, 200
        except ValidationError as err:
            return {"error": err.messages}, 400