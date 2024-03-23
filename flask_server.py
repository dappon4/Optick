from flask import Flask, request, send_file, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_CONNECTION_STRING')
app = Flask(__name__)
CORS(app, origins='*')
api = Api(app)

# idk if this is correct
app.config["SECRET KEY"] = "65ff0b900bf37f58d6f61a4d"

cluster = MongoClient(uri)
db = cluster['records']

print(cluster.list_database_names())

class Test(Resource):
    def get(self):
        data = db.comments.find({"email":"mercedes_tyler@fakegmail.com"})
        results = []
        for comment in data:
            results.append(comment)
        print(results[0])
        return jsonify(results[0]["name"])

class AddData(Resource):
    def post(self):
        data = request.json
        db.calories.insert_one(data["calories"])
        db.nutritions.insert_one(data["nutritions"])
        return jsonify({"message": "Data added successfully"})

class GetData(Resource):
    def get(self):
        data = db.calories.find()
        results = []
        for calorie in data:
            results.append(calorie)
        return jsonify(results)

api.add_resource(AddData, '/add-data')

if __name__ == '__main__':
    app.run(debug=True)