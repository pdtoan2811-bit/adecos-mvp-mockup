import requests
import json

# Test table request
print("Testing table request (Crypto)...")
response = requests.post(
    'http://localhost:8000/api/chat/stream',
    json={'messages': [{'role': 'user', 'type': 'text', 'content': 'Crypto'}]},
    stream=True
)

buffer = b''
for chunk in response.iter_content(chunk_size=8192):
    if chunk:
        buffer += chunk

buffer_str = buffer.decode('utf-8')
print(f"Response length: {len(buffer_str)}")
print(f"First 200 chars: {buffer_str[:200]}")

try:
    data = json.loads(buffer_str)
    print(f"Type: {data['type']}")
    if data['type'] == 'table':
        print(f"Number of programs: {len(data['content'])}")
    print("✅ Table request SUCCESS")
except Exception as e:
    print(f"❌ Parse error: {e}")
    print(f"Full response: {buffer_str}")

print("\n" + "="*50 + "\n")

# Test explanation request
print("Testing explanation request...")
response = requests.post(
    'http://localhost:8000/api/chat/stream',
    json={'messages': [{'role': 'user', 'type': 'text', 'content': 'giải thích affiliate marketing là gì'}]},
    stream=True
)

buffer = b''
for chunk in response.iter_content(chunk_size=8192):
    if chunk:
        buffer += chunk

buffer_str = buffer.decode('utf-8')
print(f"Response length: {len(buffer_str)}")
print(f"First 200 chars: {buffer_str[:200]}")

try:
    data = json.loads(buffer_str)
    print(f"Type: {data['type']}")
    if data['type'] == 'text':
        print(f"Content preview: {data['content'][:100]}...")
    print("✅ Explanation request SUCCESS")
except Exception as e:
    print(f"❌ Parse error: {e}")
    print(f"Full response: {buffer_str[:500]}")
