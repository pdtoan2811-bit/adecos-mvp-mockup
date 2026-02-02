import asyncio
import sys
sys.path.insert(0, r'C:\Users\ADMIN\Desktop\adecos mvp\backend')

from generator import generate_chat_stream

async def test_ecommerce():
    # Simulate a conversation with history
    messages = [
        {"role": "user", "content": "Forex"},
        {"role": "assistant", "content": "..previous response..."},
        {"role": "user", "content": "Ecommerce quốc tế, beauty skincare - fragrance"}
    ]
    
    print("Testing e-commerce query (second message in conversation)...")
    print("-" * 80)
    
    full_response = ""
    async for chunk in generate_chat_stream(messages):
        print(chunk, end='', flush=True)
        full_response += chunk
    
    print("\n" + "-" * 80)
    print("\nAnalyzing response:")
    print(f"Response length: {len(full_response)}")
    print(f"Starts with: {full_response[:50]}")
    print(f"Ends with: {full_response[-50:]}")

if __name__ == "__main__":
    asyncio.run(test_ecommerce())
