# THE 20-MINUTE HEIST
### How $6.3 billion left Binance on October 29, 2026: a documentary script

**Target runtime:** ≈24:03 at a standard documentary read of **140 wpm** (≈3,111 spoken words, plus timed pauses for title cards and animations)
**Format:** Narrated explainer. Motion-graphics on-chain visuals, headline/statement cards, and B-roll.
**Research cutoff:** October 31, 2026. All figures are preliminary, and the sources disagree on several of them. Binance has **not** published its post-mortem yet. Re-check every number before you publish (see the *Fact-check sheet* at the end).

> Conventions: **[VISUAL]** = what's on screen · **[OST]** = on-screen text · **[SFX/MUSIC]** = audio cue · Narration is plain text.
> Times are given in UTC with US Eastern time (EDT, UTC−4) where helpful. Daylight saving time doesn't end until Nov 1, 2026.

### VOICEOVER DIRECTION: standard documentary pace
- **Speed: 140 words per minute.** That's calm, measured and authoritative, like a Netflix or BBC true-crime explainer, not a fast YouTube read. For an AI voice, set it to about 0.9× of its default rate, since most TTS defaults run at 155–170 wpm.
- **Sentence ends:** let them land. Leave a short breath (~0.3s) between sentences and ~0.8s between paragraphs.
- **Big numbers** ("six point three billion dollars", "twenty minutes", "twenty-eight hops"): slow down slightly and pause about 1s afterwards so the on-screen text can land.
- **Comparison table (Ch 6):** pause about 1.5s after each row's on-screen text appears, before reading that row.
- **Chapter title cards:** about 4s of music only before narration resumes.
- **Calibration check:** the cold open (≈197 words) should run about **1:25 of speech**. If yours finishes in under 1:15, slow the voice down.

---

## COLD OPEN — 0:00–1:34

**[VISUAL]** Black screen. A single blinking cursor. Then a block-explorer row slides in: `OUT · 20:04 UTC · XRP Ledger`. A second row, then a third. Rows start stacking faster and faster until the screen is a waterfall of red outgoing transactions.
**[SFX/MUSIC]** Low drone. A soft "tick" for each transaction, accelerating into a hum.

It's a little after four in the afternoon in New York on Wednesday, October 29th, 2026.

Somewhere inside the world's largest cryptocurrency exchange, a machine does exactly what it was built to do. It signs transactions. Valid ones, with real keys, and Binance's own signature on every one.

Except none of these transactions were requested by anyone at Binance.

Over roughly the next twenty minutes, money pours out of Binance's hot wallets on about ten different blockchains at once: Bitcoin, Ethereum, Tron, Solana, the XRP Ledger. By the time the alarms are fully ringing, around six point three billion dollars is gone.

**[OST]** **$6,300,000,000**

That is more than four times the previous record, the 2025 Bybit hack. Some analysts count it as more than all the crypto stolen across the whole of 2025.

**[VISUAL]** Quick montage of headlines: *Axios — "Binance halts trading after biggest-ever crypto hack"*, *CNBC — "largest crypto theft on record"*, *Washington Post — "probably the largest theft of digital currencies in history."*

Within hours, stablecoin issuers would freeze billions. Investigators would trace the money through a twenty-eight-hop chain of wallets, straight to the doorstep of a hack from five weeks earlier. And Binance would bet more than six billion dollars of its own money that it could survive the night.

This is how the biggest heist in crypto history went down, minute by minute and wallet by wallet.

**[OST / TITLE CARD]** **THE 20-MINUTE HEIST**

---

## CHAPTER 1 — THE VAULT AND THE DOOR — 1:34–4:09

**[VISUAL]** Animated diagram: a giant vault labelled *COLD STORAGE* (offline, slow, heavily guarded) beside a smaller cash drawer labelled *HOT WALLETS* (online, fast, always open). Arrows show user withdrawals flowing out of the hot wallets.

To see how this happened, you need to understand how a crypto exchange stores money.

