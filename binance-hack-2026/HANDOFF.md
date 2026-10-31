# Handoff: Binance hack, 3D clay documentary (20 min)

This file continues a cloud Claude Code session on the user's Windows PC. Read it fully before doing anything.

## The user
- Speaks German. **Reply in German.** The film itself is in **English**.
- Wants speed **and** efficiency: few correction rounds, no wasted work.
- Ultracode or multi-agent workflows only where they pay off: the fact-check and critical review of test stills. Not for building scenes or the voice.

## Goal
Turn `binance-hack-2026/script.md` (the October 29, 2026 Binance hack, ~24 min) into a **20-minute 3D "clay" documentary**. Follow:
- the user's prompt: `binance-hack-2026/prompt-3d-clay.md`
- the skill: `.claude/skills/doc-explainer-video/` (read `SKILL.md`, then `references/style-3d-clay.md`, `references/script-format.md`, `references/gotchas.md`, `references/local-gpu.md`)

## Decisions already made (don't re-ask)
| Item | Decision |
|---|---|
| Length | **20 minutes**, one standalone film. Build and check it **chapter by chapter** (about 4 blocks of ~5 min) |
| Language and voice | English, Kokoro `am_michael`, speed 1.05 |
| Format | 1920×960, 25 fps, Three.js 0.160, style per the prompt |
| Render | **Locally on the GPU**: Windows 11, **AMD Radeon RX 7900 XT**, `render.py ... --gpu` (ANGLE/D3D11). Start with 3 workers |
| Twitter/X | **No tweets or X post cards.** The user had that segment removed |
| Bybit 2025 | **Keep the comparison.** It's in Chapter 6 "Echoes of Bybit" |
| Efficiency | Reuse a few sets (server hall, studio void, wallet vault, chain nodes). Keep crowds small |

## Still open (ask the user)
1. **Names:** name real companies and people (Binance, Tether, Circle, ZachXBT, Richard Teng…), or only roles ("an investigator")? The skill prefers roles unless the user wants names.

## Next steps (skill pipeline)
1. **Fact-check.** Fetch `https://en.wikipedia.org/wiki/2026_Binance_hack` as HTML and read it in full; it was reachable as of Oct 31, 2026. `2025_Bybit_hack` returned 404, so find the correct title (e.g. search Wikipedia for "Bybit hack"). Every sentence in the film must trace to something you read. No invented quotes.
2. **Rewrite the script** into the prompt/skill format: `## n · title`, short numbered lines, numbers written as words. Budget is ~147 wpm plus 0.35 s per line plus 0.9 s per chapter turn, which comes to **~2,600–2,700 words for 20 min**. The current script has ~3,100 words, so cut. Map it onto the prompt's 8-part structure (cold open 15%, title sting 2 s, background 10%, warnings 5%, mechanism 20%, incident 15%, discovery/response 15%, question/change 15%). The Bybit comparison belongs in background and mechanism, or in its own block.
3. **Shot list** (stage, subject, camera move, keyed word). **Show the script and shot list and wait for approval** before recording the voice.
4. Voice (`voice.py --check` for names: Binance, Tether, Circle, Bybit, Bitget, THORChain, Hyperlane, EIP-7702, TraderTraitor, USDT, USDC, RLUSD, ZachXBT, SAFU).
5. Whisper timing → align → build the page → about 35 stills per chapter as a contact sheet → fix → render (`--gpu`) → sfx/mix (−14 LUFS stereo) → encode → verify from the MP4.
6. Commit sources and `audio/mix.m4a`, **not** frames or wav files.

## Facts and caveats (from research as of Oct 31, 2026)
- **Figures are preliminary, and the sources contradict each other.** The fact-check table at the end of `script.md` lists all variants: total $6.3B (Binance), $6.36B (TRM), $6.4B (Chainalysis), $6.43B (Elliptic); 9 to 11 chains; ~$2.6–3B frozen.
- **Mechanism:** Binance first named an engineer's compromised laptop, then said there were more breach points. It found no leaked private key. The attacker used an EIP-7702 delegation to make a hot wallet run a "sweeper" contract that only the attacker could call (TRM, Hypernative). Binance's **post-mortem had not been published yet**.
- **Attribution:** TRM and Chainalysis say North Korea's TraderTraitor, and Elliptic says "likely". **No government has confirmed it.**
- **Bybit details** in Chapter 6 (~401K ETH, Safe{Wallet} developer machine, FBI PSA of Feb 26, 2025, THORChain laundering in ~10 days, loans from peers) come from model knowledge, **not** from this research. Verify them against Wikipedia.
- **Single-source items:** Spreek as first public flag; the BNB price drop to ~$690.
- **Blocked in the cloud:** cointelegraph, decrypt, elliptic, trmlabs and hypernative could not be fetched. On the PC they may work, so use them for the fact-check.

## Files
- `binance-hack-2026/script.md` is the current master script (~24 min at 140 wpm, 9 sections, with fact-check table and sources)
- `binance-hack-2026/prompt-3d-clay.md` is the user's style and pipeline prompt
- `.claude/skills/doc-explainer-video/` contains the skill, scripts and the example `assets/example-3d-film.html`
- Branch: `claude/charming-feynman-mbsmfq` (repo `kaan988/claude`). Commit and push there

## Windows notes
- Check the WebGL renderer on the first run: it must name the AMD card, not "SwiftShader". If it says SwiftShader, update the AMD driver.
- Paths with spaces need quotes. Set `$env:PYTHONUTF8=1` when redirecting output.
- Exclude the `frames\` folder from Windows Defender. It needs ~8 GB of disk.
- Kokoro files (`kokoro-v1.0.onnx`, `voices-v1.0.bin`) come from the GitHub release `thewh1teagle/kokoro-onnx` `model-files-v1.0`. Get the Whisper model `Systran/faster-whisper-small.en` from Hugging Face.
