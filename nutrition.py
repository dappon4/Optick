import requests
from dotenv import *
import os
import json
import requests

load_dotenv()

def calculate_nutrition(dict_query):
    query = ''
    for key, value in dict_query.items():
        query += f'{key} {value}'
        query+= " "


    api_url = 'https://api.api-ninjas.com/v1/nutrition?query={}'.format(query)
    response = requests.get(api_url, headers={'X-Api-Key': 'zAs6MktVapotmmVMN09B/g==01Ijr3e0M0rGHYC6'})

    output = response.text

    output_dict = json.loads(output)

    sum_dict = {}

    # Iterate over each dictionary in the list
    for ingredient_dict in output_dict:
        # Iterate over each key-value pair in the dictionary
        for key, value in ingredient_dict.items():

            if key == "serving_size_g":
                continue
            # Check if the value is an integer
            if isinstance(value, (float, int)):
                # Add the value to the sum_dict, or initialize it if it doesn't exist
                sum_dict[key] = sum_dict.get(key, 0) + value
            
    return sum_dict


if __name__ == '__main__':
    dict_query = {"ground beef": 1, "brown rice": 1, "tortillas": 3, "lettuce": 1, "tomato": 2, "pepper": 2, "zucchini": 2, "avocado": 1}
    sum_dict = calculate_nutrition(dict_query)
    print(sum_dict)