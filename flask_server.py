from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
import json
from PIL import *
from io import BytesIO
import base64
from PIL import Image
from tmp_detect import detect_quantity
import requests
from nutrition import calculate_nutrition
from mealprep import prep_meal
from datetime import date
import datetime



uri = "mongodb+srv://ayushroy9711:ASiWwy7yhyYMLFss@cluster0.2gchnja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app = Flask(__name__)
CORS(app, origins='*')
url_post='http://167.71.172.236:5000/post-data'





# Establishing connection to MongoDB
cluster = MongoClient(uri)
db = cluster['records']  # Accessing the 'records' database

# Setting the secret key


#use response = requests.post(url, json=data)
@app.route('/add-data', methods=['POST'])
def add_data():
    data = request.json
    #print(data)
    
    # Insert data into 'items' collection
    db.items.insert_one(data)
    
    # Calculate nutrition
    out = calculate_nutrition(data)
    print("out")
    print(out)
    out.update(data)
    gg = date.today()  # Get the current date
    gg_str = gg.strftime('%m/%d/%Y')  # Convert the date to a formatted string
    out['date'] = gg_str  # Assign the formatted date string to the 'date' key in 'out'

    # Insert data into 'calories' collection
    db.calories.insert_one(out) 
    
    cc=get_daycals().json
    out["calories consumed"]=cc["sum"]
    out['_id'] = str(out['_id'])
    
    # Return the JSON response
    
    return jsonify(out)

@app.route('/add-inv-data', methods=['POST'])
def add_inv_data():
    """data = request.json
    print(data)
    for key,value in data.items():
        out = calculate_nutrition({key:value})
        dict = {key:value}
        dict.update(out)
        db.Inventory.insert_one(dict)
    # Inserting into 'calories' collection # Inserting into 'nutritions' collection
    return jsonify({"message": " inventory Data added successfully"})"""

    data = request.json
    for key, values in data.items():
        if db.Inventory.find_one({"name": key}):
            # Document with {"name": key} exists in db.Inventory
            # Add your code here
            db.Inventory.update_one({"name": key}, {"$inc": {"quantity": values}})
        else:
            # Document with {"name": key} does not exist in db.Inventory
            # Add your code here
            db.Inventory.insert_one({"name": key, "quantity": values})


@app.route('/add-img', methods=['POST'])
def add_img():
    data = request.json
    #print(data)
    image_base = data.get('image_base64', '')
    #print(image_base)
    # Decode the base64 encoded image
    image_data = base64.b64decode(image_base)
    with open("./imageToSave.png", "wb") as fh:
        fh.write(image_data)
    out = detect_quantity(r"./imageToSave.png")
    print(out)
    return jsonify(out)




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

@app.route('/get-daycals', methods=['GET'])
def get_daycals():
    data = db.calories.find()  # Querying 'calories' collection
    results = [calorie for calorie in data]  # Convert cursor to a list of dictionaries
    
    if not results:
        return jsonify({"message": "No data found"})
    
    for result in results:
        result['_id'] = str(result['_id'])
    
    sum=0
    current_date = datetime.datetime.now().strftime("%m/%d/%Y")
    for dic in results:
        if(dic['date']== current_date):
            sum+=dic['calories']
    sumd={"sum":sum}
    return jsonify(sumd)

@app.route('/get-suggestions', methods=['GET'])
def get_suggestions():
    cc=get_daycals().json
    inv=get_inv_data().json

    out=prep_meal(inv,2500-cc["sum"])
    print(out)
    return jsonify(out)

@app.route('/get-inv-data', methods=['GET'])
def get_inv_data():
    data = db.Inventory.find()  # Querying 'calories' collection
    results = [calorie for calorie in data]  # Convert cursor to a list of dictionaries
    
    if not results:
        return jsonify({"message": "No data found"})
    
    for result in results:
        result['_id'] = str(result['_id'])
    
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
