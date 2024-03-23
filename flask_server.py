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
db = cluster['sample_mflix']

print(cluster.list_database_names())

class Test(Resource):
    def get(self):
        data = db.comments.find({"email":"mercedes_tyler@fakegmail.com"})
        results = []
        for comment in data:
            results.append(comment)
        print(results[0])
        return jsonify(results[0]["name"])

api.add_resource(Test, '/test')

if __name__ == '__main__':
    app.run(debug=True)