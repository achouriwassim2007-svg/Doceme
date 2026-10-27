# Doceme: teach a confused fairy

Students learn by teaching Doceme, a fairy learner whose name means "teach me" in Latin. Doceme knows only what the student taught it, so confusion is real, wrong explanations show up as wrong answers, and a coach points to the exact lesson section to review.

Built for the Thirduni Cohort 1 project delivery (October 2026).

**Live demo:** https://YOUR-USERNAME.github.io/YOUR-REPO/  *(replace after enabling GitHub Pages)*

## What it is

A web app for secondary-school students (Algeria) and their teachers. Today it ships one topic pack, **Reported speech: yes/no questions (3AS)**, with 5 concept cards. Each card cites a passage from the lesson source.

### The session

1. **Topic and student code** (no names are collected).
2. **Pre-test**: 5 questions, one per card. The result sets Doceme's confusion level (very confused, partly confused, almost there).
3. **Learn first**: a short worked example.
4. **Teach**: the student explains a rule in English, Arabic or French. Doceme reacts.
5. **Doceme's exam**: one item per card. Doceme answers from what it was taught.
6. **Coach**: lists what was taught well, weakly, or not at all (or wrongly), citing the source section.
7. **Post-test**: different questions on the same cards. The gain (post minus pre) is the student's learning.

### How the safeguards work

- **Doceme's knowledge lives in code.** Each card has a state: `Unknown`, `Learning`, `Learned`, `Mis-learned`. Replies and exam answers are produced from these states, so Doceme cannot know what it was not taught.
- **Wrong teaching is applied faithfully.** If an explanation matches a known wrong idea, the card becomes `Mis-learned` and Doceme applies the wrong rule to a test sentence, then asks "Is that right?".
- **Anti-paste.** Each explanation is compared with the card's source text (word overlap). Above a threshold, Doceme asks for the student's own words and own example.
- **Note-taker.** The student's exact words, a short summary, the matching card, a rubric score (accurate, complete, has an example: 0 to 3) and the language used are stored.
- **Honest scoring.** Doceme's exam score is computed in code. The student's own learning is measured separately by the pre-test and post-test.
- **Privacy.** Student codes only. Sessions are stored in the browser's `localStorage` on the teacher's machine and never sent anywhere. The teacher dashboard can clear them.

### Teacher view

Shows the pack review table (each card with its source section) and every session: code, pre-test, post-test, gain, Doceme's score and the notebook.

## Run it locally

No install, no build, no keys.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
open index.html        # macOS; on Windows double-click index.html, on Linux use xdg-open
```

Or serve it: `python3 -m http.server 8000` and open http://localhost:8000.

## Project structure

```
index.html   page structure
style.css    design (light and dark mode)
pack.js      topic pack: concept cards, source passages, pre/post test items
script.js    Doceme's state engine, teaching loop, exam, coach, views
README.md    this file
```

In `pack.js`, `PACK` is the topic pack. In `script.js`, `rubric()` and `teach()` implement the note-taker and Doceme's reactions, `answer()` produces exam answers from card states, and `render()` draws each step. To add a topic, add a new pack object in `pack.js`.

## Honest status

**Works end to end:** the full session above for the reported-speech pack.

**Not built yet:**
- Free topic choice. Packs are written by hand for now.
- A language model. Grading is rule-based (keywords and wrong-idea patterns), and Arabic/French explanations are recorded and flagged for teacher review rather than graded.
- Teacher approval flow and hosted storage.

## What we would build next

1. A pack builder: upload a lesson, cut it into passages, write 5 to 10 cited concept cards, fact-check each card against its passage, teacher approves.
2. A language model that only phrases Doceme's replies, with card states staying in code.
3. A classroom pilot comparing Doceme with paper exercises, using the same pre-test and post-test, with school and parental consent.

## Team

| Name | What they did |
|------|---------------|
| FULL NAME | e.g. wrote the topic pack and rubric |
| FULL NAME | e.g. built the teaching loop |
| FULL NAME | e.g. designed the interface |

## Tech stack

HTML, CSS, JavaScript (no framework), Google Fonts (Fraunces, Nunito). Built with heavy use of Claude (Anthropic) for design and code generation.

## Notes

The roadmap this project follows is in the team's *Doceme: Build Roadmap*. No secrets or API keys are used or stored in this repository.
