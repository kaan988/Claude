# THE 20-MINUTE HEIST
### How $6.3 billion left Binance on October 29, 2026: a documentary script

**Target runtime:** ~21–23 minutes (≈3,050 words of narration incl. quoted posts, read at ~140–145 wpm with pauses for visuals)
**Format:** Narrated explainer. Motion-graphics on-chain visuals, screen captures of X posts, and B-roll.
**Research cutoff:** October 31, 2026. All figures are preliminary, and the sources disagree on several of them. Binance has **not** published its post-mortem yet. Re-check every number before you publish (see the *Fact-check sheet* at the end).

> Conventions: **[VISUAL]** = what's on screen · **[OST]** = on-screen text · **[SFX/MUSIC]** = audio cue · Narration is plain text.
> Times are given in UTC with US Eastern time (EDT, UTC−4) where helpful. Daylight saving time doesn't end until Nov 1, 2026.

---

## COLD OPEN — 0:00–1:30

**[VISUAL]** Black screen. A single blinking cursor. Then a block-explorer row slides in: `OUT · 20:04 UTC · XRP Ledger`. A second row, then a third. Rows start stacking faster and faster until the screen is a waterfall of red outgoing transactions.
**[SFX/MUSIC]** Low drone. A soft "tick" for each transaction, accelerating into a hum.

It's a little after four in the afternoon in New York on Wednesday, October 29th, 2026.

Somewhere inside the world's largest cryptocurrency exchange, a machine does exactly what it was built to do. It signs transactions. Valid ones, with real keys, and Binance's own signature on every one.

Except none of these transactions were requested by anyone at Binance.

Over roughly the next twenty minutes, money pours out of Binance's hot wallets on about ten different blockchains at once: Bitcoin, Ethereum, Tron, Solana, the XRP Ledger. By the time the alarms are fully ringing, around six point three billion dollars is gone.

**[OST]** **$6,300,000,000**

That is more than four times the previous record, the 2025 Bybit hack. Some analysts count it as more than all the crypto stolen across the whole of 2025.

**[VISUAL]** Quick montage of headlines: *Axios — "Binance halts trading after biggest-ever crypto hack"*, *CNBC — "largest crypto theft on record"*, *Washington Post — "probably the largest theft of digital currencies in history."*

Within hours, stablecoin issuers would freeze billions. Investigators would trace the money through a twenty-eight-hop chain of wallets. And Binance's founder would end up publicly telling the richest man in the world to stop laughing.

This is how the biggest heist in crypto history went down, minute by minute, wallet by wallet, and post by post.

**[OST / TITLE CARD]** **THE 20-MINUTE HEIST**

---

## CHAPTER 1 — THE VAULT AND THE DOOR — 1:30–4:00

**[VISUAL]** Animated diagram: a giant vault labelled *COLD STORAGE* (offline, slow, heavily guarded) beside a smaller cash drawer labelled *HOT WALLETS* (online, fast, always open). Arrows show user withdrawals flowing out of the hot wallets.

To see how this happened, you need to understand how a crypto exchange stores money.

Most of an exchange's assets sit in *cold storage*: keys kept offline, behind layers of approvals, slow on purpose. But customers want withdrawals in minutes, not days. So every exchange also keeps *hot wallets*, which are online wallets wired into automated systems that sign withdrawals around the clock.

Think of cold storage as the bank vault and hot wallets as the tellers' cash drawers. Binance is big enough that even its cash drawers held billions of dollars.

**[OST]** Hot wallets = online · automated · always signing

Hot wallets are the most attacked targets in the industry, and in 2026 the attackers were already circling.

**[VISUAL]** Timeline bar. Pin at **Feb 2025: Bybit — ~$1.5B**. Pin at **Sept 24, 2026: Bitget — ~$388M**.

In February 2025, the exchange Bybit lost about one and a half billion dollars. The FBI pinned it on North Korea, and specifically on a unit tracked as *TraderTraitor*.

Then, just five weeks before our story, on September 24th, 2026, the exchange Bitget was drained of around three hundred and eighty-eight million dollars. Bitget first estimated three hundred and fifty-one million, then revised the figure upward after counting transfers on Zcash and Tron. Its CEO said the attacker got in through a vulnerability in a *third-party security product*, which handed over high-level internal credentials. Analysts at TRM Labs saw fund flows overlapping with known North Korean theft proceeds.

**[VISUAL]** Dossier-style card: *TRADERTRAITOR*. Background stamps: "FBI / CISA advisory, 2022", "Bybit, 2025".

