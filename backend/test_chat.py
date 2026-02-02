import asyncio
import sys
sys.path.insert(0, r'C:\Users\ADMIN\Desktop\adecos mvp\backend')

from generator import generate_chat_stream

async def test_chat():
    messages = [
        {"role": "user", "content": "find crypto programs"}
    ]
    
    print("Testing chat stream...")
    print("-" * 50)
    
    full_response = ""
    async for chunk in generate_chat_stream(messages):
        print(chunk, end='', flush=True)
        full_response += chunk
    
    print("\n" + "-" * 50)
    print("\nFull response:")
    print(full_response)

if __name__ == "__main__":
    asyncio.run(test_chat())
