from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

print("Listing available models...")
try:
    for m in client.models.list():
        # Check if generateContent is supported (logic may vary in new SDK, listing all for now or checking display_name)
        print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")