Most of an exchange's assets sit in *cold storage*: keys kept offline, behind layers of approvals, slow on purpose. But customers want withdrawals in minutes, not days. So every exchange also keeps *hot wallets*, which are online wallets wired into automated systems that sign withdrawals around the clock.

Think of cold storage as the bank vault and hot wallets as the tellers' cash drawers. Binance is big enough that even its cash drawers held billions of dollars.

**[OST]** Hot wallets = online · automated · always signing

Hot wallets are the most attacked targets in the industry, and in 2026 the attackers were already circling.

**[VISUAL]** Timeline bar. Pin at **Feb 2025: Bybit — ~$1.5B**. Pin at **Sept 24, 2026: Bitget — ~$388M**.

In February 2025, the exchange Bybit lost about one and a half billion dollars in ether. It was the record at the time. The FBI pinned it on North Korea, and specifically on a unit tracked as *TraderTraitor*. We'll come back to Bybit, because the two hacks have a lot in common.

Then, just five weeks before our story, on September 24th, 2026, the exchange Bitget was drained of around three hundred and eighty-eight million dollars. Bitget first estimated three hundred and fifty-one million, then revised the figure upward after counting transfers on Zcash and Tron. Its CEO said the attacker got in through a vulnerability in a *third-party security product*, which handed over high-level internal credentials. Analysts at TRM Labs saw fund flows overlapping with known North Korean theft proceeds.

**[VISUAL]** Dossier-style card: *TRADERTRAITOR*. Background stamps: "FBI / CISA advisory, 2022", "Bybit, 2025".

So who is TraderTraitor? US authorities have described it for years as a North Korean state-backed cluster focused on one thing: stealing cryptocurrency to fund the regime. Its signature is not brute force. It targets **people**. It sends employees at crypto companies fake recruiter messages, trojanized trading apps, and "job tests" that quietly install malware. The aim is to get onto the laptop of someone with access, and then wait.

**[OST]** Target the people, not the protocol

That pattern explains why investigators reacted the way they did when the word "laptop" appeared in Binance's first statement.

**[VISUAL]** Close on the Bitget pin. It glows, then a faint dotted line extends forward in time toward a blank space labelled *Oct 29*.

Keep Bitget in mind, because that dotted line is going to matter later.

---

## CHAPTER 2 — TWENTY MINUTES — 4:09–6:48

**[VISUAL]** A world map of chains, one glowing node per blockchain. A clock in the corner reads **20:00 UTC · Oct 29**.
**[SFX/MUSIC]** Pulse beat, building.

According to the blockchain-data firm Bitquery, the first drain hits at about **20:04 UTC**, on the **XRP Ledger**.

**[VISUAL]** XRP node flashes red. Clock ticks forward.

Then it spreads. Chainalysis puts the main event at around **4:20 p.m. Eastern**, which is 20:20 UTC. TRM Labs reports that most of the funds left in about **twenty minutes**, across **ten blockchains**. Elliptic counts eleven chains and describes the drain stretching over a few hours, as smaller balances were swept up behind the main wave.

**[OST]** ~20 minutes · 10–11 chains

One on-chain analyst, Spreek, is reported to have been the first to flag it publicly, pointing to a wallet emptied in a single transaction at **20:24 UTC**.

**[VISUAL]** Animated stacked bar. Each segment drops in as it's named.

Here's what TRM Labs says was taken.

**[OST]** **Ethereum** — ~200,630 ETH + 185 other tokens · ≈ $3.79B

On **Ethereum**, about two hundred thousand ether, plus a hundred and eighty-five other tokens. That's roughly three point seven nine billion dollars, and it includes about one point eight seven five billion USDT, eight hundred and twenty-three million USDC, and eighty-eight and a half million of Ripple's dollar stablecoin, RLUSD.

**[OST]** **Bitcoin** — ~18,270 BTC · ≈ $1.47B