So who is TraderTraitor? US authorities have described it for years as a North Korean state-backed cluster focused on one thing: stealing cryptocurrency to fund the regime. Its signature is not brute force. It targets **people**. It sends employees at crypto companies fake recruiter messages, trojanized trading apps, and "job tests" that quietly install malware. The aim is to get onto the laptop of someone with access, and then wait.

**[OST]** Target the people, not the protocol

That pattern explains why investigators reacted the way they did when the word "laptop" appeared in Binance's first statement.

**[VISUAL]** Close on the Bitget pin. It glows, then a faint dotted line extends forward in time toward a blank space labelled *Oct 29*.

Keep Bitget in mind, because that dotted line is going to matter later.

---

## CHAPTER 2 — TWENTY MINUTES — 4:00–7:45

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

## CHAPTER 3 — THE KEY THAT WASN'T STOLEN — 7:45–11:15

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

## CHAPTER 4 — THE SCRAMBLE — 11:15–14:45

**[VISUAL]** Split screen: on the left, the waterfall of outgoing transactions; on the right, an X/Twitter feed starting to light up.
**[SFX/MUSIC]** Tempo rises. Notification pings.

By early evening in New York, Crypto Twitter knew something was wrong. Alert bots and independent sleuths were posting wallet addresses and outflow totals that were growing by the minute. FXStreet ran a breaking story that on-chain data suggested Binance had likely been hacked for an estimated six billion dollars.

**[VISUAL]** Binance announcement card.

Binance came out with a statement acknowledging a **"potential security issue."** It estimated about **six point three billion dollars** impacted and **suspended deposits and withdrawals**.

**[OST]** Binance: deposits & withdrawals suspended

**[VISUAL]** Phone screen POV: a Binance app with a grey "Withdrawals temporarily suspended" banner. A thumb refreshes, and refreshes again.

For hundreds of millions of users, that's the moment it became real. Balances still showed on screen, but nothing could leave. Anyone who lived through November 2022 knew that feeling. FTX also froze withdrawals first, and only later admitted the money was gone. So the most important question that night wasn't technical. It was a question of trust: is the money behind those balances actually there?

Binance's answer would come over the next 48 hours. In the meantime, a second race was happening on-chain.

Now the race was on. The attacker needed to move stablecoins before their issuers could react. The issuers needed to freeze before the coins were swapped into something unfreezable.

**[VISUAL]** Screenshot recreation of Jeremy Allaire's post (Circle).

The CEO of Circle, which issues USDC, posted first:

> **Jeremy Allaire (@jerallaire):** "Circle is closely tracking reports of a potential exploit involving Binance. In coordination with law enforcement, we have frozen more than 800M USDC associated with the incident and will continue supporting the investigation."

**[VISUAL]** Paolo Ardoino's post (Tether).

Minutes later came Tether's CEO:

> **Paolo Ardoino (@paoloardoino):** "Tether froze more than 1.567B USDT related to a potential Binance exchange hack. Protecting the industry and our partners is our main priority. Stay safe everyone."

**[OST]** Tether: >1.567B USDT frozen · Circle: >800M USDC frozen

Within hours, the two biggest stablecoin companies had locked more than two point three billion dollars in place.

Ripple confirmed it had frozen RLUSD too. The amount is disputed: TRM Labs reported about forty million, while Binance co-CEO Yi He put it closer to two hundred million.

**[VISUAL]** ZachXBT post: "Arbitrum Security Council has executed a transaction to freeze ~$30.5M from the Binance Exploit."

Then something more unusual happened. The on-chain investigator **ZachXBT** posted that the **Arbitrum Security Council**, a group of signers who can make emergency changes to the Arbitrum network, had executed a transaction to **freeze about thirty and a half million dollars** sitting at an exploiter address on Arbitrum.

**[OST]** Exploiter address (per ZachXBT): `0x3E2bf1ac6bf0934BBba6456C341c2EcbCED632d5`

Shortly after, ZachXBT posted a running total:

> **ZachXBT (@zachxbt):** "Update: This brings the total frozen for the Binance exploit so far to over $2.83B"

**[OST]** Frozen so far: ~$2.6B–$3B depending on source

Binance's own number would settle at about **three billion dollars** frozen. Chainalysis put it near two point eight, and Elliptic at over two point six.

**[VISUAL]** The stacked bar from Chapter 2 again. The stablecoin slices turn grey (frozen). The ETH and BTC slices stay bright red.

That's nearly half the haul locked down in hours. But look at what stayed red: the ether and the bitcoin. No company can freeze those. TRM estimated the attacker was still holding roughly **two point four billion dollars**, mostly ETH and BTC.

The money that could be frozen was frozen, and the rest went on the move.

---

## CHAPTER 5 — FOLLOW THE MONEY — 14:45–18:30

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

And then came the twist. On October 30th, ZachXBT posted:

