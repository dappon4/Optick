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
Make sure to explain why the food is healthy and how it benefits the user.

Your output should contain 3 patterns of food items and how to prepare them.
You do not have to make three different dishes, but you can use the ingredients in different ways.

If the calorie limit is not provided, you can use all the ingredients provided.
Otherwise, you should use the ingredients that are within the calorie limit.

Your ingredients are:
{ingredients}

Calories left: {calories_left}
"""

def prep_meal(ingredients, calories_left = None):
    response = model.generate_content([PROMPT.format(ingredients=ingredients, calories_left=calories_left)])
    
    return response.text

if __name__ == '__main__':
    ingredients = {"chicken":2, "broccoli":3, "rice":1, "tomato":4, "spinach":3}
    meal = prep_meal(ingredients)
    print(meal)