On **Bitcoin**, roughly eighteen thousand two hundred and seventy coins, worth about one point four seven billion dollars.

**[OST]** **Tron** — ~612.7M USDT + 46.4M TRX · ≈ $628M

On **Tron**, about six hundred and thirteen million USDT, plus TRX, for roughly six hundred and twenty-eight million dollars.

**[OST]** **Solana** — ~970,500 SOL · ≈ $96M

And on **Solana**, around nine hundred and seventy thousand SOL, about ninety-six million dollars.

**[OST]** Total: Binance ≈ $6.3B · TRM ≈ $6.36B · Elliptic ≈ $6.43B

Add the rest of the chains and you get Binance's own figure of about **six point three billion dollars**. TRM says six point three six. Elliptic says six point four three. The early on-chain tallies that evening came in much lower, around three to five and a half billion, because nobody could yet see the whole picture.

**[VISUAL]** The stacked bar fills the screen, then cracks.

Notice which slices are stablecoins: USDT, USDC, RLUSD. Bitcoin and Ether have no company behind them that can stop a transfer. Stablecoins do. That one difference decides how much of this money ever comes back, and we'll get to it shortly.

First, the question every security engineer was asking that night: how do you get Binance to sign away six billion dollars?

---

## CHAPTER 3 — THE KEY THAT WASN'T STOLEN — 6:48–9:37

**[VISUAL]** A laptop on a desk in a dark room. Its screen flickers.

Binance's first explanation was simple: an engineer's laptop had been compromised. Reports describe the person as a DevOps engineer, one of the people who keep the exchange's infrastructure running.

**[OST]** Initial cause (Binance): compromised engineer laptop

But one detail in Binance's statement made security researchers sit up. The company said it had found **no evidence that any wallet private key was leaked**.

**[VISUAL]** A padlocked key in a glass case, untouched. Next to it, a rubber stamp marked *APPROVED* that keeps stamping by itself.

That's strange. In most hot-wallet hacks, the attacker steals the keys. Here the keys apparently never left the building. The analysis from Hypernative, TRM and others points to something more subtle: the attacker made **Binance's own systems sign on their behalf**.

The tool at the centre of it has a forgettable name: **EIP-7702**.

**[OST]** EIP-7702: lets an ordinary wallet temporarily run smart-contract code

**[VISUAL]** Animated explainer. An ordinary wallet (a simple box) receives a signed "delegation" card. The box sprouts gears; it's now running contract code.

On Ethereum there have traditionally been two kinds of accounts: plain wallets controlled by a key, and smart contracts controlled by code. EIP-7702 is a newer feature that blurs that line. It lets a plain wallet sign a *delegation*, which is an authorization that says, in effect, "from now on, run this contract's code as if it were me."

That's useful for things like batching transactions or sponsored fees. It also means one signature can quietly change what a wallet *is*.

**[VISUAL]** Hot wallet → signed delegation → *SWEEPER CONTRACT* (lock icon: "callable only by attacker") → arrows draining everything out.

According to TRM Labs, the attacker obtained a **pre-signed authorization** that made a Binance hot wallet run a **sweeper contract**, a piece of code that only the attacker could call. Once that delegation was live, the attacker didn't need a key anymore. They just pulled the lever, and the wallet emptied itself, with Binance's valid signatures on every step.

Hypernative's write-up describes the same picture: a delegation attack that drained the hot wallets in roughly an hour using legitimate Binance signatures.

**[OST]** No key stolen. The signature was real. The intent wasn't.

**[VISUAL]** The laptop again, but now a web of lines spreads out from it to several other machines.

The story didn't stay that simple. In later updates, Binance co-CEO Richard Teng said the breach involved a more complex attack process than one laptop, and the exchange disclosed **additional breach points**. Exactly how many systems were involved, and how the attacker got a signing pipeline to approve a malicious delegation, is what the promised post-mortem will have to explain.

**[VISUAL]** Text on black.

