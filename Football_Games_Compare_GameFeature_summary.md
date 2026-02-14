# Game Features Summary — FM2026 vs Legacy (Non-Engine)

**Updated: 14 February 2026** | **Score: 79%** (unchanged — cosmetic commits only)

## What Changed (14 Feb 2026)

2 commits, 25 files. **No game feature logic changes:**
- Visual card UI updates (card backgrounds, trainer card layout, squad/tactics screen tweaks)
- `.number` → `.shirt_number` field rename (data mapping fix)
- `aiRecords` removed from match replay output (performance)

## Feature Scores

| Feature | Score | Change | Notes |
|---------|-------|--------|-------|
| Match System | 95% | — | |
| Cards/Packs | 93% | — | |
| Squad Management | 86% | — | |
| UI/Client | 87% | — | |
| Marketplace | 80% | — | |
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
| BUG-008 | MEDIUM | Marketplace price hard-coded | Partially fixed (backend param, client still 0.25 SOL) |

## FM2026 Exceeds Legacy In

- **Training system** — Server-side daily processing with per-player assignment
- **Season management** — Automated round-robin scheduling + day cycling
- **Leaderboards** — 14 categories including per-position + leadership
- **Match replay** — Full 2D replay viewer (legacy had none in web/mobile client)
- **Practice matches** — Full UI flow with booster card consumption (NOW WORKING)
- **NFT/Blockchain** — Full Solana integration (legacy had none)
- **Marketplace** — On-chain P2P trading with lock-and-confirm (legacy had server-side only)
- **Rarity progression** — Dynamic rarity recalculation on upgrade with NFT metadata sync
- **Pack flexibility** — Free/non-NFT packs alongside NFT packs (legacy had only server packs)
