"""
Test the new table schema with commission percentage and brand usage
"""

import asyncio
import sys
sys.path.insert(0, r'C:\Users\ADMIN\Desktop\adecos mvp\backend')

from generator import generate_chat_stream
import json

async def test_new_schema():
    print("=" * 80)
    print("TEST: New Table Schema (Commission % + Brand Usage)")
    print("=" * 80)
    
    messages = [{"role": "user", "content": "Forex"}]
    
    print("\nQuery: 'Forex'")
    print("-" * 80)
    
    full_response = ""
    async for chunk in generate_chat_stream(messages):
        full_response += chunk
    
    # Parse and verify the schema
    try:
        data = json.loads(full_response)
        print(f"\nResponse Type: {data['type']}")
        print(f"Number of programs: {len(data['content'])}")
        
        if data['content']:
            print("\nFirst program sample:")
            first_program = data['content'][0]
            for key, value in first_program.items():
                print(f"  {key}: {value}")
            
            # Verify new fields
            print("\nSchema validation:")
            required_fields = ['brand', 'program_url', 'commission_percent', 'commission_type', 'can_use_brand', 'traffic_3m', 'legitimacy_score']
            for field in required_fields:
                status = "✓" if field in first_program else "✗"
                print(f"  {status} {field}")
        
    except json.JSONDecodeError as e:
        print(f"\nJSON Parse Error: {e}")
        print(f"Response preview: {full_response[:500]}")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    asyncio.run(test_new_schema())