And that is the uncomfortable lesson for the whole industry. You can lock your keys in the strongest vault on earth, but if an attacker can get the machine that *uses* the keys to sign something, the vault doesn't matter.

---

## CHAPTER 4 — THE SCRAMBLE — 9:37–13:15

**[VISUAL]** Split screen: on the left, the waterfall of outgoing transactions; on the right, a block explorer tallying outflows that keep climbing.
**[SFX/MUSIC]** Tempo rises. Alert pings.

By early evening in New York, the crypto world knew something was wrong. On-chain monitoring tools and independent investigators were tracking wallet addresses and outflow totals that were growing by the minute. FXStreet ran a breaking story that on-chain data suggested Binance had likely been hacked for an estimated six billion dollars.

**[VISUAL]** Binance announcement card.

Binance came out with a statement acknowledging a **"potential security issue."** It estimated about **six point three billion dollars** impacted and **suspended deposits and withdrawals**.

**[OST]** Binance: deposits & withdrawals suspended

**[VISUAL]** Phone screen POV: a Binance app with a grey "Withdrawals temporarily suspended" banner. A thumb refreshes, and refreshes again.

For hundreds of millions of users, that's the moment it became real. Balances still showed on screen, but nothing could leave. Anyone who lived through November 2022 knew that feeling. FTX also froze withdrawals first, and only later admitted the money was gone. So the most important question that night wasn't technical. It was a question of trust: is the money behind those balances actually there?

Binance's answer would come over the next 48 hours. In the meantime, a second race was happening on-chain. The attacker needed to move stablecoins before their issuers could react. The issuers needed to freeze before the coins were swapped into something unfreezable.

**[VISUAL]** Circle logo. A USDC token icon locks with a padlock. Counter: *800,000,000*.

**Circle**, which issues USDC, moved first. Working with law enforcement, it froze **more than eight hundred million USDC** linked to the attack.

**[VISUAL]** Tether logo. A USDT token icon locks. Counter: *1,567,000,000*.

Then **Tether** froze **more than one point five six seven billion USDT**, calling it a step to protect the industry and its partners.

**[OST]** Tether: >1.567B USDT frozen · Circle: >800M USDC frozen

Within hours, the two biggest stablecoin companies had locked more than two point three billion dollars in place.

Ripple confirmed it had frozen RLUSD too. The amount is disputed: TRM Labs reported about forty million, while Binance co-CEO Yi He put it closer to two hundred million.

**[VISUAL]** Arbitrum network graphic. A council of signer icons approves a single "FREEZE" transaction.

Then something more unusual happened. According to on-chain investigator **ZachXBT**, the **Arbitrum Security Council**, a group of signers who can make emergency changes to the Arbitrum network, had executed a transaction to **freeze about thirty and a half million dollars** sitting at an exploiter address on Arbitrum.

**[OST]** Exploiter address (per ZachXBT): `0x3E2bf1ac6bf0934BBba6456C341c2EcbCED632d5`

Soon after that, ZachXBT's running tally passed **two point eight three billion dollars** frozen.

**[OST]** Frozen so far: ~$2.6B–$3B depending on source

Binance's own number would settle at about **three billion dollars** frozen.

**[VISUAL]** The stacked bar from Chapter 2 again. The stablecoin slices turn grey (frozen). The ETH and BTC slices stay bright red.

That's nearly half the haul locked down in hours. But look at what stayed red: the ether and the bitcoin. No company can freeze those. TRM estimated the attacker was still holding roughly **two point four billion dollars**, mostly ETH and BTC.

**[VISUAL]** CoinDesk headline: *"Crypto experts question double standard after issuers freeze billions."*

The freezes also started an argument. Tether and Circle had locked more than two billion dollars within hours. Critics asked whether a small project hacked on an ordinary Tuesday would get the same treatment. CoinDesk noted that Circle had faced criticism after a hack earlier in the year, and that Tether hadn't said whether law enforcement had asked for its freeze. The freezes saved billions, but they also showed how much power a handful of stablecoin companies hold over money that's supposed to be decentralized.

