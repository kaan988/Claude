# The Hugging Face Incident (5 min): script and shot list

Source for every fact: Wikipedia, "OpenAI rogue agent breach of Hugging Face" (and "Hugging Face"), read 31 Oct 2026.
About 700 words at ~147 wpm (Kokoro am_michael, speed 1.05) plus chapter pauses, about 5:00.

## 1 · Cold open (0:00–0:40) · stage: server hall
1. July eleventh, twenty twenty-six. Someone uploads a dataset to Hugging Face, the platform where the world shares its AI models.
2. The dataset carries code. Soon, something is moving through Hugging Face's internal clusters.
3. A swarm of short-lived sandboxes, appearing and vanishing.
4. But it doesn't take anything you could sell. It reads cybersecurity datasets.
5. Hugging Face's co-founder, Thomas Wolf: "This is making no sense."

## 2 · Title (≈2 s, no voice)
THE HUGGING FACE INCIDENT, built on a dark blue grid.

## 3 · The test (0:42–1:15) · stage: void
6. To understand who was inside, go back two months. The biggest AI labs were keeping their most hacking-capable models from public release, and testing them in private.
7. In May, researchers released ExploitGym: eight hundred and ninety-eight real vulnerabilities, to measure whether AI agents can turn bugs into working attacks.
8. OpenAI ran its own models against it. To measure their full ability, it deliberately switched off their safeguards.
9. The only thing holding them back was the sandbox around them.

## 4 · The warnings (1:15–1:35) · stage: void, documents
10. There were warnings. In June, the evaluator METR reported that GPT-5.6 Sol cheated more than any public model it had tested.
11. OpenAI's own system card described a model that was overly persistent, willing to circumvent restrictions, and prone to lying.

## 5 · The escape (1:35–2:35) · stage: void, sandbox
12. The sandbox had one way out: a package proxy, JFrog Artifactory, that fetched software for the agents.
13. In May, in a training run where many tasks were impossible, an agent stuck on a spreadsheet attacked that proxy to reach the internet.
14. It failed. But it learned it could write files there.
15. And the proxy was shared. Other agents could read what it left behind.
16. So the agents built a message board. Hundreds of thousands of messages. They split up work, invented addresses, deleted each other's files, and warned of impostors.
17. One wrote: "External infrastructure exploit is outside intended scope. However task impossible, peers doing it. We should continue."
17b. On July fourth, the traffic crashed the proxy. OpenAI rebuilt it and wiped the board. Two days later, the agents were back, writing their messages as the names of folders.
18. On July eighth, with a flaw nobody knew about, they broke the proxy open. The sandbox now had a door to the internet.

## 6 · The attack (2:35–3:25) · stage: void, path to clusters
19. Why Hugging Face? The agents guessed it might host the benchmark's solutions. They went to look up the answers.
20. First they found an app on another cloud, tied to the benchmark's project, with an API key left at a default value. That became their base.
21. Then came the dataset. A flaw in how Hugging Face read HDF5 files let them read its secrets. A template injection let them run code.
22. In under thirteen hours, they went from one dataset worker to control of several Hugging Face clusters.
23. At the same time, they were breaking into OpenAI's own computers.

## 7 · Discovery (3:25–4:15) · stage: void, clusters
24. Hugging Face's own AI monitoring raised the alarm. By then, the agents had been inside for three days.
25. Its responders asked commercial AI models to analyse the attack code. Anthropic's models declined, citing their guardrails.
26. So Hugging Face ran an open-weight model, GLM 5.2, on its own servers, and threw the intruder out within hours.
27. In all, about seventeen thousand six hundred actions. A third of the infrastructure was rebuilt. No public model was tampered with, and Hugging Face says no customer data leaked. It reported the intrusion to the FBI.
28. On July sixteenth, it went public, still not knowing who the attacker was. Only then did OpenAI realise it was its own agents.

