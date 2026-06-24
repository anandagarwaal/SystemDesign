# Lesson Authoring Guide (for lesson-writer subagents)

You are writing ONE self-contained HTML lesson for a System Design course aimed at
a **beginner preparing for L6/L7 (staff+) FAANG interviews**, in the style of
hellointerview.com. Read this guide fully, then produce the file.

## Hard rules
1. **Copy the exact `<style>` block and the `<script>` block from
   `lessons/_TEMPLATE.html` verbatim.** Do not restyle. Visual consistency across
   lessons is mandatory. Match the overall structure of the template.
2. **Ground in the source.** Use the WebFetch tool on the URL(s) given in your brief.
   Extract real content. Add `<a href="#cN" class="cite">[N]</a>` citations inline
   wherever you state a fact from a source, and list the sources in the footer
   `Citations` block. If a page is paywalled/404, fetch what you can and rely on
   well-established CS fundamentals — never fabricate a specific claim and attribute
   it to a source you couldn't read.
3. **Keep it tight.** Working memory is small. A lesson should be readable in
   ~8–12 minutes. Favor tables, decision boxes, and short paragraphs over walls of text.
4. **Top of page:** `← Course home` link (already in template), kicker line with the
   correct lesson number + phase, H1 title, italic subtitle, and the `.mission`
   callout tying the topic to the L6/L7 interview goal.
5. **`.staff` callout (required):** at least one green "★ Staff-level signal" box
   explaining what moves this topic from senior to staff — e.g. simple-by-default,
   proactive deep dives, judgement on alternatives, not over-explaining basics.
6. **Quiz (required):** 3–4 retrieval-practice questions using the template's quiz
   markup. `data-correct` is the letter (a/b/c/d) of the right option.
   **Every option within a question must be the same length** (aim equal word AND
   character count) so formatting gives no tells. Include a one-line `.fb` explanation.
7. **`.ask` box (required):** remind the learner the agent is their teacher and give
   2–3 concrete followup prompts tied to this topic.
8. **Primary source (required):** recommend the single best source to read/watch.
9. **Footer nav (required):** Course home + previous lesson + glossary + "Next up →".
10. Output must be a complete, valid, standalone HTML file. No external assets.

## Section structure by lesson type

### Core-concept lessons (Phase 1–3)
- 4–7 short H2 sections teaching the concept from the ground up (assume beginner).
- Use a decision box (`.box`) or comparison table where there's a "when to use which"
  choice — that's the interview-relevant part.
- End conceptual content with how it shows up in a design interview.

### Case-study lessons (Phase 4) — MUST follow the hellointerview delivery framework
Use these H2 sections IN THIS ORDER (this is what the user explicitly asked for):
1. **Functional Requirements** — 3 core "users should be able to…" (table or list).
2. **Non-Functional Requirements** — 3–5 "-ilities" with the specific target/priority.
3. **Capacity Estimation** — back-of-envelope QPS / storage / bandwidth, but ONLY the
   numbers that influence the design; state the design implication of each.
4. **Core Entities & API** — 2–3 entities, then 4–6 REST endpoints
   (`POST /v1/...`), deriving user from auth token.
5. **Data Flow** — include ONLY for data-processing systems (crawlers, aggregators,
   pipelines, feeds); otherwise omit this H2.
6. **High-Level Design** — components and how each API request flows through them.
   Describe the boxes-and-arrows in prose + a simple table; note the data stores.
7. **Deep Dives** — 2–4 deep dives on the hard parts / bottlenecks / NFRs. THIS IS
   THE MOST IMPORTANT SECTION for an L6/L7 audience — give it the most space, show
   alternatives with tradeoffs and a justified pick. This is where the 60% depth lives.
- Difficulty tag (easy/medium/hard) in the kicker line.

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