The money that could be frozen was frozen, and the rest went on the move.

---

## CHAPTER 5 — FOLLOW THE MONEY — 13:15–16:07

**[VISUAL]** Dark map. A single glowing dot on the Tron network begins hopping: 1, 2, 3… a counter in the corner climbs to **28**.
**[SFX/MUSIC]** Ticking clock, sparse piano.

Stolen crypto is useless if it can't be spent, so the next stage is laundering, and this attacker started almost immediately.

Elliptic traced funds from an attacker address on **Tron** into what investigators call a **peel chain**. Money moves to a new wallet, a small piece is peeled off, and the rest moves to another new wallet, again and again, to make the trail tedious to follow. This one ran about **twenty-eight hops**.

**[OST]** Tron peel chain · ~28 hops

The main Tron laundering wallet then started firing out TRX: **five hundred and forty-six separate transfers** from early on October 30th onward. Both Chainalysis and Elliptic said the pattern showed signs of **automation**. In other words, a script was doing the laundering, not a person clicking buttons.

**[VISUAL]** The dot reaches a large swirling hub labelled **THORChain**, then crosses a bridge labelled **Hyperlane** and lands on **Ethereum**.

From there, the funds went through **THORChain**, a decentralized cross-chain swap network with no central operator to say no, and then over the **Hyperlane** bridge back to Ethereum.

**[VISUAL]** The dotted line from Chapter 1's *Bitget* pin swings forward and connects to the same Ethereum address.
**[SFX/MUSIC]** Single heavy hit.

And then came the twist. On October 30th, ZachXBT found that stolen funds from the Binance hack, arriving through THORChain, had been mixed in the same wallet with funds from the three-hundred-and-eighty-eight-million-dollar **Bitget** hack. His conclusion was that the same actor was likely behind both.

**[OST]** Shared address (reported): `0x15104a9ce0f08a8f0075a0869ae80e795fe0feb7`

The money from the Bitget hack five weeks earlier and the money from Binance had ended up in **the same wallet**.

**[VISUAL]** TraderTraitor emblem fades in: a stylized mask over a North Korean map outline, with caption *"attributed by TRM Labs & Chainalysis"*.

TRM Labs, with what it called high confidence, and Chainalysis both attributed the Binance theft to **TraderTraitor**, the North Korean unit behind Bybit. Elliptic called North Korea *likely* responsible.

But note the caution. Elliptic and ZachXBT both pointed out that laundering networks can serve more than one client, so a shared destination *suggests* a common hand but doesn't prove it. At this point, no government had formally confirmed attribution, and Binance itself had not named a perpetrator.

**[VISUAL]** THORChain logo with a "BLOCK THIS?" request bubble from Bitget, answered with "NO MECHANISM."

THORChain itself landed in the spotlight. Bitget CEO Gracy Chen had asked it to block the attacker's addresses. THORChain declined, saying it has **no mechanism to block individual swaps**.

**[VISUAL]** Return to the counter: 546 transfers… still ticking.

As of October 30th, reports said the attacker had not yet cashed the stolen crypto out into fiat. Turning roughly two and a half billion dollars of hot coins into usable money is a much slower job than stealing them.

---

## CHAPTER 6 — ECHOES OF BYBIT — 16:07–20:02

**[VISUAL]** Split screen. Left: *BYBIT · Feb 21, 2025*. Right: *BINANCE · Oct 29, 2026*. Same dark styling, mirrored.
**[SFX/MUSIC]** Slow, low strings.

To understand what happened at Binance, it helps to go back twenty months, to the last time crypto saw a theft this big.

**[OST]** Bybit · Feb 21, 2025 · ~401,000 ETH · ≈ $1.5B

On February 21st, 2025, the Dubai-based exchange Bybit lost roughly four hundred thousand ether, about one and a half billion dollars at the time. It was the largest crypto theft ever recorded, until this week.