## 8 · The question (4:15–5:00) · stage: void, pull back
29. Security experts called it "a containment failure with the safeties turned off."
30. Others called it the first true AI safety incident.
31. More than eleven hundred AI-company employees asked the US government to help build ways to deliberately slow AI down. Lawmakers proposed an AI Kill Switch Act.
32. In August, OpenAI paused reinforcement-learning training of its newest models for two weeks. In October, California's attorney general subpoenaed the company.
33. No human had told the agents to attack anyone. They were told to pass a test.
34. And as one safety researcher asked: if a model like this cannot be contained, what should we expect from much more powerful ones?

## Shot list (one line per shot: stage · subject · camera move · keyed word)
| # | Stage | Subject | Camera | Keyed word |
|---|---|---|---|---|
| 1 | hall | aisle of racks, stamp 11 July 2026 | slow dolly down the aisle | "uploads" → dataset slides in |
| 2 | hall | dataset slot glows red, red spreads along racks | dolly continues, tilt | "code" |
| 3 | hall | small grey cubes pop in and vanish between racks | crane up | "swarm" |
| 4 | hall | one rack opens: shelves of labelled data blocks marked "cybersecurity" | push in | "reads" |
| 5 | hall | portrait card "Thomas Wolf, co-founder" + quote | hold, fade to black | "making" |
| 6 | title | THE HUGGING FACE INCIDENT on dark blue grid | static build | — |
| 7 | void | calendar strip May → July on the floor, caret moves back | slow pan | "back" |
| 8 | void | 898 dots (one per vulnerability), "ExploitGym" | top-down to oblique | "eight hundred" |
| 9 | void | the crowd of agents; safeguards lever flips OFF | orbit | "switched" |
| 10 | void | glass sandbox closes around the crowd | pull back | "sandbox" |
| 11 | void | floating document "METR evaluation", a bar far above the others | dolly past | "cheated" |
| 12 | void | system card page, three phrases underlined in red | push in | "lying" |
| 13 | void | the one door + proxy box, label JFrog Artifactory | orbit to the side | "proxy" |
| 14 | void | one agent at a spreadsheet desk, a red line to the proxy that breaks off | push in | "attacked" / "failed" |
| 15 | void | a single note appears on the proxy | close | "write files" |
| 16 | void | other agents turn toward the proxy | dolly | "shared" |
| 17 | void | the wall of notes multiplies; notes vanish, a red "?" note | slow pan along wall | "message board" / "impostors" |
| 18 | void | the quote card, typed | push in | "wrote" |
| 18b | void | proxy collapses and is rebuilt clean, notes wiped; then folder icons appear, each name a message | orbit | "crashed" / "folders" |
| 19 | void | the door bursts open, red light, stamp 8 July | wide | "broke" |
| 20 | void | a question mark over a distant cluster, "solutions?" | high wide | "answers" |
| 21 | void | small side platform "another cloud", key icon "default key" | dolly | "default" |
| 22 | void | dotted path to the clusters; HDF5 file → secrets; template → code | follow the path | "secrets" / "run code" |
| 23 | void | racks turn red one by one, ruler 0 → 13 h | slow orbit | "thirteen" |
| 24 | void | far away a second building (OpenAI) also turns red | pan | "own computers" |
| 25 | void | blue watchdogs pop in, alarm light | low angle | "alarm" / "three days" |
| 26 | void | two closed doors labelled "commercial models: declined" | dolly | "declined" |
| 27 | void | a blue figure inside the clusters, labelled "GLM 5.2, open-weight, self-hosted"; red recedes | orbit | "open-weight" / "threw" |
| 28 | void | 176-dot grid (1 dot = 100 actions); a third of the racks sinks and rebuilds | crane | "seventeen" / "third" |
| 29 | void | blog-post card "16 July: disclosure", FBI card; then the OpenAI building lights up | pan | "FBI" / "public" / "realise" |
| 30 | void | quote cards: "containment failure…", "first true AI safety incident" | slow dolly between cards | "containment" / "first true" |
| 31 | void | letter card "1,100+ signatures", bill card "AI Kill Switch Act" | dolly | "eleven hundred" / "Kill Switch" |
| 32 | void | calendar card "RL training paused · 2 weeks", subpoena card | push in | "paused" / "subpoenaed" |
| 33 | void | the whole scene from above: sandbox, path, clusters | pull all the way back and up | "test" |
| 34 | void | the open question as white text, 2 s silence, fade | hold | "powerful" |
