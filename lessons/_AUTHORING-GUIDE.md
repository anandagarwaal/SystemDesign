# Lesson Authoring Guide (for lesson-writer subagents)

You are writing ONE self-contained HTML lesson for a System Design course aimed at
a **beginner preparing for L6/L7 (staff+) FAANG interviews**, in the style of
hellointerview.com. Read this guide fully, then produce the file.

## Teaching method (Math Academy style — required for every lesson)
This course follows Justin Skycak's "The Math Academy Way": diagnose before you
teach, chunk material small, quiz relentlessly (including intuition/"why"
questions, not just recall), and resurface material later per the forgetting
curve. Concretely, every lesson MUST:
1. Break its content into `<section class="chunk" id="chunk-N">` blocks — one
   sub-idea per chunk, small enough to read in under ~2 minutes.
2. Gate every chunk except the last behind a `.gate` block with 1-2 recall
   questions AND at least one `data-type="intuition"` question ("why does this
   work", "what breaks if you removed X", "picture the mechanism — what
   happens when..."). Never let a chunk unlock on recall alone.
3. Give every question a stable, globally-unique `data-concept="kebab-case-id"`
   — this feeds the spaced-repetition schedule in `reference/mastery.js`.
   Never reuse an id across lessons unless you are deliberately re-testing the
   same concept.
4. Use `hidden` on every chunk after the first; `reference/mastery.js` reveals
   the next chunk only once every question in the current gate is answered
   correctly. Wrong answers show `.hint` and re-arm the question — there is no
   soft-pass. Do not write your own gating JS; include the shared script:
   `<script src="../reference/mastery.js"></script>`.
5. End with a comprehensive final chunk (`id="chunk-final"` or similar) whose
   gate spans every chunk in the lesson, mixing recall and intuition questions.
6. Never assume an unstated prerequisite. If a lesson depends on a concept not
   yet taught in the course, either teach it in a chunk first or add a short
   "you should already know: X, Y" checklist and point to
   `lessons/0000-prereq-diagnostic.html` or the relevant earlier lesson.

## Hard rules
1. **Copy the exact `<style>` block from `lessons/_TEMPLATE.html` verbatim**
   (it defines `.chunk`, `.gate`, `.q`, `.opt`, `.hint`, `.fb`, etc.) and use
   `<script src="../reference/mastery.js"></script>` for the gating/quiz logic
   — do not restyle or hand-roll quiz JS. Visual consistency is mandatory.
2. **Ground in the source.** Use the WebFetch tool on the URL(s) given in your brief.
   Extract real content. Add `<a href="#cN" class="cite">[N]</a>` citations inline
   wherever you state a fact from a source, and list the sources in the footer
   `Citations` block. If a page is paywalled/404, fetch what you can and rely on
   well-established CS fundamentals — never fabricate a specific claim and attribute
   it to a source you couldn't read.
3. **Keep it tight.** Working memory is small. A concept lesson should be readable in
   ~8–12 minutes; a case study in ~20–25 minutes (it carries the full interview walkthrough). Favor tables, decision boxes, and short paragraphs over walls of text.
4. **Top of page:** `← Course home` link (already in template), kicker line with the
   correct lesson number + phase, H1 title, italic subtitle, and the `.mission`
   callout tying the topic to the L6/L7 interview goal.
5. **`.staff` callout (required):** at least one green "★ Staff-level signal" box
   explaining what moves this topic from senior to staff — e.g. simple-by-default,
   proactive deep dives, judgement on alternatives, not over-explaining basics.
6. **Gated quizzes (required):** per the Teaching method section above — a `.gate`
   after every chunk, `data-correct` is the letter (a/b/c/d) of the right option,
   plus `data-concept` id and at least one `data-type="intuition"` question per
   gate. **Every option within a question must be the same length** (aim equal
   word AND character count) so formatting gives no tells. Include a `.fb`
   explanation and a `.hint` for wrong answers.
7. **`.ask` box (required):** remind the learner the agent is their teacher and give
   2–3 concrete followup prompts tied to this topic.
8. **Primary source (required):** recommend the single best source to read/watch.
9. **Footer nav (required):** Course home + previous lesson + glossary + "Next up →".
10. Output must be a complete, valid HTML file. The one permitted external
    asset is `<script src="../reference/mastery.js"></script>` for gating.

## Section structure by lesson type

### Core-concept lessons (Phase 1–3)
- 4–7 short H2 sections teaching the concept from the ground up (assume beginner).
- Use a decision box (`.box`) or comparison table where there's a "when to use which"
  choice — that's the interview-relevant part.
- End conceptual content with how it shows up in a design interview.

### Case-study lessons (Phase 4) — MUST follow the staff-interview walkthrough format
A case study reads as a timed, 60-minute staff-level interview walkthrough. Every case
study MUST contain ALL of these H2 sections, IN THIS ORDER, with these exact headings
(the only optional one is Data Flow), grouped into the phases below. A lesson missing any
section or walkthrough element is incomplete.

**Walkthrough phases** (each opens with a phase banner; minutes are for a 60-min loop):
| Phase | Min | H2 sections |
|---|---|---|
| 1 · Clarify the problem | 0–5 | Functional Requirements, Non-Functional Requirements |
| 2 · Estimate what matters | 5–10 | Capacity Estimation |
| 3 · API & data model | 10–17 | Core Entities & API, Data Model |
| 4 · High-level design | 17–27 | [Data Flow], Component Diagram, High-Level Design |
| 5 · Deep dives & tradeoffs | 27–47 | Deep Dives, Alternative Approaches & Tradeoffs |
| 6 · Production readiness | 47–54 | Observability, Monitoring, Authentication & Authorization, Security, Privacy |
| 7 · Scale & cost | 54–58 | Scaling 10× Without Changing the Architecture, Cost of Running |
| Wrap-up | 58–60 | Closing Summary (60 seconds) |

**Walkthrough elements** (all lesson-specific — never generic):
- `div.agenda` right after the mission box: the phase / minutes / sections / goal table,
  plus a note on compressing to 45 minutes.
- `div.phase` banner (`id="phase-N"`, `id="phase-wrap"`) before each phase's first H2.
- `div.asks` ("Ask before you design") right after the Phase 1 banner: 3 clarifying
  questions, each with why the answer changes the design.
- `div.pushback` at the end of phases 2–7: one likely interviewer challenge on that
  phase's content, with a concise staff-level answer.
- `p.transition` at the end of every phase: the sentence you say to move on, tying what
  you just established to what comes next.
- `h2` **Closing Summary (60 seconds)** + `div.summary`: a ~100-word recap of the key
  decisions, tradeoffs, and what happens at 10×.
- If a lesson numbers its H2s ("1 · …"), keep the numbering sequential in this order.

**Section content:**
1. **Functional Requirements** — 3 core "users should be able to…" (table or list).
2. **Non-Functional Requirements** — 3–5 "-ilities" with the specific target/priority.
3. **Capacity Estimation** — back-of-envelope QPS / storage / bandwidth, but ONLY the
   numbers that influence the design; state the design implication of each.
4. **Core Entities & API** — 2–3 entities, then 4–6 REST endpoints
   (`POST /v1/...`), deriving user from auth token. (This is the API design section.)
5. **Data Model** — a table: Entity · Store (which DB and why) · Keys (PK / partition /
   sort key) · Indexes / access pattern. Add 1–2 sentences on the load-bearing modeling
   choice (e.g. partition key chosen to avoid hot spots, blob vs. metadata split).
6. **Data Flow** — include ONLY for data-processing systems (crawlers, aggregators,
   pipelines, feeds); otherwise omit this H2.
7. **Component Diagram** — a plain-ASCII boxes-and-arrows diagram in
   `<pre class="diagram">…</pre>` (no images, no external libs). Use `[Box]`, `-->`, `|`,
   `v`, `+` only (box-drawing/arrow glyphs misalign in some fonts; write `<` as `&lt;`).
   Keep it ≤ ~80 columns (the block scrolls horizontally on phones),
   show clients, edge (CDN/LB/gateway), services, queues, caches, and data stores, and
   label the arrows with the flow. One-line caption underneath.
8. **High-Level Design** — how each API request flows through the components in the
   diagram. Prose + a simple table; note the data stores.
9. **Deep Dives** — 2–4 deep dives on the hard parts / bottlenecks / NFRs. THIS IS
   THE MOST IMPORTANT SECTION for an L6/L7 audience — give it the most space, show
   alternatives with tradeoffs and a justified pick. This is where the 60% depth lives.
10. **Alternative Approaches & Tradeoffs** — 2–3 *whole-architecture* alternatives to
    the chosen design (not a repeat of one deep dive). Table: Approach · How it works ·
    Wins · Loses · When you'd pick it. End with a one-line justified pick.
11. **Observability** — what the system emits so you can *ask questions* of it: key
    metrics (RED/USE + 1–2 business metrics), structured logs with correlation IDs,
    distributed traces across the critical path, sampling choices.
12. **Monitoring** — how humans find out something is wrong: SLOs with numbers tied to
    the NFRs, alerts (page vs. ticket), dashboards, synthetic probes. Distinct from
    Observability (signals) — this is SLOs + alerting on those signals.
13. **Authentication & Authorization** — who calls what and how they prove it (end-user
    OAuth/OIDC + short-lived tokens, service-to-service mTLS, API keys), the authz model
    (ownership / RBAC / ReBAC) and where it is enforced.
14. **Security** — table: Threat · Mitigation. Cover the domain-specific abuse cases
    first (scraping, fraud, double-spend, untrusted code…), then the baseline (TLS,
    encryption at rest, secrets management, rate limiting/WAF/DDoS, input validation).
15. **Privacy** — PII inventory, data minimization, retention & deletion (GDPR/CCPA
    right-to-erasure), field-level encryption of sensitive data, access auditing,
    residency. Say plainly if the system holds little PII.
16. **Scaling 10× Without Changing the Architecture** — table: Component · Today ·
    At 10× · Knob turned (add shards/partitions/replicas/nodes, raise cache size, CDN).
    Name the first bottleneck to hit, and what would *finally* force an architecture
    change (typically ~100×).
17. **Cost of Running** — order-of-magnitude monthly cost table by line item, using the
    reference price sheet below and the numbers from Capacity Estimation. State the
    assumptions, give a total, a unit cost ($ per 1M requests / per 1k DAU / per GB),
    name the dominant cost driver and one lever to cut it.
18. **Closing Summary (60 seconds)** — see walkthrough elements above; recap, don't add
    new material.
- Difficulty tag (easy/medium/hard) in the kicker line.
- Sections 10–18 should be compact (a short intro + one table each) — depth stays in
  the Deep Dives. Keep them specific to THIS system; generic boilerplate is a failure.

### Reference price sheet (approximate US on-demand list prices, order-of-magnitude)
Use these so cost numbers are consistent across lessons. Round aggressively; 730 h/month.
| Resource | Price |
|---|---|
| General compute | ~$0.04 / vCPU-hour ≈ $30 / vCPU-month (16-vCPU box ≈ $500/mo) |
| In-memory cache (Redis/ElastiCache) | ~$8 / GB-RAM-month |
| Managed relational DB (RDS/Aurora) | ~2× raw compute; storage ~$0.15 / GB-month |
| Block SSD (gp3) | ~$0.08 / GB-month |
| Object storage (S3 Standard) | ~$23 / TB-month; infrequent ~$12.5 / TB; deep archive ~$1 / TB |
| Internet egress | ~$0.05–0.09 / GB; CDN at volume ~$0.02 / GB ($20 / TB) |
| CDN / edge requests | ~$0.50 / 1M requests (edge compute ~$0.30–1 / 1M) |
| Cross-AZ transfer | ~$0.02 / GB (round trip) |
| DynamoDB on-demand | ~$1.25 / M writes, ~$0.25 / M reads, ~$0.25 / GB-month |
| Managed Kafka broker | ~$300 / broker-month + ~$0.10 / GB-month storage |
| Search cluster node (OpenSearch) | ~$300–500 / data-node-month + storage |
| GPU (H100-class) | ~$4 / GPU-hour ≈ $3k / GPU-month |
| SMS / email / push | ~$0.0075 / SMS · ~$0.10 / 1k emails · push ≈ free |
| Video transcoding | ~$0.015 / output-minute |

## Phase labels (use exactly)
- Phase 1 — Core Concepts
- Phase 2 — Key Technologies
- Phase 3 — Common Patterns
- Phase 4 — Case Study · Easy / Medium / Hard

## Tone
Confident, concrete, no fluff. Use the glossary terms (FR, NFR, HLD, deep dive,
breadth/depth ratio). Don't over-explain basics — model the staff behavior you teach.

## Return value
Write the file to the given path with the Write tool. Your final text response should
be ONLY a 1–2 sentence confirmation of what you wrote (title + key deep dives covered).
Do not paste the HTML back.
