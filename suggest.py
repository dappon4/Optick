
from dotenv import *
import os
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.generativeai.types.content_types import *
from PIL import Image
import json

def generate_nutrional_values(description):
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    
    genai.configure(api_key=GOOGLE_API_KEY)
    
    model = genai.GenerativeModel("gemini-pro")
    prompt = """
    You're a highly advanced nutritional expert with decades of experience in analyzing food items and their nutritional content. Your specialty lies in providing detailed insights into the nutritional aspects of various foods and suggesting alternatives with similar values.  

Your task is to analyze a photo of a food item and output its nutritional value, focusing on calories. Additionally, suggest other foods with similar nutritional values.  

Please remember to ensure the accuracy of the nutritional information provided, offer relevant suggestions for alternative foods. Make sure to present all the information logically and cohesively, benefitting the user with comprehensive insights into the food item they inquire about.  

For example, if input is {"Oatmeal" : 1, "Chicken Salad": 1 } 

Output should be - {"Food Name" : ["Oatmeal", "Chicken Salad" ], "Calories": 420 , "Nutrition": {"Carbohydrates": 37, "Protein": 25, "Fat" :10"}, "Suggestions": "Quinoa Porridge contains fibre and essential nutrients. Another option is chia seeds pudding which is with omega-3 fatty acids, fiber, and antioxidants. Lastly, you can also choose to have buckwheat Groats which is a gluten-free grain bowl bursting with magnesium, fiber, and heart-healthy nutrients."Tuna fish is a protein-rich salad with omega-3 fatty acids and essential nutrients. Another great option is Caprese Salad:, which is a light and refreshing salad rich in calcium, vitamin C, and healthy fats. Lastly you can also have avocado Salad, a creamy and satisfying salad abundant in heart-healthy fats, fiber, and vitamins." }


IMPORTANT - make sure to follow the exact format as the example given. Put , after calories and nutrition to format it into a python dictionary
  

IMPORTANT - make sure to aggregate data. Which means sum up the calories of all the food items. Sum up the Nutrition values of all Food items.
IMPORTANT - Make comprehensive suggestions based on all the different food items present.
IMPORTANT - Make sure you give details of all the food items, that is Oatmean and Chicken Salad both in this case.
IMPORTANT - Apple : 3 means three apples, so multiply calories of one apple by the number three
If quantity of the food item is more than 1, multiple the calories and nutrition values according to the item number. For example if the calorie in a bowl of oatmeal is 150, 2 bowls should have 300 calories, and so on. Quantity will be the value to the key in the dictionary. For example {"apple":2} means two apples, {"Salad":1} means one salad. And so on


IMPORTANT - Always give approximate absolute values for calories and other nutritional values. Do not give range of values
IMPORTANT - Automatically correct any spelling mistakes.
IMPORTANT - Always output separate nutritional values like carbs, protein. Wherever necessary.
IMPORTANT - Do not give any nutritional insights
IMPORTANT - follow the order of the example
IMPORTANT - follow the formatting style of the example provided
IMPORTANT - Keep number of food items in check (it will appear as value of the key in dictionary)
IMPORTANT - only decribe nutritional value in one line for all the suggestions for alternative food item
IMPORTANT - give output for all food items, there maybe more than one
IMPORTANT - give me an output in strictly dict format
    """
    responses = model.generate_content([description, prompt])
    
    return responses.text


input_from_model = {"ground beef": 1, "brown rice": 1, "tortillas": 3, "lettuce": 1, "tomato": 2, "pepper": 1, "avocado": 1, "zucchini": 1}

str_input = json.dumps(input_from_model)

output = generate_nutrional_values(str_input)

def distributed_output(output):
    output_dict = json.loads(output)

    return output_dict['Food Name'], output_dict['Calories'],output_dict['Nutrition'],output_dict['Suggestion']

