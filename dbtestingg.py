import requests

# Define the data to be sent
data = {
     "date": "2021-09-01",
    "calories": "1200",
    "nutritions": "Protein, Carbohydrates, Vitamins"
}

# Define the URL endpoint where the Flask application is running
url = ''

# Send the POST request
response = requests.post(url, json=data)

# Print the raw response content
print(response.content)