> **ZachXBT (@zachxbt):** "Update: Stolen funds from the $6.3B Binance exploit and $388M Bitget exploit were commingled at the same address 45 minutes ago, after arriving via THORChain. This indicates the same actor is likely behind both incidents…"

**[OST]** Shared address (reported): `0x15104a9ce0f08a8f0075a0869ae80e795fe0feb7`

The money from the Bitget hack five weeks earlier and the money from Binance had ended up in **the same wallet**.

**[VISUAL]** TraderTraitor emblem fades in: a stylized mask over a North Korean map outline, with caption *"attributed by TRM Labs & Chainalysis"*.

TRM Labs, with what it called high confidence, and Chainalysis both attributed the Binance theft to **TraderTraitor**, the North Korean unit behind Bybit. Elliptic called North Korea *likely* responsible.

But note the caution. Elliptic and ZachXBT both pointed out that laundering networks can serve more than one client, so a shared destination *suggests* a common hand but doesn't prove it. At this point, no government had formally confirmed attribution, and Binance itself had not named a perpetrator.

**[VISUAL]** THORChain logo with a "BLOCK THIS?" request bubble from Bitget, answered with "NO MECHANISM."

THORChain itself landed in the spotlight. Bitget CEO Gracy Chen had asked it to block the attacker's addresses. THORChain declined, saying it has **no mechanism to block individual swaps**.

**[OST]** RUNE +13% after the hack

And here's an ironic detail. THORChain's token, **RUNE**, reportedly *rose* about **thirteen percent** after the hack, partly on all the volume the laundering was pushing through the network.

**[VISUAL]** Return to the counter: 546 transfers… still ticking.

As of October 30th, reports said the attacker had not yet cashed the stolen crypto out into fiat. Turning roughly two and a half billion dollars of hot coins into usable money is a much slower job than stealing them.

---

## CHAPTER 6 — THE TIMELINE ERUPTS — 18:30–21:30

**[VISUAL]** Full-screen X feed. Posts scroll by, some highlighted.
**[SFX/MUSIC]** Lighter, almost satirical percussion.

While investigators traced wallets, the rest of the internet did what it always does.

**[VISUAL]** Musk avatar → laughing emoji · grimacing emoji.

**Elon Musk** reacted to the news with laughing and grimacing emojis. One report says he posted "Everyday is Zeroday" as the hack broke. When a commentator compared Binance's reassurances to Sam Bankman-Fried's promises in the final days of FTX, Musk replied with a grimace.

**[OST]** "FTX 2.0?"

That FTX comparison was the one that stung. In 2022, FTX told customers everything was fine right up until it collapsed, and Musk was now amplifying that comparison to his followers.

**[VISUAL]** CZ post card.

Binance's co-founder **Changpeng "CZ" Zhao**, who stepped down as CEO in 2023, fired back. He said he respected Musk, but that it was a **"bad time to troll,"** and asked him to stop and show a little support.

Then he added a pointed reminder. Binance had put about five hundred million dollars into Musk's 2022 takeover of Twitter, and CZ said that stake, now held as **SpaceX shares**, was worth **more than a billion dollars**.

**[OST]** Binance's $500M Twitter stake → >$1B in SpaceX shares (per CZ)

Many readers took that as a threat to sell. CZ clarified later that he never suggested selling. He was just pointing out the kinds of funds Binance had available. Either way, the exchange made headlines across Forbes, Decrypt and the wider press as "the CZ–Musk spat."

**[VISUAL]** Richard Teng's video post: a still with a transcript scrolling beside it.

The more consequential posts came from Binance's current leadership. Co-CEO **Richard Teng** posted a video address, with the transcript beginning:

> **Richard Teng (@_RichardTeng):** "Hi everyone, firstly, I want to thank you all for the support. Difficult times like these are a great reminder how strong our industry is when we work together. We are grateful to our partners that acted quickly to freeze the hacked assets…"

He then made the promise that would define the next 48 hours:

> **"Binance will absorb the financial impact of these stolen funds, not our users."**

**[OST]** Binance reserves **$6.34B** of company funds to cover the loss

Teng said Binance had set aside **over six point three four billion dollars** of company funds, which is more than the amount stolen.

**[VISUAL]** Teng's "live update" post with key lines highlighted.

About a day after the attack, he followed up with a longer written update:

> **Richard Teng (@_RichardTeng):** "Over the past 24 hours, our teams have been working around the clock to respond to a serious security incident involving unauthorized withdrawals of funds. This is a live update on where things stand - what we've done, what we've learned, and what comes next…"

