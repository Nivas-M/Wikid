# PRD: WikiFeed (working title)
### "Social media for people who want to learn something"

---

## 1. Problem / Why

Existing social media optimizes for addiction, not learning. Existing "Wikipedia + feed" apps (WikiTok, Xikipedia) fix the addiction problem but strip out *all* social features — no accounts, no comments, no way to signal "this is genuinely useful." There's no product that's social media-*shaped* (Reddit/Instagram-style posts, likes, comments) but built entirely around learning content, with zero follow/friend graph.

## 2. Vision

A feed of Wikipedia knowledge, presented as Reddit-style posts (image + text), where likes mean "this taught me something," comments are people's actual thoughts on the topic, and there is **no following, no friend graph, no DMs** — sharing happens externally (WhatsApp/message links). Personalized purely by your own behavior, not a social graph.

## 3. Target user

People who like learning random/interesting facts but are tired of algorithmic doomscrolling and TikTok-style video feeds — want something closer to a "Reddit for knowledge."

## 4. Phase 1 — MVP (this is what we build first)

**Goal: prove the core content experience works before touching accounts, likes, or personalization.**

### In scope
- Pull Wikipedia articles (starting with **trending** articles) via the Wikipedia API.
- Convert each article into a **standard post template**:
  - Hook title
  - Featured image
  - Short supporting text/summary
- Display posts in a **Reddit-style scrollable feed** (card format — NOT vertical swipe/reels).
- **Double-tap a post** → opens the full Wikipedia article.
- No backend database required yet — static/generated feed is fine.

### Explicitly OUT of scope for Phase 1
- Accounts / login
- Likes
- Comments
- Personalization
- Save-for-later

### Success criteria for Phase 1
- Can reliably convert a batch of trending Wikipedia pages into the post template automatically.
- Feed is scrollable and feels like a real app, not a raw API dump.
- Double-tap reliably opens the correct full article.

## 5. Phase 2 — Accounts, Likes, Save-for-later

- User accounts (needed to support likes/comments later).
- **Like** = validation signal ("this is a good/useful/fun topic") — visible as a count (social proof) on the post.
- **Save for later** — bookmarkable, separate from liking.
- Personalization engine (v1): based purely on the user's own likes / time-spent / saves — no social graph input.
- Consider a **Wordle-style daily featured topic** — one spotlighted topic per day, alongside the regular feed.
- Consider category buckets (science, history, geography, weird facts) to make personalization cleaner once it's added.

## 6. Phase 3 — Comments

- Instagram-style comments: short thoughts on the post, no threading complexity needed initially.
- **Moderation required from day one of this phase** — at minimum a profanity/toxicity filter + report button.

## 7. Explicit non-goals (all phases)

- No following/friending other users.
- No DMs.
- No algorithmic "engagement-maximizing" feed — personalization should be transparent and user-driven, not black-box.
- In-app sharing is out — sharing happens via external message/WhatsApp links.

## 8. Open questions (revisit later, not blockers for Phase 1)

- Content sourcing beyond "trending": consider Wikipedia's "On this day" / featured article feed for daily freshness.
- Content integrity: should posts check that a Wikipedia article hasn't been recently vandalized before converting it? (nice-to-have, not MVP)
- Security angles to layer in once accounts/comments exist: session hygiene (drawing on earlier SessionGuard research), input sanitization on comments, object-level authorization on user-specific endpoints (saved lists, etc.), local-only/privacy-preserving personalization.

## 9. Suggested stack (matches existing skills)

- Frontend: Next.js + Tailwind
- Content pipeline: Wikipedia API (MediaWiki API / REST API) for trending + article content/images
- Phase 1: no backend DB needed (static generation or simple serverless fetch)
- Phase 2+: Node/Express or Next.js API routes + MongoDB (or Postgres) for accounts, likes, saves

## 10. Competitive landscape (for reference)

| App | Format | Accounts | Comments | Personalization |
|---|---|---|---|---|
| WikiTok | TikTok-style vertical swipe | No | No | No (intentionally algorithm-free) |
| Xikipedia | Card feed | No | No | Yes (local, on-device) |
| **This project** | Reddit-style card feed | **Yes (Phase 2)** | **Yes (Phase 3)** | Yes (user-behavior based) |

Accounts + comments + Reddit-style format is the clear differentiation gap in the market.
