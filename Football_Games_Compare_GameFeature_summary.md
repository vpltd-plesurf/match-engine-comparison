# Game Features Summary — FM2026 vs Legacy (Non-Engine)

**Updated: 16 February 2026** | **Score: 81%** (+2% — pack purchase overhaul, ownership verification)

## What Changed (16 Feb 2026)

8 commits, 10 game feature files. **Major pack purchase architecture overhaul:**

### Pack Purchase Flow (Major)
- **Client SOL transfer replaces candy machine minting** — `TransferBalance(pack.price, ...)` sends SOL directly to game wallet instead of minting via candy machine. Server now controls pricing.
- **Server-side NFT issuance** — Non-free packs: server calls `issueNFTCard()` and records it. Client no longer mints NFTs.
- **Ownership verification** — `verifyOwnership()` checks marketplace wallet owns pack NFT before dispensing contents. Anti-cheat improvement.
- **Pack open NFT transfer re-enabled** — Previously commented-out `TransferNFT()` now active.
- **Transaction mint replacement** — Server replaces placeholder mint with actual NFT mint address.

### Economy Balancing
- **Pack 1000** contents changed from legendary to rare items (was giving free legendary items)
- **Legendary pack** properly labeled as legendary rarity (was labeled "free")

### Infrastructure
- **SOL price stub** — `getSolPriceInUSD()` with CoinGecko URL, currently hardcoded to 1.0 with `// TODO: fetch`
- **NFT symbol unified** — `NFTPackSymbol` removed; all NFTs use `NFTSymbol = "GDNFT"`
- **Pack query improved** — `getCardsPack()` now joins with NFT table in single query
- **`getPackById()`** utility added to marketplace service

## Feature Scores

| Feature | Score | Change | Notes |
|---------|-------|--------|-------|
| Match System | 95% | — | |
| Cards/Packs | 95% | +2 | Ownership verification, economy balancing |
| Squad Management | 86% | — | |
| UI/Client | 87% | — | |
| Marketplace | 83% | +3 | Server-authoritative pricing, new purchase flow |
| League System | 80% | — | |
| Training | 75% | — | |
| Communication | 75% | — | |
| Player Generation | 80% | — | |
| Economy/Finances | 15% | — | |
| PvP | 10% | — | |
| Scout System | 5% | — | |
| Tutorial | 5% | — | |
| Cup Competitions | 0% | — | |

## Critical Gaps (P0)

| Gap | Detail |
|-----|--------|
| ~~Player generation~~ | **FIXED** — RarityStatsBonus system |
| ~~Trainer generation~~ | **FIXED** — Same system |
| **Financial economy** | Club balance = 100k starting. No match day income, no wages, no sponsorship. **ONLY remaining P0.** |

## Major Gaps (P1)

| Gap | Detail |
|-----|--------|
| **Cup competitions** | `checkForStartCup()` is empty. `LeagueType.Cup` enum exists but unused. |
| **Scout system** | `BoosterType.Scout` exists. No discovery/scouting logic. |
| **PvP** | `MatchType.Pvp` exists. No matchmaking, no ranked, no challenges. |
| **Relegation** | Promotion (top 20%) works. No demotion logic. |
| **Transfer market** | Only via NFT marketplace. No in-game transfer window. |

## Known Bugs

| Bug | Severity | Detail | Status |
|-----|----------|--------|--------|
| BUG-001 | HIGH | Player upgrade boosts random stats | **FIXED** |
| BUG-002 | HIGH | Stars/star_percent not recalculated | **FIXED** |
| BUG-003 | HIGH | Coach upgrade invisible | **FIXED** |
| BUG-004 | MEDIUM | Coach upgrade random stats | **FIXED** |
| BUG-005 | CRITICAL | Player generation rarity-blind | **FIXED** |
| BUG-006 | CRITICAL | Trainer generation rarity-blind | **FIXED** |
| BUG-007 | HIGH | Practice booster not consumed | **FIXED** |
| BUG-008 | MEDIUM | Marketplace price hard-coded | **MOSTLY FIXED** (new SOL transfer flow uses pack.price; candy machine bypassed; SOL price stub TODO) |

## FM2026 Exceeds Legacy In

- **Training system** — Server-side daily processing with per-player assignment
- **Season management** — Automated round-robin scheduling + day cycling
- **Leaderboards** — 14 categories including per-position + leadership
- **Match replay** — Full 2D replay viewer (legacy had none in web/mobile client)
- **Practice matches** — Full UI flow with booster card consumption (NOW WORKING)
- **NFT/Blockchain** — Full Solana integration (legacy had none)
- **Marketplace** — On-chain P2P trading with lock-and-confirm + server-authoritative pricing (legacy had server-side only)
- **Rarity progression** — Dynamic rarity recalculation on upgrade with NFT metadata sync
- **Pack flexibility** — Free/non-NFT packs alongside NFT packs (legacy had only server packs)
- **Pack security** — Ownership verification before opening (anti-cheat)