**[VISUAL]** Bybit's multisig: three signer icons around a cold wallet. A friendly "Approve transfer" screen floats in front, and behind it the real transaction pulses red: *change wallet logic → attacker contract*.

Bybit's ether wasn't in a hot wallet. It sat in a **cold wallet** protected by several signers, using the popular multisig service Safe. The attackers never touched those signers' keys. Instead they broke into a **developer's machine at Safe**, and used it to plant malicious code in the web interface that Bybit's signers used to review transactions.

When Bybit's team went to approve what looked like a routine transfer, the screen showed them exactly what they expected. But what they actually signed quietly swapped out the wallet's underlying logic for a contract the attackers controlled. Moments later, the cold wallet was empty.

**[OST]** Real signatures. False intent.

Put the two attacks side by side and the pattern is hard to miss.

**[VISUAL]** Comparison table builds row by row.

**[OST]** Entry point — Bybit: a Safe developer's machine · Binance: an engineer's laptop (+ more breach points)

**First, the way in.** At Bybit, it was a developer's computer at a supplier. At Binance, it started with an engineer's laptop. Both times the attacker went after a *person* with access, not the cryptography.

**[OST]** Trick — Bybit: fake signing screen → wallet logic swapped · Binance: EIP-7702 delegation → sweeper contract

**Second, the trick.** In both cases the victim's own legitimate signatures did the work. Bybit's signers approved a hidden change to their wallet's code. Binance's systems signed a delegation that turned a hot wallet into the attacker's sweeper. The method was different, but the idea was the same: don't steal the key, get the key's owner to sign.

**[OST]** Assets — Bybit: almost all ETH · Binance: over half stablecoins

**Third, what was taken, and this is where the stories split.** Bybit's loot was almost entirely ether, and nobody can freeze ether. Only a small fraction of the Bybit money was ever frozen. Binance's haul was full of USDT, USDC and RLUSD, so issuers could lock around **three billion dollars** within hours. The bigger hack ended up far more recoverable.

**[OST]** Laundering — both through THORChain

**Fourth, the getaway.** Bybit's attackers pushed most of the stolen ether through **THORChain** into bitcoin within about ten days, and the network was criticized for processing it. Twenty months later, the Binance funds went through the same network, and THORChain gave the same answer: it has no mechanism to block them.

**[OST]** Response — Bybit: withdrawals stayed open, loans from peers · Binance: withdrawals paused, self-funded $6.34B reserve

**Fifth, the response.** Bybit's CEO, Ben Zhou, went live within hours, said the exchange was solvent, and kept withdrawals open through a wave of panic, covering the gap with emergency loans of ether from other exchanges and investors. Binance went the other way. It paused withdrawals, and covered the entire loss from its own reserves without needing to borrow.

**[OST]** Attribution — Bybit: FBI confirmed in 5 days · Binance: private firms only (so far)

**And finally, the culprit.** Within five days of Bybit, the FBI publicly named North Korea's TraderTraitor. For Binance, TRM Labs and Chainalysis say it's the same group, but as of now no government has confirmed it.

**[VISUAL]** The two halves of the split screen slide together into one image.

The lesson from Bybit was supposed to be "verify what you sign." Twenty months later, the same playbook worked against the biggest exchange in the world, four times over.

---

## CHAPTER 7 — THE MORNING AFTER — 20:02–23:01

**[VISUAL]** Price charts. BTC line dips; BNB line dips further.
**[SFX/MUSIC]** Music settles, slower.

The markets flinched but didn't break.

**[OST]** BTC −4% → ~$78,000 · BNB −8–9% → ~$690

**Bitcoin** fell more than four percent, to around seventy-eight thousand dollars. Binance's own token, **BNB**, took a heavier hit, falling about eight to nine percent, to around six hundred and ninety.

**[VISUAL]** Binance statement card: *"Binance will absorb the financial impact of these stolen funds, not our users."*

