# Teaching Notes

## Learner profile (2026-06-16)
- Self-rated **beginner** at system design. Building blocks still fuzzy.
- **No deadline** → optimize for deep, durable mastery, not cramming.
- Wants **framework-first**, then core concepts, then case studies.
- Targeting **FAANG / Big Tech**, **L6/L7 (staff+)**.

## Calibration: what L6/L7 means (cite every lesson)
- Breadth/depth ratio flips: mid 80/20, senior 60/40, **staff 40/60**.
- Staff signal: simple-by-default designs ("is a sophisticated approach actually
  required?"), proactive deep dives (not waiting to be prompted), clear judgement
  on alternatives, DON'T over-explain the 101.
- Every lesson should include a "what would move this to staff-level" callout.

## Teaching approach
- **Math Academy Way (2026-09-19 conversion; ungated 2026-09-22).** Every lesson is a sequence of
  chunks, each followed by a check with an intuition question, plus a `chunk-final` comprehensive
  check. Nothing is hidden — the lesson reads top to bottom, and the checks are retrieval practice
  that feeds an SM-2-lite forgetting-curve schedule. Chat sessions follow `CLAUDE.md` (review first, diagnose prerequisites, small chunks,
  cumulative section quiz, ledger in `learning-records/review-schedule.md`).
- Small lessons, one win each. Retrieval practice + spacing + interleaving.
- Quizzes: keep all answer options equal length (no formatting tells).
- Carry the Tufte-ish HTML aesthetic across lessons (serif, wide margins,
  citation links, consistent nav). Lesson template established in 0001.
- Every lesson cites a primary source and reminds the learner to ask followups.

## Curriculum roadmap (the spine)
**Phase 0 — Framework**
- [x] 0001 The Delivery Framework (the 6 steps, ~35 min, L6/L7 calibration)

**Phase 1 — Core Concepts** (the building blocks; one lesson each)
- [x] 0002 Networking & APIs (HTTP/TCP, realtime protocol tree, L4/L7 LB, REST rules)
- [x] 0003 Databases & indexing (SQL vs NoSQL, B-tree vs LSM)
- [x] 0004 Caching (patterns, eviction, Redis)
- [x] 0005 Sharding & partitioning + consistent hashing
- [x] 0006 Replication & CAP / consistency models
- [x] 0007 Messaging & async (queues, Kafka, pub/sub)
- [x] 0008 Capacity estimation (back-of-envelope, latency numbers)

**Phase 2 — Key technologies**
- [x] 0009 Key Technologies Tour (Redis, Kafka, Cassandra, DynamoDB, Postgres, Elasticsearch)
- [x] 0040 Vector Databases (embeddings, ANN, HNSW/IVF/PQ, filtering, pgvector vs cluster, RAG)
- [x] 0041 Data Structures for Big Data (Bloom, HyperLogLog, Count-Min Sketch, t-digest, MinHash, LSM)
- [x] 0042 Time Series Databases (LSM blocks, Gorilla compression, cardinality, downsampling, landscape)

**Phase 3 — Common patterns**
- [x] 0010 Common Patterns (real-time updates, contention, scaling reads/writes, blobs, long tasks)

**Phase 4 — Case studies** (each a timed 60-min staff-interview walkthrough: clarify → estimate → API & data model → HLD → deep dives & alternatives → production readiness (observability, monitoring, authN/Z, security, privacy) → 10x scaling & cost → closing summary; with asks, pushback and transitions — see lessons/_AUTHORING-GUIDE.md)
- Easy: [x] 0011 Bitly · [x] 0012 Dropbox · [x] 0013 Local Delivery · [x] 0014 News Aggregator
- Medium: [x] all 12 — 0015 Ticketmaster, 0016 FB News Feed, 0017 Tinder, 0018 LeetCode,
  0019 WhatsApp, 0020 Yelp, 0021 Strava, 0022 Rate Limiter, 0023 Online Auction,
  0024 FB Live Comments, 0025 FB Post Search, 0026 Price Tracking
- Hard: [x] all 13 — 0027 Instagram, 0028 YouTube Top K, 0029 Uber, 0030 Robinhood,
  0031 Google Docs, 0032 Distributed Cache, 0033 YouTube, 0034 Job Scheduler,
  0035 Web Crawler, 0036 Ad Click Aggregator, 0037 Payment System,
  0038 Metrics Monitoring, 0039 ChatGPT

**Phase 4 — Case studies (ADDED from hellointerview vote-list gap analysis)**
- Batch 1 (Tier-1 classics): [x] 0043 Typeahead · [x] 0044 Distributed Message Queue ·
  [x] 0045 Blob/Object Store (S3) · [x] 0046 Notification Service · [x] 0047 Leaderboard ·
  [x] 0048 Distributed Counter · [x] 0049 Unique ID Generator · [x] 0050 Recommendation System ·
  [x] 0051 Google Maps · [x] 0052 Web Search Engine
- Batch 2 (Tier-2 products): [x] 0053 Twitter/X · [x] 0054 TikTok · [x] 0055 Spotify ·
  [x] 0056 Live Streaming (Twitch) · [x] 0057 Video Conferencing (Zoom) · [x] 0058 Slack ·
  [x] 0059 Food delivery · [x] 0060 Hotel Booking (Airbnb) · [x] 0061 Flight search ·
  [x] 0062 E-commerce/Flash-sale
- Batch 3: [x] 0063 Email (Gmail) · [x] 0064 Google Photos · [x] 0065 Q&A/Forum ·
  [x] 0066 Version Control (GitHub) · [x] 0067 CI/CD
- Batch 4 (Tier-3): [x] 0068 Auth service · [x] 0069 Chess/matchmaking · [x] 0070 Calendar ·
  [x] 0071 Webhook · [x] 0072 Fraud detection · [x] 0073 Stock exchange/matching ·
  [x] 0074 Wallet/P2P payments · [x] 0075 Realtime analytics · [x] 0076 Logging/tracing ·
  [x] 0077 Voting
- Batch 5 (Tier-3 cont): [x] 0078 Shazam · [x] 0079 ML platform · [x] 0080 AI agent/RAG ·
  [x] 0081 Workflow engine · [x] 0082 Figma · [x] 0083 Live score · [x] 0084 Post privacy/ACL ·
  [x] 0085 Jira · [x] 0086 Weather · [x] 0087 Snapchat
  (niche skipped per scope: tagging, i18n, subscription, payroll, banking-app, IoT telemetry,
   parking lot, color picker, mobile SD)
- Batch 6 (datastore DEEP DIVES): [x] 0088 Postgres · [x] 0089 MySQL · [x] 0090 Cassandra ·
  [x] 0091 DynamoDB · [x] 0092 Mongo · [x] 0093 Redis · [x] 0094 ES · [x] 0095 ClickHouse/OLAP ·
  [x] 0096 Distributed SQL (Spanner/Cockroach) · [x] 0097 Aurora · [x] 0098 Neo4j/Graph
- Batch 7 (messaging/infra DEEP DIVES): [x] 0099 Kafka · [x] 0100 Message queues (RabbitMQ/SQS/SNS) ·
  [x] 0101 Spark · [x] 0102 Flink · [x] 0103 MapReduce/Hadoop · [x] 0104 K8s · [x] 0105 Docker ·
  [x] 0106 ZK/etcd · [x] 0107 Consensus (Raft/Paxos) · [x] 0108 Gossip
- Batch 8 (cross-cutting DEEP DIVES): [x] 0109 CDN · [x] 0110 gRPC · [x] 0111 REST vs GraphQL ·
  [x] 0112 distributed txn (2PC/TCC/Saga) · [x] 0113 CDC · [x] 0114 DB internals ·
  [x] 0115 OAuth/JWT/auth · [x] 0116 geohashing/quadtrees · [x] 0117 secure system design ·
  [x] 0118 distributed locks (TTL/fencing) · [x] 0119 core AWS services
  (NOTE: 0111 + 0113-0119 authored directly by the lead agent, not subagents — subagent pool hit the
   account usage limit mid-Batch-8; same template/style/script and quiz structure applied.)

NOTE: Batch-1 lessons authored via lesson-writer subagents WITHOUT live web access — grounded
in well-established fundamentals + canonical citations; capacity numbers are back-of-envelope
estimates. Consider a later pass to add freshly-fetched source citations.

**Batch 9 (gap-fill concepts + practice layer)**
- [x] 0120 Real-Time Delivery (WS/SSE/long-poll/polling, connection scaling, backplane)
- [x] 0121 Load Balancing (L4 vs L7, algorithms, health checks, LB-as-SPOF, GSLB)
- [x] 0122 Idempotency & Delivery Semantics (at-least/at-most/exactly-once, idempotency keys, dedup)
- Reference/practice artifacts added under reference/:
  - [x] capacity-cheatsheet.html (closes the RESOURCES.md "Gaps" item: latency numbers, QPS math, nines)
  - [x] drill.html → superseded by review.html (see "Math Academy conversion" below); drill.html now redirects
  - [x] mock-interview.html (35-min timer + delivery-framework checklist + 24 random case-study prompt cards w/ deep-dive triggers)
  - [x] decision-guides.html (datastore selector, SQL-vs-NoSQL table, messaging selector, patterns×case-study matrix)
- index.html: added Practice & Reference links row; wired 0120/0121 into Phase 1, 0122 into Phase 3;
  replaced static "Done" bar with localStorage-backed per-lesson progress toggles (key: sd-progress-v1).
- glossary.html: added "Real-Time, Networking & Reliability" section (WebSocket, SSE, long polling,
  backplane, L4/L7, delivery semantics).
- Link integrity re-verified: 0 broken internal links.
- (NOTE: 0120-0122 via subagents; reference/practice pages authored directly by lead agent.
   The old embedded-JSON drill is gone; the question bank is now generated — see below.)

## Math Academy conversion (2026-09-19; gating removed 2026-09-22)
- All 124 chunked lessons pass `tools/audit_lessons.py` (0 issues): a check after every chunk, an
  intuition question in each, `chunk-final`, unique concept ids, no option-length tells (>30% spread).
- **No gating.** Lessons were hidden chunk by chunk until each check was passed, which made them read
  as quizzes with some prose attached. Every chunk is now visible from the start; the checks stayed.
- `reference/mastery.js`: SM-2-lite (early correct reviews don't stretch intervals),
  shuffled options, commit-first free-text answers on intuition questions, self-grading of that
  answer against a generated rubric (hit + first-try correct = known; else back tomorrow)
  (`sd-answers-v1`), lesson completion once every check in the lesson is answered (`sd-progress-v1`).
- `reference/review.html`: today's forgetting-curve review, cumulative section exams (85% pass,
  sections = index.html headings), weak spots, interleaved drill, and a copyable report for the chat
  teacher (includes the learner's own words on missed intuition questions).
- `reference/question-bank.js`: generated — rerun `python3 tools/build_question_bank.py` after any
  question edit (2,152 questions; ~half intuition).
- Diagnostic 0000 feeds the schedule and produces a chat report. index.html shows a due-count banner.
- Known residual: the correct option is still the uniquely-longest ~51% of the time (chance ≈31%),
  within the 30% spread. Commit-first neutralizes it for intuition questions; tightening recall
  options is optional follow-up.

## Status (2026-06-16): CURRICULUM COMPLETE (core) + EXPANSION IN PROGRESS
All 39 lessons authored: framework + 7 core concepts + key-tech tour + common patterns
+ 29 case studies (4 easy / 12 medium / 13 hard), each case study following the full
delivery framework (FR → NFR → Capacity → API → Data Flow where applicable → HLD →
Deep Dives at 40/60 staff depth). index.html links every lesson; all pass structural
validation (home link, staff callout, retrieval quiz).
**Next phase = practice, not authoring:** run live mock interviews on individual case
studies, spaced review, and interleaving across systems. Build learning records as the
learner reveals weak spots.