That update is where the story got more complicated: the breach was not just one laptop, and the attacker had used EIP-7702 to get execution approval over a hot wallet. That matters for the narrative. Binance moved from a simple "compromised device" explanation to admitting a multi-stage intrusion, which is exactly the type of disclosure that tends to come out slowly after a hack.

**[VISUAL]** Trader avatars with quote bubbles.

Not everyone panicked. Trader **Quinten Francois** argued the damage would be contained. The market was down only about two to three percent, and unlike with FTX, there was no chain reaction, because the money had been taken from the player with the deepest pockets.

**[VISUAL]** CoinDesk headline: *"Crypto experts question double standard after issuers freeze billions."*

There was a quieter debate underneath it all. Tether and Circle had frozen over two billion dollars within hours. Critics asked whether a small project hacked on a Tuesday would get the same treatment. CoinDesk noted Circle had been criticised after a hack earlier in the year, and that Ardoino's post hadn't said whether law enforcement had asked for the freeze. The freezes saved billions, but they also showed how much power a few stablecoin companies hold over money that's supposed to be decentralized.

---

## CHAPTER 7 — THE MORNING AFTER — 21:30–23:45

**[VISUAL]** Price charts. BTC line dips; BNB line dips further.
**[SFX/MUSIC]** Music settles, slower.

The markets flinched but didn't break.

**[OST]** BTC −4% → ~$78,000 · BNB −8–9% → ~$690

**Bitcoin** fell more than four percent, to around seventy-eight thousand dollars. Binance's own token, **BNB**, took a heavier hit, falling about eight to nine percent, to around six hundred and ninety.

**[VISUAL]** A progress bar labelled *Assets replenished*: fills to 80%… then 90%.

Binance went to work refilling its wallets from its **SAFU** emergency fund, which stands for *Secure Asset Fund for Users*, plus part of its futures insurance fund and its corporate treasury. On October 30th it said about **eighty percent** of the stolen assets had been replenished. By Saturday, October 31st, that was **ninety percent**.

**[VISUAL]** Side-by-side: *FTX 2022* — "assets are fine" → bankruptcy · *Binance 2026* — "we'll cover it" → wallets refilled on-chain.

This is where the FTX comparison really gets tested. FTX's promises couldn't be checked, and in the end they weren't true. Binance's promise can be checked to a large degree, because the replenishment happens on public blockchains. Analysts can watch funds move from cold storage and treasury wallets back into the hot wallets. Skeptics are right that a public pledge is not the same as audited proof. But on-chain, the refill is visible in a way that FTX's balance sheet never was.

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

## OUTRO — 23:45–24:30

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

**Runtime math.** About 3,050 narration words at 140–145 wpm, plus pauses on title cards and animations, comes to roughly 21–23 minutes. Chapter timecodes are approximate. To stretch toward 25, let the on-chain animations in Chapters 2 and 5 breathe, or add an interview or expert soundbite. To trim toward 20, cut the Quinten Francois paragraph and the RUNE detail.

**X/Twitter posts.** Show them as **recreated cards**, not raw screenshots, and only use posts you have opened and verified yourself. Quotes marked verbatim above were drawn from post previews in search results:
- Jeremy Allaire: https://x.com/jerallaire/status/2115916207463481846
- Paolo Ardoino: https://x.com/paoloardoino/status/2115918000373346709
- ZachXBT (Arbitrum freeze): https://x.com/zachxbt/status/2115960582230913357
- ZachXBT ($2.83B frozen): https://x.com/zachxbt/status/2115972303913935209
- ZachXBT (Bitget link): https://x.com/zachxbt/status/2116030284261179538
- Richard Teng (video transcript): https://x.com/_RichardTeng/status/2116176703823528024
- Richard Teng (live update): https://x.com/_RichardTeng/status/2116259036903669855

**Paraphrased, not verbatim.** CZ's "bad time to troll" exchange is paraphrased from press coverage, except for that phrase itself. Musk's "Everyday is Zeroday" comes from a single report, so verify it before you put it on screen. Spreek as the first public flag is also single-source.

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
- Decrypt (CZ vs Musk): https://decrypt.co/382236/elon-musk-cz-trade-blows-spacex-shares-binance-hack
- Forbes (CZ vs Musk): https://www.forbes.com/sites/fionariley/2026/10/30/binance-cofounder-asks-musk-not-to-troll-after-record-63-billion-crypto-hack/
- Crypto Economy (shared address): https://crypto-economy.com/zachxbt-links-binance-and-bitget-exploits-via-shared-wallet/
- The Block (Bitget): https://theblock.co/news/business/2026-09-28-bitget-starts-phased-withdrawal-resumption-416965
- Bitcoinke (THORChain): https://bitcoinke.io/2026/10/why-binance-hacker-passed-funds-via-thorchain/
