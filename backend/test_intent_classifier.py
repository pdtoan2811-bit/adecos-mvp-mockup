"""
Test suite for intent classifier
"""

import asyncio
import sys
import os

# Create a StreamWriter wrapper that handles unicode errors for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Add parent directory to path to allow importing backend modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from intent_classifier import classify_intent, is_research_intent

TEST_QUERIES = [
    # Research queries (should return "research")
    ("Forex", []),
    ("Crypto", []),
    ("beauty skincare ecommerce international", []),
    ("gaming niche", []),
    ("tìm chương trình forex", []),
    ("affiliate programs for finance", []),
    
    # Data Analysis queries
    ("Show me my google ads performance", []),
    ("Tăng trưởng doanh thu tháng này", []),
    ("Campaign nào hiệu quả nhất?", []),
    ("Chi phí tuần rồi", []),

    # Comparison queries
    ("So sánh tháng 10 và tháng 11", []),
    
    # Explanation queries (should return "explanation")
    ("What is affiliate marketing?", []),
    ("Why is this score high?", []),
    ("How does commission work?", []),
    ("Explain the first program", []),
    ("Tại sao điểm này cao?", []),
    ("Làm thế nào để tham gia?", []),
    
    # Follow-up queries (should return "followup")
    ("Tell me more about the first one", [{"role": "assistant", "content": "Here are some programs..."}]),
    ("Can you expand on that?", [{"role": "assistant", "content": "..."}]),
    ("Details about row 1", [{"role": "assistant", "content": "..."}]),
]

async def run_tests():
    print("=" * 80)
    print("INTENT CLASSIFIER TEST SUITE")
    print("=" * 80)
    
    for query, history in TEST_QUERIES:
        print(f"\nQuery: '{query}'")
        print(f"History: {len(history)} messages")
        print("-" * 40)
        
        result = await classify_intent(query, history)
        
        print(f"Intent: {result['intent']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Reasoning: {result['reasoning']}")
        print(f"Entities: {result.get('entities')}")
        print(f"Is Research?: {is_research_intent(result)}")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_tests())
