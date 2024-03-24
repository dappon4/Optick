import os
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.generativeai.types.content_types import *
from PIL import Image
import json
from dotenv import load_dotenv
import ast

PROMPT = """
!!IMPORTANT!! - Make sure you follow the format strictly as given below.

you are a YOLO model that accurately detects quantity of foods in the provided image. You need to output the quantity of each food item detected in the image.
iF the food is cut in half or in pieces, you need to take that into account as well.
account for hidden foods as well.

strictly follow this format and print nothing else:
{{"foodname1": quantity1, "foodname2": quantity2, "foodname3": quantity3, ...}}

example:
if the image contains 4 apples sliced in half, 6 bananas cut in 1/3, and 1 orange, the output should be:

{{"apple": 2, "banana": 2, "orange": 1}}
"""


def detect_quantity(image_path):
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    
    genai.configure(api_key=GOOGLE_API_KEY)
    
    model = genai.GenerativeModel("gemini-pro-vision")
    image = Image.open(image_path)
    response = model.generate_content([image, PROMPT]).text
    #print(response)
    response = response.replace(r"{{", "{").replace(r"}}", "}")
    print(response)
    return ast.literal_eval(response)

if __name__ == '__main__':
    image_path = "test_food.jpg"
    quantity = detect_quantity(image_path)
    print(type(quantity))
    #print(type(description))
    #print(description)