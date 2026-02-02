# Software Requirements Specification (SRS) - Adecos MVP

## 1. Architecture
- **Pattern**: Client-Server (REST API).
- **Frontend**: Single Page Application (SPA).
- **Backend**: Async Web Server.

## 2. Technology Stack
- **Frontend**:
    - React (Vite).
    - Tailwind CSS (Styling).
    - Framer Motion (Animations, optional but recommended for "wow").
- **Backend**:
    - Python 3.x.
    - FastAPI.
    - `google-generativeai` library.
    - Pydantic (Data Validation).

## 3. Data Model (JSON Structure)
### 3.1 Request
```json
{
  "messages": [
    {"role": "user", "content": "Find camping programs"}
  ]
}
```

### 3.2 Response (Streamed)
The AI streams chunks. The aggregated result is a JSON object with:
```json
{
## 3. Data Model
Each affiliate program has:
- **brand**: Brand/program name (string)
- **program_url**: Affiliate signup URL (string)
- **commission_percent**: Commission percentage as number (e.g., 10 for 10%, 15 for 15%). 0 if CPA/flat rate (number)
- **commission_type**: Type of commission - "percentage", "cpa", "hybrid" (string)
- **can_use_brand**: Whether affiliates can use brand name in ads (boolean: true/false)
- **traffic_3m**: Estimated traffic or trend (string, e.g., "12M+", "500k/tháng")
- **legitimacy_score**: AI confidence score 0-10 (number)

## 4. External Interfaces
### 4.1 Gemini API w/ Context
- **Model**: `gemini-3-flash-preview` (latest model for optimal performance)
- **System Instruction**: Updated to act as an "Orchestrator" that outputs a specific schema (Type + Content).
- **History**: Passed to generate_content to allow "Explain this" follow-ups.

## 5. API Endpoints
- `POST /api/research/stream`: Accepts `{ niche: string }`. Returns chunked JSON stream.
- `POST /api/chat/stream` - POST
Accepts `ChatRequest` JSON with `messages: list`. Returns NDJSON stream with `type: "table"` or `type: "text"`.

**AI Intent Classification**: Uses Gemini API to intelligently classify user intent before generating response.

**Intent Types**:
- `research`: User wants affiliate program recommendations (returns table)
- `explanation`: User wants to understand/learn something (returns text)
- `followup`: User asking about previous response (returns table)

**Routing Logic**:
1. Classify intent using `intent_classifier.py` module
2. Use Gemini `gemini-3-flash-preview` for classification
3. Based on intent, route to appropriate response generator
4. Fallback to research mode if classification fails

**Classification Process**:
- Analyzes user query with conversation context
- Returns intent type, confidence score, and reasoning
- Logs classification decisions to server console for debugging

**Model**: `gemini-3-flash-preview` (DO NOT CHANGE)

**JSON Processing**:
- Strips markdown code blocks from AI output
- Validates and formats JSON arrays for table responses
- Escapes special characters in text responses

## 6. Non-Functional Requirements
- **Latency**: First token < 2s.
- **Language**: All static text in Vietnamese.
- **Responsive**: Desktop first, mobile compatible.
