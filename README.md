# REMI--the-dementia-assistant
# REMI
### Remember what matters.

REMI is an AI-powered memory companion for people living with dementia. It stays quietly present through everyday moments, turns meaningful interactions into simple memories, and brings that context back gently when it's needed — without asking the person to work for it.

---

## The problem

Dementia can make familiar people and everyday moments feel unfamiliar. A person may lose track of who someone is, what was recently discussed, or an upcoming plan. Caregivers try to fill these gaps, but they can't be present every moment — and the loss isn't just memory, it's confidence and connection.

## The idea

Instead of asking someone to manage their own memory, REMI makes the phone itself do the remembering.

```
OBSERVE  →  UNDERSTAND  →  REMEMBER  →  RECONNECT
```

- **Observe** — REMI stays present, recognizing familiar people and picking up on meaningful conversation.
- **Understand** — an AI layer extracts what actually matters (who, what, when) instead of keeping raw recordings.
- **Remember** — that context becomes a short, structured memory tied to a person.
- **Reconnect** — REMI surfaces the memory again at the right moment, gently and without pressure.

**Example:** REMI recognizes Aarav, the user's grandson. During their visit he says, "I'll come see you tomorrow." REMI doesn't save the conversation — it saves that Aarav is the grandson, he visited today, and he's coming back tomorrow. The next time it's useful, REMI reminds the person of exactly that, warmly.

The goal isn't to test someone's memory. It's to give them context when they need it.

---

## What's in this prototype

A clickable, phone-frame mobile prototype covering the full core experience:

| Screen | What it does |
|---|---|
| **Onboarding** | Introduces REMI and its purpose in one screen |
| **Home** | Greeting, an always-on status indicator, recent memory cards, and a "Who is this?" shortcut into recognition |
| **Recognize** | Simulates always-on person recognition — REMI identifies who's in front of it automatically, no manual scan required |
| **Conversation memory** | Listens, "understands" what was said, and turns it into an editable structured memory before saving |
| **My Memories** | A chronological timeline of everything REMI has remembered, grouped by day |
| **People** | Every registered person, their relationship, notes, and memory history — caregivers can add new people here |
| **Caregiver** | Inactivity alert threshold, memory retention window, and the privacy principles the product is built on |
| **Phone-left-behind alert** | A simulated gentle nudge if the phone has been stationary too long, demoable on demand |

All data is seeded and held in memory for the demo (Aarav the grandson, Priya the daughter, Raj the family doctor) — nothing is wired to a real backend.

## Design approach

REMI is built to feel like a calm, trustworthy companion — not a clinical or medical tool.

- **Palette:** warm greige background, sage green as the primary accent, a small amount of warm amber, charcoal ink text — deliberately avoiding a hospital or "AI app template" look
- **Type:** Sora for headlines, Inter for body copy — both chosen for warmth and high legibility, since the target user may have difficulty reading small or decorative type
- **Signature motion:** a slow "breathing" pulse (roughly a 4-second cycle) used behind the mic, a recognized face, and reconnection prompts — meant to feel like REMI's calm presence rather than a loading spinner or notification badge

## On always-on sensing

REMI is designed to always be present rather than requiring the user to manually trigger recognition. In a real build this would mean lightweight, on-device wake detection for audio and motion/proximity-triggered camera checks — not literal continuous raw recording, which isn't something mobile platforms allow for third-party apps and would work against the product's own privacy promise. Only short, meaningful summaries are ever kept; raw audio and video are not retained.

## Tech stack (prototype)

- React + Vite
- Tailwind CSS
- lucide-react for icons
- All state is local (`useState`) — no backend, no persistence between sessions

## Running it locally

```bash
npm install
npm run dev
```

## Where this could go next

Smart glasses for real-time recognition, wearable integration, a multilingual voice companion, medication/appointment support, wandering and safety assistance, caregiver analytics, and stronger on-device/offline AI for privacy.
