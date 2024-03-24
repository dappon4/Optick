from dotenv import load_dotenv
import requests
import os

load_dotenv()

CHUNK_SIZE = 1024
voice_id = "uNtKzbGXZY1mQci2XbFp"

url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

headers = {
  "Accept": "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": os.getenv('ELEVEN_API_KEY')
}

def generate_tts(text,path):
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5,
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    with open(path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)

if __name__ == '__main__':
    text = "Good Job!"
    path = os.path.join("tts","tts.mp3")
    generate_tts(text,path)
    print("TTS generated successfully")