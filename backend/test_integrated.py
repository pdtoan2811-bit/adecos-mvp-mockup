"""
Test the intent classifier integrated with the actual chat stream
"""

import asyncio
import sys
sys.path.insert(0, r'C:\Users\ADMIN\Desktop\adecos mvp\backend')

from generator import generate_chat_stream

async def test_integrated_chat():
    print("=" * 80)
    print("INTEGRATED CHAT STREAM TEST")
    print("=" * 80)
    
    test_cases = [
        # Test 1: Simple research query
        {
            "name": "Test 1: Single word niche",
            "messages": [{"role": "user", "content": "Forex"}]
        },
        # Test 2: Multi-word research query
        {
            "name": "Test 2: Description-style query",
            "messages": [{"role": "user", "content": "ecommerce beauty skincare international"}]
        },
        # Test 3: Explanation query
        {
            "name": "Test 3: Explanation question",
            "messages": [{"role": "user", "content": "What is affiliate marketing?"}]
        },
        # Test 4: Follow-up in conversation
        {
            "name": "Test 4: Followup query",
            "messages": [
                {"role": "user", "content": "Forex"},
                {"role": "assistant", "content": "Here are forex programs..."},
                {"role": "user", "content": "tell me more about the first one"}
            ]
        },
    ]
    
    for test_case in test_cases:
        print(f"\n{test_case['name']}")
        print("-" * 80)
        print(f"Messages: {test_case['messages']}")
        print("Response:")
        
        full_response = ""
        async for chunk in generate_chat_stream(test_case['messages']):
            full_response += chunk
        
        # Show first 200 chars of response
        preview = full_response[:200] + "..." if len(full_response) > 200 else full_response
        print(preview)
        print()
    
    print("=" * 80)
    print("INTEGRATED TEST COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(test_integrated_chat())
