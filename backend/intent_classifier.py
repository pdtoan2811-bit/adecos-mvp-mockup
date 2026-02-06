"""
Intent Classifier for Adecos MVP Chat System

This module uses Gemini API to intelligently classify user intents for better routing.
IMPORTANT: Always use gemini-3-flash-preview - DO NOT CHANGE
"""

import os
from google import genai
from dotenv import load_dotenv
import json
import logging

load_dotenv()

# Configure logging
logger = logging.getLogger("AI_AGENT")

# IMPORTANT: Always use gemini-3-flash-preview - DO NOT CHANGE
MODEL_NAME = "gemini-3-flash-preview"

# Intent types
INTENT_RESEARCH = "research"
INTENT_EXPLANATION = "explanation"
INTENT_FOLLOWUP = "followup"
INTENT_DATA_ANALYSIS = "data_analysis"
INTENT_DATA_QUERY = "data_query"
INTENT_COMPARISON = "comparison"

VALID_INTENTS = [
    INTENT_RESEARCH,
    INTENT_EXPLANATION,
    INTENT_FOLLOWUP,
    INTENT_DATA_ANALYSIS,
    INTENT_DATA_QUERY,
    INTENT_COMPARISON
]

# Configure Gemini API
client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

CLASSIFIER_PROMPT = """Bạn là một bộ phân loại intent cho một ứng dụng quản lý quảng cáo affiliate.

Phân loại câu hỏi của người dùng vào MỘT trong các loại sau:

1. **data_analysis** - Người dùng muốn xem dữ liệu, biểu đồ, metrics về quảng cáo. BAO GỒM CẢ PHÂN TÍCH THEO GROUP.
   Ví dụ: "Chi phí tháng 11", "Hiển thị clicks tuần này", "ROAS của tôi thế nào?", "CPC", "Cost per click"
   Ví dụ Grouping: "Chi phí theo tài khoản", "Doanh thu theo chiến dịch", "Hiệu quả từng account" -> Intent này.
   
2. **data_query** - Người dùng muốn danh sách, bảng dữ liệu cụ thể về campaigns/accounts (CHỈ LIST/TABLE)
   Ví dụ: "Liệt kê các chiến dịch", "Tài khoản nào đang active?", "Danh sách tài khoản"

3. **comparison** - Người dùng muốn so sánh dữ liệu giữa các khoảng thời gian hoặc đối tượng
   Ví dụ: "So sánh tháng 10 và 11", "Campaign nào tốt hơn?", "Tuần này vs tuần trước"
   
4. **explanation** - Người dùng cần giải thích, hướng dẫn, hoặc hiểu một khái niệm
   Ví dụ: "CPC là gì?", "Tại sao chi phí tăng?", "Giải thích ROAS", "Cách tối ưu ads"

5. **followup** - Người dùng hỏi tiếp về response trước đó
   Ví dụ: "Chi tiết hơn", "Tại sao ngày 15 lại cao?", "Giải thích thêm", "nữa đi"

6. **research** - Người dùng muốn TÌM KIẾM chương trình affiliate, niche, hoặc cơ hội kiếm tiền
   Ví dụ: "Crypto", "Forex", "Finance", "Gaming", "Tìm affiliate program", "Ngách nào tốt?"

Câu hỏi: "{query}"

Lịch sử hội thoại: {context}

Trả lời CHÍNH XÁC theo format JSON:
{{
    "intent": "<loại>", 
    "confidence": 0.XX,
    "reasoning": "ngắn gọn",
    "entities": {{
        "time_range": "<khoảng thời gian nếu có, ví dụ: last 30 days, this week, November>", 
        "metrics": ["<metrics được nhắc đến>"], 
        "campaigns": ["<campaigns nếu có>"], 
        "niche": "<ngách/lĩnh vực nếu có>",
        "program": "<tên chương trình affiliate nếu có, v.d. Shopee, Binance>",
        "keywords": ["<từ khóa cần lọc nều có, v.d. crypto, forex>"],
        "group_by": "<account|campaign|day|week|month|none>",
        "breakdown": "<account|campaign|none>",
        "visual_type": "<line|bar|area|none>"
    }}
}}
"""


async def classify_intent(user_query: str, conversation_history: list = None) -> dict:
    """
    Classify user intent using Gemini API.
    
    Args:
        user_query: The current user message
        conversation_history: Optional list of previous messages for context
        
    Returns:
        dict: {"intent": str, "entities": dict, "confidence": float, "reasoning": str}
    """
    try:
        # Build context from conversation history
        context = "None (first message)"
        if conversation_history:
            if isinstance(conversation_history, list) and len(conversation_history) > 0:
                # Get last 2-3 messages for context
                recent_messages = conversation_history[-3:]
                context_parts = []
                for msg in recent_messages:
                    role = msg.get("role", "")
                    content = msg.get("content", "")
                    # Truncate long messages
                    if len(content) > 100:
                        content = content[:100] + "..."
                    context_parts.append(f"{role}: {content}")
                context = " | ".join(context_parts)
            elif isinstance(conversation_history, str):
                context = conversation_history
        
        # Format the prompt
        prompt = CLASSIFIER_PROMPT.format(query=user_query, context=context)
        
        # Use Gemini to classify
        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        
        # Parse response
        text = response.text.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        if text.startswith('```'):
            lines = text.split('\n')
            if lines[0].startswith('```'):
                lines = lines[1:]
            if lines and lines[-1].strip() == '```':
                lines = lines[:-1]
            text = '\n'.join(lines).strip()
        
        # Parse JSON
        result = json.loads(text)
        
        # Validate result
        if "intent" not in result:
            raise ValueError("Missing 'intent' in response")
        
        # Ensure intent is valid
        if result["intent"] not in VALID_INTENTS:
            # Default to research if invalid but looks like search, otherwise data_analysis
            result["intent"] = INTENT_DATA_ANALYSIS
            result["confidence"] = 0.5
            result["reasoning"] = f"Invalid intent '{result.get('intent')}' returned, defaulting to data_analysis"
        
        # Ensure entities exists
        if "entities" not in result:
            result["entities"] = {}
            
        logger.info(f"✅ INTENT CLASSIFIED: {result.get('intent')} | Entities: {result.get('entities')}")
        return result
        
    except Exception as e:
        logger.warning(f"⚠️ Classification error: {e}, defaulting to data_analysis")
        # If classification fails, default to data_analysis (safest assumption for dashboard app)
        return {
            "intent": INTENT_DATA_ANALYSIS,
            "confidence": 0.5,
            "reasoning": f"Classification failed: {str(e)}, defaulting to data_analysis",
            "entities": {}
        }


def get_intent_type(classification_result: dict) -> str:
    """Extract the intent type from classification result."""
    return classification_result.get("intent", INTENT_DATA_ANALYSIS)


def is_research_intent(classification_result: dict) -> bool:
    """Check if the classified intent is a research request."""
    intent = get_intent_type(classification_result)
    return intent in [INTENT_RESEARCH]
