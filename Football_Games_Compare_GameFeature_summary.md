# Game Features Summary — FM2026 vs Legacy (Non-Engine)

**Updated: 23 February 2026** | **Score: 82%** (unchanged — no new commits since 17 Feb)

## What Changed (23 Feb 2026)

No new commits. Deep-dive audit only.

- **BUG-012 identified (HIGH):** `upgradeInternal()` in `upgradesService.js` calls `squadService.deleteTrainer()` for ALL sacrifice targets regardless of type. Player sacrifices hit the wrong DB table — creates orphan records.
- **BUG-013 identified (MEDIUM):** `injury` stat included in `processRoleDefaultStats()` `statsToChange` dict, which is scaled by `RarityStatsBonus`. Legendary players start with 77–89 injury points instead of a low baseline.
- **cmp-047 tag corrected:** existsInFM2026 was "no" (counted as MISSING) — corrected to "yes". Missing in FM2026 count: 9→8.

## What Changed (20 Feb 2026)

No new commits. Status audit only. Three P2 game feature entries reclassified:
- **gf-014 Squad Management** — `open` → `resolved with advisory` (functional, minor gap: set piece taker designation)
- **gf-021 User Accounts** — `open` → `resolved with advisory` (functional, minor gap: password reset endpoint)
- **gf-024 Search** — `open` → `resolved with advisory` (functional, minor gap: advanced filters)

## What Changed (17 Feb 2026)

1 file changed: `GameService.cs` — NFT transfer improvements during card upgrade. No new game features added.

## Feature Scores

| Feature | Score | Change | Notes |
|---------|-------|--------|-------|
| Match System | 95% | — | |
| Cards/Packs | 95% | — | |
| Squad Management | 86% | — | |
| UI/Client | 87% | — | |
| Marketplace | 83% | — | |
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
| BUG-008 | MEDIUM | Marketplace price hard-coded | **MOSTLY FIXED** (new SOL transfer flow uses pack.price; SOL price stub TODO) |
| BUG-009 | CRITICAL | Unrealistic scorelines (23-18, 32-26) | **OPEN — cmp-053 7-area plan documented** |
| BUG-010 | HIGH | NFT buy lock date arithmetic (`new Date() + Duration` = string concat, not date comparison) | **OPEN** |
| BUG-011 | MEDIUM | SOL price stub — `getSolPriceInUSD()` returns hardcoded 1.0, fetch dead | **OPEN** |
| BUG-012 | HIGH | Player sacrifice calls `deleteTrainer()` — wrong DB table, creates orphan record | **OPEN** |
| BUG-013 | MEDIUM | `injury` stat rarity-scaled in `processRoleDefaultStats()` — Legendary starts 77–89 injury | **OPEN** |

## FM2026 Exceeds Legacy In

- **Training system** — Server-side daily processing with per-player assignment
- **Season management** — Automated round-robin scheduling + day cycling
- **Leaderboards** — 14 categories including per-position + leadership
- **Match replay** — Full 2D replay viewer (legacy had none in web/mobile client)
- **Practice matches** — Full UI flow with booster card consumption (NOW WORKING)
- **NFT/Blockchain** — Full Solana integration (legacy had none)
- **Marketplace** — On-chain P2P trading with lock-and-confirm + server-authoritative pricing
- **Rarity progression** — Dynamic rarity recalculation on upgrade with NFT metadata sync
- **Pack flexibility** — Free/non-NFT packs alongside NFT packs
- **Pack security** — Ownership verification before opening (anti-cheat)