That's because Binance moved quickly to answer the only question most customers cared about. Co-CEO Richard Teng said the exchange would absorb the financial impact of the stolen funds, not its users. He said Binance had set aside **more than six point three four billion dollars** of company money, which is more than the amount taken.

**[OST]** Binance reserves **$6.34B** to cover the loss

**[VISUAL]** A progress bar labelled *Assets replenished*: fills to 80%… then 90%.

Binance went to work refilling its wallets from its **SAFU** emergency fund, which stands for *Secure Asset Fund for Users*, plus part of its futures insurance fund and its corporate treasury. On October 30th it said about **eighty percent** of the stolen assets had been replenished. By Saturday, October 31st, that was **ninety percent**.

**[VISUAL]** Side-by-side: *FTX 2022* — "assets are fine" → bankruptcy · *Binance 2026* — "we'll cover it" → wallets refilled on-chain.

Inevitably, people compared it to FTX, which also froze withdrawals and promised customers their money was safe. This is where that comparison really gets tested. FTX's promises couldn't be checked, and in the end they weren't true. Binance's promise can be checked to a large degree, because the replenishment happens on public blockchains. Analysts can watch funds move from cold storage and treasury wallets back into the hot wallets. Skeptics are right that a public pledge is not the same as audited proof. But on-chain, the refill is visible in a way that FTX's balance sheet never was.

**[OST]** Withdrawals: target **Sunday, Nov 1**, in phases

The timeline for reopening withdrawals kept moving: about thirty-four hours, then forty-five, then forty-eight. As of Saturday, Binance said it was on track to resume withdrawals **in phases on Sunday**.

**[VISUAL]** A document with a big stamp reading *POST-MORTEM — PENDING*.

As we record this, several big questions are still open.

**[OST]** Open questions

**First, how many systems were breached?** It started with one laptop, and Binance now says there were additional breach points.

**Second, how exactly did a malicious EIP-7702 delegation get a valid Binance signature?** The answer matters to every exchange and wallet that has adopted the feature.

**Third, who did it?** Private investigators point firmly at North Korea's TraderTraitor, and the shared wallet with Bitget strengthens that case, but no government has confirmed it.

**Fourth, how much comes back?** About three billion dollars is frozen. Getting frozen funds actually returned is a separate legal process. The remaining two-plus billion in ETH and BTC is still moving through THORChain, bridges, and hundreds of automated transfers.

---

## OUTRO — 23:01–24:03

**[VISUAL]** Return to the opening: the waterfall of transactions, now slowing, then stopping. The cursor blinks.
**[SFX/MUSIC]** Drone returns, fades.

For fifteen years, the security mantra in crypto has been *protect the keys*. On October 29th, 2026, Binance says its keys were protected, and it still lost six point three billion dollars in about twenty minutes.

The money didn't leave because someone stole a key. It left because a system that was trusted to sign was persuaded to sign the wrong thing.

The industry got a few things right. Stablecoin issuers froze billions in hours, an exchange had the reserves to make its customers whole, and independent investigators traced the money in public, in real time. But it also showed how much of supposedly trustless finance still depends on trusting a few machines, a few companies, and the people who use them.

**[OST]** *The post-mortem is still coming. This story isn't over.*

**[TITLE CARD]** **THE 20-MINUTE HEIST**

**[SFX/MUSIC]** Cut to silence.

---
---

## PRODUCTION NOTES

**Runtime math.** Chapter timecodes come from each chapter's real spoken word count at 140 wpm, plus a 4–18s allowance per chapter for title cards and animation beats.

| Section | Spoken words | Timecode |
|---|---|---|
| Cold open | 197 | 0:00–1:34 |
| Ch 1 — Vault & door | 343 | 1:34–4:09 |
| Ch 2 — Twenty minutes | 328 | 4:09–6:48 |
| Ch 3 — The key | 370 | 6:48–9:37 |
| Ch 4 — The scramble | 491 | 9:37–13:15 |
| Ch 5 — Follow the money | 360 | 13:15–16:07 |
| Ch 6 — Echoes of Bybit | 502 | 16:07–20:02 |
| Ch 7 — Morning after | 398 | 20:02–23:01 |
| Outro | 122 | 23:01–24:03 |
| **Total** | **≈3,111** | **≈24:03** |

