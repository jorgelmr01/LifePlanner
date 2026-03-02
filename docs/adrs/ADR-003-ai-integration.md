# ADR-003: AI Integration Approach

**Status:** Accepted  
**Date:** January 2026  
**Decision Makers:** Development Team

---

## Context

Life Copilot includes an optional AI "Copilot" feature that provides:
- Natural language chat interface (J1 screen)
- Voice input with transcription (J2 screen)
- Parsing user input to propose structured changes (J3 screen)
- Context-aware suggestions based on user data

Key requirements from PRODUCT_SPEC.md Section 7:
- AI is always optional - app works 100% without it
- User provides their own API key
- Nothing executes without user confirmation
- User controls what data the AI can access
- Configurable limits (no opinions on religion, etc.)

## Decision

**We will use OpenAI APIs (GPT-4 for chat, Whisper for speech-to-text) with user-provided API keys, and a structured prompt engineering approach for reliable data extraction.**

## Options Considered

### Option A: OpenAI APIs (GPT-4 + Whisper)
**Pros:**
- Industry-leading language understanding
- Excellent multilingual support (Spanish is primary)
- Structured output support (function calling / JSON mode)
- Whisper provides accurate transcription
- Simple API integration
- Pay-per-use via user's API key

**Cons:**
- Requires internet connection
- Costs passed to user
- Rate limits apply to user's key
- Data leaves device (privacy consideration)

### Option B: Local LLM (llama.cpp, MLX)
**Pros:**
- Complete privacy (no data leaves device)
- Works offline
- No API costs

**Cons:**
- Significantly worse quality for complex tasks
- Large model sizes (2-7GB)
- Battery and performance impact
- Limited multilingual support
- Inconsistent structured output

### Option C: Multiple Provider Support
**Pros:**
- User choice (OpenAI, Anthropic, Google, etc.)
- Redundancy if one service is down

**Cons:**
- Complex prompt engineering across providers
- Different capabilities and limitations
- More maintenance burden

### Option D: Hosted Backend
**Pros:**
- Can use any AI model
- Hide API keys from users
- More control over costs

**Cons:**
- Requires running servers
- Ongoing hosting costs
- More complex architecture
- Privacy concerns (data through our servers)

## Rationale

OpenAI APIs with user-provided keys is chosen because:

1. **Quality**: The Copilot needs to reliably parse complex natural language into structured actions. GPT-4's function calling provides consistent JSON output.

2. **User Control**: Following DESIGN_DECISIONS.md, users control their AI usage and costs directly through their own API key.

3. **Privacy Aligned**: While data is sent to OpenAI, users explicitly opt-in and understand this. No data goes through our servers.

4. **Spanish Support**: GPT-4 and Whisper have excellent Spanish language support, important for the target audience.

5. **Simple Architecture**: Direct API calls from client keep the architecture simple and local-first aligned.

6. **Gradual Adoption**: Users without API keys still have a fully functional app with rule-based suggestions.

## Consequences

### Positive
- High-quality AI responses and transcription
- No backend infrastructure needed
- Users have full cost visibility
- Simple integration path
- Scales with user base (no server costs for us)

### Negative
- Requires internet for AI features
- User must obtain and manage API key
- OpenAI sees user prompts (privacy trade-off)
- API changes require app updates

### Risks
- OpenAI API pricing changes could affect user costs
- API availability is outside our control
- User confusion about API key setup

### Mitigations
- Clear onboarding explaining API key requirement
- Cache recent responses for offline viewing
- Implement graceful degradation when API unavailable
- Consider adding Anthropic/Google as future alternative

## Implementation Notes

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Flutter App                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────┐    ┌──────────────┐                 │
│   │   Chat UI    │    │   Voice UI   │                 │
│   │    (J1)      │    │    (J2)      │                 │
│   └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                          │
│          └─────────┬─────────┘                          │
│                    │                                    │
│          ┌────────▼────────┐                           │
│          │  Copilot Service │                           │
│          │                  │                           │
│          │  - Context builder│                          │
│          │  - Prompt manager │                          │
│          │  - Response parser│                          │
│          └────────┬─────────┘                           │
│                   │                                     │
│    ┌──────────────┼──────────────┐                     │
│    │              │              │                     │
│    ▼              ▼              ▼                     │
│ ┌──────┐    ┌──────────┐   ┌──────────┐              │
│ │ Chat │    │ Speech   │   │ Proposed │              │
│ │ API  │    │ to Text  │   │ Changes  │              │
│ └──┬───┘    └────┬─────┘   │ Builder  │              │
│    │             │         └────┬─────┘              │
└────┼─────────────┼──────────────┼────────────────────┘
     │             │              │
     ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
