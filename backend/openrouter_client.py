
import os
import json
import requests
from dotenv import load_dotenv

import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

OPENROUTER_API_KEY = "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" 
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
TARGET_MODEL = "nvidia/nemotron-3-nano-30b-a3b:free"

# Local Mock Data for instant response
MOCK_DATA = {
    "ads": [
        "Phân tích hiệu quả Ads Facebook",
        "Chiến lược Google Ads giá rẻ",
        "Tối ưu TikTok Ads conversion",
        "Spy mẫu quảng cáo đối thủ",
        "Xu hướng Ads 2024"
    ],
    "seo": [
        "Nghiên cứu từ khóa SEO",
        "Kiểm tra thứ hạng từ khóa",
        "Phân tích Backlink đối thủ",
        "Tối ưu On-page SEO",
        "Audit kỹ thuật SEO website"
    ],
    "affiliate": [
        "Top chương trình Affiliate hoa hồng cao",
        "Nghiên cứu ngách Affiliate tiềm năng",
        "Spy chiến dịch Affiliate đối thủ",
        "Tối ưu Landing Page Affiliate",
        "Theo dõi chuyển đổi (Tracking)"
    ],
    "tiktok": [
        "Xu hướng TikTok Shop mới nhất",
        "Phân tích kênh TikTok đối thủ",
        "Kịch bản video TikTok triệu view",
        "Tối ưu TikTok Ads bán hàng",
        "Tìm kiếm KOLs/KOCs phù hợp"
    ]
}

def fetch_suggestions(prompt: str) -> list[str]:
    """
    Fetches autocomplete suggestions from OpenRouter.
    
    Args:
        prompt (str): The user input to get suggestions for.
        
    Returns:
        list[str]: A list of up to 5 suggestion strings.
    """
    start_time = time.time()
    
    # 1. Check Mock Data First
    normalized_prompt = prompt.lower().strip()
    for key, suggestions in MOCK_DATA.items():
        if key in normalized_prompt:
            logger.info(f"Returning MOCK DATA for '{prompt}' (match: {key})")
            return suggestions

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:8000", # Required by OpenRouter
        "X-Title": "Adecos MVP Backend",
        "Content-Type": "application/json"
    }
    
    messages = [
        {
            "role": "system",
            "content": """Bạn là một công cụ gợi ý thông minh cho nền tảng phân tích Affiliate Marketing & MMO (Kiếm tiền online) tại Việt Nam.
Nhiệm vụ của bạn là dự đoán và hoàn thiện ý định tìm kiếm của người dùng bằng ngôn ngữ tự nhiên, tập trung vào:
- Nghiên cứu chương trình Affiliate (hoa hồng, EPC, cookie)
- Phân tích nguồn traffic (SEO, Ads, Facebook, TikTok, Organic)

Quy tắc quan trọng:
1. Gợi ý PHẢI bằng ngôn ngữ của user.
2. IMPORTANT: Gợi ý phải kết hợp từ khóa người dùng nhập với các khía cạnh phân tích. (Ví dụ: người dùng nhập "nước hoa" -> gợi ý "Nghiên cứu thị trường nước hoa", "Top chương trình affiliate nước hoa", "Phân tích đối thủ bán nước hoa").
3. Giữ gợi ý ngắn gọn, chuyên nghiệp (dưới 10 từ).
4. Tối đa 5 gợi ý.
5. Chỉ trả về một mảng JSON các chuỗi ký tự."""
        },
        {
            "role": "user",
            "content": f'Complete this input: "{prompt}"'
        }
    ]
    
    data = {
        "model": TARGET_MODEL,
        "messages": messages,
        "temperature": 0,
        "max_tokens": 600
    }
    
    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=data, timeout=5)
        response.raise_for_status()
        
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        logger.info(f"OpenRouter response for '{prompt}': {content[:100]}...") # Log first 100 chars
        
        # Parse JSON content
        try:
            # Handle markdown code blocks if present
            cleaned_content = content.replace('```json', '').replace('```', '').strip()
            # Try to find the first '[' and last ']' to extract just the array
            start = cleaned_content.find('[')
            end = cleaned_content.rfind(']')
            if start != -1 and end != -1:
                cleaned_content = cleaned_content[start:end+1]
            
            parsed = json.loads(cleaned_content)
            
            if isinstance(parsed, list):
                # Ensure all items are strings
                return [str(item) for item in parsed if isinstance(item, (str, int, float))]
            if isinstance(parsed, dict):
                if 'suggestions' in parsed and isinstance(parsed['suggestions'], list):
                    return [str(item) for item in parsed['suggestions'] if isinstance(item, (str, int, float))]
                # Fallback: use values of the dict if no suggestions key
                return [str(v) for v in parsed.values() if isinstance(v, (str, int, float))]
            
            return []
        except (json.JSONDecodeError, ValueError):
            # Fallback strategy
            potential_suggestions = []
            for line in content.split('\n'):
                line = line.strip()
                if not line: continue
                
                # Check if line itself is a JSON array
                if line.startswith('[') and line.endswith(']'):
                    try:
                        parsed_line = json.loads(line)
                        if isinstance(parsed_line, list):
                            potential_suggestions.extend([str(i) for i in parsed_line if isinstance(i, (str, int, float))])
                            continue
                    except:
                        pass
                
                # Cleaning
                cleaned = line.strip(' ",\'[]{}')
                
                if not cleaned: continue

                # content like "key": "value"
                if ':' in cleaned:
                    parts = cleaned.split(':', 1)
                    if len(parts) == 2:
                        cleaned = parts[1].strip(' ",\'{}')
                
                if not cleaned: continue

                if len(cleaned.split()) < 15 and not cleaned.lower().startswith('here') and not cleaned.startswith('```'):
                    # Check for merged items like "foo", "bar"
                    if '", "' in cleaned:
                         splits = cleaned.split('", "')
                         for s in splits:
                             potential_suggestions.append(s.strip('"'))
                    elif "', '" in cleaned:
                         splits = cleaned.split("', '")
                         for s in splits:
                             potential_suggestions.append(s.strip("'"))
                    else:
                        potential_suggestions.append(cleaned)
            
            return potential_suggestions[:5]
            
    except Exception as e:
        logger.error(f"Error fetching suggestions: {e}")
        return []
    finally:
        logger.info(f"Suggestion fetch took {time.time() - start_time:.2f}s")
