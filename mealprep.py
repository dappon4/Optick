from dotenv import *
import os
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.generativeai.types.content_types import *

load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-pro")

PROMPT = """
You are a chef. Your job is to prepare a meal using the ingredients provided.
It is important to provide a healthy meal so that the user can maintain a balanced diet.

Your output should contain two patterns of food items and how to prepare them.
You do not have to make two different dishes, but you can use the ingredients in different ways.

If the calorie limit is not provided, you can use all the ingredients provided.
Otherwise, you should use the ingredients that are within the calorie limit.

Your ingredients are:
{ingredients}

Calories left: {calories_left}

Your output should be in the following format:
{{"recipe1": {{"name":"name of the recipe", "ingredients": [list of {{"name": "ingredient name", "quantity": quantity}}], "instructions":[list of instructions here]}}, "recipe2": {{"name":"name of the recipe", "ingredients": [list of {{"name": "ingredient name", "quantity": quantity}}], "instructions":[list of instructions here]}}}}

example:
{{"recipe1": {{"name": "Chicken Stir Fry", "ingredients": [{{"name": "chicken", "quantity": 2}}, {{"name": "broccoli", "quantity": 3}}, {{"name": "rice", "quantity": 1}}], "instructions": ["Step 1: Boil the rice", "Step 2: Cook the chicken and broccoli together in a pan"]}}, "recipe2": {{"name": "Chicken Salad", "ingredients": [{{"name": "chicken", "quantity": 1}}, {{"name": "spinach", "quantity": 3}}, {{"name": "tomato", "quantity": 4}}], "instructions": ["Step 1: Cook the chicken", "Step 2: Mix all the ingredients together"]}}}}
"""

def prep_meal(ingredients, calories_left = None):
    response = model.generate_content([PROMPT.format(ingredients=ingredients, calories_left=calories_left)])
    
    return response.text

if __name__ == '__main__':
    ingredients = {"chicken":2, "broccoli":3, "rice":1, "tomato":4, "spinach":3}
    meal = prep_meal(ingredients)
    print(meal)