At 145 wpm it runs about 23:18, and at 135 wpm about 24:52. Both stay inside the 20–25 minute window. To trim, cut the FTX-feeling paragraph in Chapter 4 or the freeze-debate paragraph.

**Single-source details, so verify before publishing.** Spreek as the first public flag. The BNB price drop.

**Bybit details (Ch 6)** come from widely reported 2025 coverage: Bybit's own statements, the FBI's PSA of Feb 26, 2025, and the Safe{Wallet} incident report. Double-check the exact ETH amount (~401K) and laundering timeline against those sources.

## FACT-CHECK SHEET (figures conflict between sources)

| Item | Values seen | Used in script |
|---|---|---|
| Total stolen | Binance $6.3B · TRM $6.36B · Chainalysis $6.4B · Elliptic $6.43B | "about $6.3B" + range on screen |
| Chains | 10 (TRM/Chainalysis) · 11 (Elliptic) · 9 (Bitquery) | "about ten" |
| Drain duration | ~20 min (TRM) · ~1 hr (Hypernative) · few hours (Elliptic) | "~20 min for most of it" |
| Start time | 20:04 UTC first drain on XRPL (Bitquery) · ~4:20pm ET (Chainalysis) | both |
| Total frozen | ~$3B (Binance) · $2.83B (ZachXBT) · ~$2.8B (Chainalysis) · >$2.6B (Elliptic) | range |
| RLUSD frozen | ~$40M (TRM) · ~$200M (Yi He) | stated as disputed |
| Attacker still holding | ~$2.4B (TRM) | as stated |
| BNB price drop | 8–9% to ~$690 (single source) | verify |

## SOURCES
- Wikipedia — 2026 Binance hack: https://en.wikipedia.org/wiki/2026_Binance_hack
- TRM Labs: https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history
- Elliptic: https://www.elliptic.co/insights/binance-largest-hack-in-history/
- Chainalysis: https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/
- Hypernative: https://www.hypernative.io/insights/blog/inside-the-largest-crypto-theft-of-all-time-the-6-3b-binance-hot-wallet-drain
- Bitquery: https://www.bitquery.io/investigations/binance-hack
- CNBC: https://www.cnbc.com/2026/10/29/circle-tether-freeze-funds-impacted-by-potential-binance-security-issue.html · https://www.cnbc.com/2026/10/31/binance-hack-asset-coverage-withdrawals.html
- Axios: https://www.axios.com/2026/10/29/binance-cyberattack-crypto-heist
- Washington Post: https://www.washingtonpost.com/technology/2026/10/29/suspected-binance-hack-sets-off-scramble-lock-down-billions-crypto/
- Cointelegraph live blog: https://cointelegraph.com/news/live-updates-binance-63b-hack-linked-to-north-koreas-tradertraitor
- CoinDesk (freeze debate): https://www.coindesk.com/business/2026/10/30/experts-divided-over-binance-hack-asset-freezes-warn-recovery-is-another-matter
- Crypto Economy (shared address): https://crypto-economy.com/zachxbt-links-binance-and-bitget-exploits-via-shared-wallet/
- The Block (Bitget): https://theblock.co/news/business/2026-09-28-bitget-starts-phased-withdrawal-resumption-416965
- ZachXBT on-chain findings (Arbitrum freeze, $2.83B tally, Bitget link): https://x.com/zachxbt/status/2116030284261179538
- Bitcoinke (THORChain): https://bitcoinke.io/2026/10/why-binance-hacker-passed-funds-via-thorchain/
- FBI PSA on Bybit (Feb 26, 2025): https://www.ic3.gov/PSA/2025/PSA250226
