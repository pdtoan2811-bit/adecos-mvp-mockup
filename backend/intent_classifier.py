"""
Intent Classifier for Adecos MVP Chat System

This module uses Gemini API to intelligently classify user intents for better routing.
IMPORTANT: Always use gemini-3-flash-preview - DO NOT CHANGE
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

# IMPORTANT: Always use gemini-3-flash-preview - DO NOT CHANGE
MODEL_NAME = "gemini-3-flash-preview"

# Intent types
INTENT_RESEARCH = "research"       # User wants affiliate program recommendations/data
INTENT_EXPLANATION = "explanation" # User wants to learn/understand something
INTENT_FOLLOWUP = "followup"       # User asking about previous response

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

CLASSIFIER_PROMPT = """You are an intent classifier for an affiliate marketing research assistant.

Analyze the user's query and classify their intent into ONE of these categories:

1. **RESEARCH** - User wants to find affiliate programs, search for opportunities, or get program recommendations
   Examples: "Forex", "crypto programs", "beauty ecommerce", "find finance affiliates", "gaming niche"
   
2. **EXPLANATION** - User wants to understand, learn about, or get clarification on something
   Examples: "What is affiliate marketing?", "Why is this score high?", "How does this work?", "Explain row 1"
   
3. **FOLLOWUP** - User is asking about a previous response or wants more details on something already discussed
   Examples: "tell me more", "expand on that", "the first one", "details about that program"

User Query: "{query}"

Previous Context: {context}

Respond ONLY with valid JSON in this exact format:
{{"intent": "research|explanation|followup", "confidence": 0.XX, "reasoning": "brief explanation"}}

Be decisive. Default to "research" if uncertain, as that's the primary use case."""


async def classify_intent(user_query: str, conversation_history: list = None) -> dict:
    """
    Classify user intent using Gemini API.
    
    Args:
        user_query: The current user message
        conversation_history: Optional list of previous messages for context
        
    Returns:
        dict: {"intent": "research|explanation|followup", "confidence": float, "reasoning": str}
    """
    try:
        # Build context from conversation history
        context = "None (first message)"
        if conversation_history and len(conversation_history) > 0:
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
        
        # Format the prompt
        prompt = CLASSIFIER_PROMPT.format(query=user_query, context=context)
        
        # Use Gemini to classify
        model = genai.GenerativeModel(MODEL_NAME)
        response = await model.generate_content_async(prompt)
        
        # Parse response
        response_text = response.text.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            if lines[0].startswith('```'):
                lines = lines[1:]
            if lines and lines[-1].strip() == '```':
                lines = lines[:-1]
            response_text = '\n'.join(lines).strip()
        
        # Parse JSON
        result = json.loads(response_text)
        
        # Validate result
        if "intent" not in result:
            raise ValueError("Missing 'intent' in response")
        
        # Ensure intent is valid
        valid_intents = [INTENT_RESEARCH, INTENT_EXPLANATION, INTENT_FOLLOWUP]
        if result["intent"] not in valid_intents:
            # Default to research if invalid
            result["intent"] = INTENT_RESEARCH
            result["confidence"] = 0.5
            result["reasoning"] = "Invalid intent returned, defaulting to research"
        
        return result
        
    except Exception as e:
        # If classification fails, default to research (safest assumption)
        return {
            "intent": INTENT_RESEARCH,
            "confidence": 0.5,
            "reasoning": f"Classification failed: {str(e)}, defaulting to research"
        }


def get_intent_type(classification_result: dict) -> str:
    """
    Extract the intent type from classification result.
    
    Args:
        classification_result: Result from classify_intent()
        
    Returns:
        str: Intent type (research|explanation|followup)
    """
    return classification_result.get("intent", INTENT_RESEARCH)


def is_research_intent(classification_result: dict) -> bool:
    """
    Check if the classified intent is a research request.
    
    Args:
        classification_result: Result from classify_intent()
        
    Returns:
        bool: True if intent is research or followup (both generate tables)
    """
    intent = get_intent_type(classification_result)
    # Treat followup as research since users often want more programs
    return intent in [INTENT_RESEARCH, INTENT_FOLLOWUP]
