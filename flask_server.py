from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

from bson import ObjectId
import json


load_dotenv()

uri = os.getenv('MONGODB_CONNECTION_STRING')
app = Flask(__name__)
CORS(app, origins='*')





# Establishing connection to MongoDB
cluster = MongoClient(uri)
db = cluster['records']  # Accessing the 'records' database

# Setting the secret key


#use response = requests.post(url, json=data)
@app.route('/add-data', methods=['POST'])
def add_data():
    data = request.json
    print(data)
    db.calories.insert_one({"calories": data.get("calories"), "nutritions": data.get("nutritions")})  # Inserting into 'calories' collection # Inserting into 'nutritions' collection
    return jsonify({"message": "Data added successfully"})


#use response = requests.get(url)
@app.route('/get-data', methods=['GET'])
def get_data():
    data = db.calories.find()  # Querying 'calories' collection
    results = [calorie for calorie in data]  # Convert cursor to a list of dictionaries
    
    if not results:
        return jsonify({"message": "No data found"})
    
    for result in results:
        result['_id'] = str(result['_id'])
    
    return jsonify(results)
if __name__ == '__main__':
    app.run(debug=True)
