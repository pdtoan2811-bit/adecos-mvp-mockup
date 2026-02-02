# Product Requirement Document (PRD) - Adecos MVP

## 1. User Personnel
- **Role**: Affiliate Manager / Marketer.
- **Language**: Vietnamese.
- **Need**: Fast, structured insight into a niche.

## 2. User Experience (UX)
### 2.1 Initial State
- **Visuals**: Overwhelmingly minimalist. Elegant Serif fonts. Glassmorphism background.
- **Elements**:
    - Menu (Top/Side).
    - Central Chat Prompt (Gemini-style).
    - "Dynamic" feel (micro-animations).

### 2.2 Interaction Flow
1. User enters niche or question.
2. **Transition**: Input stays sticky at bottom.
3. **Response**: AI determines best format:
    - **Research Request**: Renders **Results Table**.
    - **Follow-up/Question**: Renders **Text Bubble** (Markdown).
4. **Conversation**: User can ask follow-ups ("Explain row 1"). System maintains context.

## 3. Functional Requirements
### 3.1 Chat Stream
- Vertical scrollable timeline.
- Distinguishes User vs AI messages.
- AI messages can contain **Structured Widgets** (Tables) or **Rich Text**.

### 3.2 Agentic Decision Making (Simulated CrewAI)
- **Router**: Analyzes prompt to decide: "Need Data?" vs "Need Explanation?".
- **Data**: Uses Table Widget.
- **Explanation**: Uses Text Widget.

### 3.3 Result Table
Columns:
- **Brand**: Name of the company.
- **Website**: Affiliate program URL.
- **Incentive**: Commission rate / Cookie duration.
- **Terms**: Ads policy (Brand keywords allowed?).
- **Traffic**: Last 3 months visits (Mocked).
- **Legitimacy Score**: AI-calculated 0-100 score.

### 3.4 Tools
- **Sort**: Clickable headers to sort by Score or Traffic.
- **Save**: Button to persist the current specific research.

## 4. UI Design Specs
- **Style**: Glassmorphism (Blur, Translucency, Subtle Borders).
- **Typography**: Elegant Serif (e.g., Merriweather, Playfair Display).
- **Color Palette**: Dark mode preferred or high-contrast elegant light mode.