│                                                          │
│   ┌────────────────┐    ┌────────────────────┐         │
│   │  OpenAI API    │    │  Whisper API       │         │
│   │  (GPT-4)       │    │  (Speech-to-Text)  │         │
│   │                │    │                    │         │
│   │  User's Key    │    │  User's Key        │         │
│   └────────────────┘    └────────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### System Prompt Structure

```dart
const systemPrompt = '''
You are Life Copilot, a personal assistant helping the user track their life.

CONTEXT:
User name: {{userName}}
Today: {{currentDate}}
Active areas: {{areas}}
Active rhythms: {{rhythms}}  
Active goals: {{goals}}
Recent people interactions: {{people}}

YOUR ROLE:
- Help the user register their day quickly
- Parse their natural language into structured data
- Suggest actions but never judge
- Respect configured limits

CONFIGURED LIMITS:
{{userLimits}}

RESPONSE FORMAT:
Always respond with a JSON object containing:
{
  "message": "Your conversational response to the user",
  "proposed_changes": [
    {
      "type": "entry" | "rhythm_check" | "interaction" | "reminder",
      "data": { ... specific data for the action ... },
      "confidence": 0.0-1.0
    }
  ]
}

RULES:
- Never execute changes, only propose
- Be warm but not verbose (unless coaching mode)
- If user expresses emotional difficulty, validate first, suggest actions later
- Never give medical/mental health advice
- Never judge uncompleted rhythms or ignored areas
''';
```

### Function Calling Schema

```dart
final functions = [
  {
    'name': 'propose_entry',
    'description': 'Propose creating a journal entry',
    'parameters': {
      'type': 'object',
      'properties': {
        'content': {'type': 'string'},
        'mood': {'type': 'integer', 'minimum': 1, 'maximum': 5},
        'energy': {'type': 'integer', 'minimum': 1, 'maximum': 5},
        'areas': {'type': 'array', 'items': {'type': 'string'}},
        'people': {'type': 'array', 'items': {'type': 'string'}},
      },
      'required': ['content'],
    },
  },
  {
    'name': 'propose_rhythm_check',
    'description': 'Propose marking a rhythm as completed',
    'parameters': {
      'type': 'object',
      'properties': {
        'rhythm_id': {'type': 'string'},
        'duration_minutes': {'type': 'integer'},
        'notes': {'type': 'string'},
      },
      'required': ['rhythm_id'],
    },
  },
  {
    'name': 'propose_interaction',
    'description': 'Propose registering a person interaction',
    'parameters': {
      'type': 'object',
      'properties': {
        'person_id': {'type': 'string'},
        'type': {'type': 'string', 'enum': ['call', 'message', 'in_person', 'event']},
        'duration_minutes': {'type': 'integer'},
        'notes': {'type': 'string'},
      },
      'required': ['person_id', 'type'],
    },
  },
];
```

### Key Packages
- `dio: ^5.x` - HTTP client
- `flutter_sound: ^9.x` - Audio recording
- `record: ^5.x` - Alternative audio recording
- `just_audio: ^0.9.x` - Audio playback

### API Key Storage

```dart
class ApiKeyService {
  final FlutterSecureStorage _storage;
  
  Future<void> saveApiKey(String key) async {
    await _storage.write(key: 'openai_api_key', value: key);
  }
  
  Future<String?> getApiKey() async {
    return await _storage.read(key: 'openai_api_key');
  }
  
  Future<bool> validateApiKey(String key) async {
    try {
      final response = await Dio().get(
        'https://api.openai.com/v1/models',
        options: Options(headers: {'Authorization': 'Bearer $key'}),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
```

### Cost Estimation Display

```dart
// Show estimated cost before processing
class CostEstimator {
  static const chatCostPer1kTokens = 0.03; // GPT-4
  static const whisperCostPerMinute = 0.006;
  
  String estimateChatCost(String input) {
    final tokens = _estimateTokens(input);
    final cost = (tokens / 1000) * chatCostPer1kTokens;
    return '\$${cost.toStringAsFixed(4)}';
  }
  
  String estimateVoiceCost(Duration duration) {
    final cost = duration.inSeconds / 60 * whisperCostPerMinute;
    return '\$${cost.toStringAsFixed(4)}';
  }
}
```

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- PRODUCT_SPEC.md Section 7 (Copiloto AI - Comportamiento)
- DESIGN_DECISIONS.md Section "Historial del copiloto"
