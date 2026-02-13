# Game Features Summary — FM2026 vs Legacy (Non-Engine)

**Updated: 13 February 2026** | **Score: 79%** (+4% from 75%)

## What Changed (13 Feb 2026)

10 commits, 148 files (+4,738/-8,207). **Massive bug-fixing and rarity system overhaul.** 7 of 8 tracked bugs fixed.

### Bug Fixes (7 of 8 resolved)
- **BUG-001 FIXED**: Player upgrade now uses role-priority stat mapping (10 roles × 3 priority stats). Priority stats picked first, then secondary pool randomly.
- **BUG-002 FIXED**: `getStars()` and `getStarPercent()` now called after every upgrade. Delta tracked and returned to client.
- **BUG-003 FIXED**: Trainer `abilityScore()` changed from max-of-all to average-of-3 role-specific stats (Coach: ability+keeping+technicality / Physio: footwork+physicality+sprinting).
- **BUG-004 FIXED**: Trainer upgrade now uses role-priority stat mapping (same system as players).
- **BUG-005 FIXED**: Player generation now uses `RarityStatsBonus` multiplier system. Each rarity tier scales base stat ranges differently.
- **BUG-006 FIXED**: Trainer generation uses same `RarityStatsBonus` system with role-based ranges.
- **BUG-007 FIXED**: Practice booster cards now consumed via `useBooster()` in `practiceMatch()`.

### Rarity System Overhaul
- **New `RarityStatsBonus` table** in model.js:
  - Free: multiplier 0.8×, +1/+1
  - Regular: multiplier 1.0×, +1/+10
  - Rare: multiplier 1.2×, +20/+30
  - Epic: multiplier 1.4×, +40/+50
  - Legendary: multiplier 1.6×, +65/+70
- **Dynamic rarity calculation**: `getQualityFromScore()` derives rarity from ability score post-generation (not input rarity blindly applied)
- **Rarity upgrade progression**: After stat upgrades, rarity is recalculated. If changed, NFT metadata is updated on-chain.
- **Player stat defaults**: Changed from 0 to 1 (prevents division-by-zero, realistic base values)
- **Stat ranges rebalanced**: From legacy-style 60-95 ranges to 8-18 base ranges with rarity multipliers

### Pack System Enhancement
- **Packs without NFT**: `withNFT` parameter on `createPlayer()`, `createTrainer()`, `createBooster()`, `createKit()`, `createBadge()`
- **Free pack type**: Rarity.Free packs create non-NFT cards (no on-chain minting cost)
- **Pack reward emails**: `EmailSubType.PackReward` for pack reward notifications

### Communication Expansion
- **12 EmailSubType values**: Unknown, Welcome, Injury, TransferPlayer, TransferTrainer, ContractExpiredPlayer, ContractExpiredTrainer, UpgradeTrainer, UpgradePlayer, PackReward, PvPRequest, PvPResponse
- **Email types**: General, Club, League, Cup

### UI/Client Improvements
- **Card rarity visuals**: New card background images per rarity tier (Free, Regular, Rare, Epic, Legendary)
- **Player card redesign**: New layout with mask, level badge, card back
- **Font additions**: Poppins, Roboto, Deutschlander, Granika, Gulams, Martius fonts
- **Screen improvements**: Squad, Tactics, Home screens updated

### Database/Infrastructure
- **Migration update**: Extended initial database setup (82 lines changed)
- **Backup script**: New `backup_db_fm26.sh`
- **Kits data removed**: 7,595 lines of hardcoded kits.json deleted (moved to DB/generation)

## Feature Scores

| Feature | Score | Change | Notes |
|---------|-------|--------|-------|
| Match System | 95% | — | |
| Cards/Packs | 93% | +3 | Packs without NFT, free pack type |
| Squad Management | 86% | — | |
| UI/Client | 87% | +3 | Card rarity visuals, new fonts, layouts |
| Marketplace | 80% | — | |
| League System | 80% | — | |
| Training | 75% | — | |
| Communication | 75% | +5 | 12 email sub-types |
| Player Generation | 80% | **+50** | **FIXED — rarity-aware stat scaling** |
| Economy/Finances | 15% | — | |
| PvP | 10% | — | |
| Scout System | 5% | — | |
| Tutorial | 5% | — | |
| Cup Competitions | 0% | — | |

## Critical Gaps (P0)

| Gap | Detail |
|-----|--------|
| ~~Player generation~~ | **FIXED** — RarityStatsBonus system with multipliers and additive bonuses per tier |
| ~~Trainer generation~~ | **FIXED** — Same system, role-based ranges (Coach vs Physio) |
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
