# FM2026 vs Legacy — Combined Summary

**Updated: 13 February 2026 (fifth assessment)**

## Overall Scores

| Area | Score | Trend |
|------|-------|-------|
| **Match Engine** | **98%** | — (refinement tuning, no new feature categories) |
| **Game Features** | **79%** | +4% from 75% (7 bugs fixed, rarity system, packs without NFT) |
| **Full Game** | **89%** | +2% from 87% |

## Match Engine Breakdown (98%)

| Category | Score | Change |
|----------|-------|--------|
| Ball Physics | 93% | +1 (restart snap fix, smoother vacuum, dribble speed boost) |
| Player AI | 97% | +1 (close-range shooting boost, hysteresis, flair bonus) |
| Passing | 95% | — (power/loft now on intent object) |
| Shooting | 98% | +1 (attribute-driven power, distance-based loft, panic clearances) |
| Dribbling | 93% | — |
| Goalkeeper AI | 98% | +1 (conservative positioning, rushing catch radius, parry tuning) |
| Off-ball Movement | 97% | — |
| Pressing/Defending | 93% | — |
| Tackling/Challenges | 93% | — |
| Fouls/Cards | 92% | — |
| Set Pieces | 97% | +1 (boundary clamping, restart field-clamp fix) |
| Formations/Tactics | 98% | — |
| Stamina/Fitness | 97% | — |
| Movement | 95% | +1 (hysteresis 1.15 for sticky decisions) |
| Spatial Analysis | 96% | — |
| Substitutions | 95% | — |
| Player States | 65% | — |
| Statistics | 95% | — |
| Officials | 35% | — |
| Collisions | 30% | — |
| Replay/Debug | 100% | — (AI audit logging removed from results = performance win) |

## Game Features Breakdown (79%)

| Category | Score | Change |
|----------|-------|--------|
| Match System | 95% | — |
| Cards/Packs | 93% | +3 (packs without NFT, free pack type, withNFT parameter) |
| Squad Management | 86% | — |
| UI/Client | 87% | +3 (card rarity visuals, player card redesign, fonts) |
| Marketplace | 80% | — |
| League System | 80% | — |
| Training | 75% | — |
| Communication | 75% | +5 (12 email sub-types: transfer, upgrade, pack reward, PvP, etc.) |
| Player Generation | 80% | **+50** (FIXED — rarity-aware stat scaling via RarityStatsBonus) |
| Economy/Finances | 15% | — |
| PvP | 10% | — |
| Scout System | 5% | — |
| Tutorial | 5% | — |
| Cup Competitions | 0% | — |

## Critical Gaps (P0)

1. ~~Player generation rarity-blind~~ — **FIXED** (RarityStatsBonus multiplier system: Free 0.8×, Regular 1.0×, Rare 1.2×+20, Epic 1.4×+40, Legendary 1.6×+65)
2. **Financial economy missing** — No match income, wages, or sponsorship
3. ~~Scoring rate-limiters~~ — **FIXED** (previous assessment)
4. ~~Formation position discipline~~ — **RESOLVED** (previous assessment)

## Major Gaps (P1)

1. Cup competitions — empty stub
2. Scout system — stub only
3. PvP — framework only, no matchmaking
4. Collisions — no post/crossbar (deflection physics added)
5. Decision intervals — still faster than legacy (0.35-0.75s vs 0.87-1.53s)
6. Full curl/swerve — ball prediction ignores spin

## FM2026 Exceeds Legacy In

- Shot AI (6-gate filter + GK-aware aiming + attribute-driven power)
- Dribble AI (7-factor scoring)
- Pressing AI (urgency-based + captain multiplier)
- Stamina system (dual permanent + activity model)
- Weak foot handling (detailed)
- Heat map tracking
- Space finding AI
- Ball prediction algorithms
- Replay/debug system (AIAudit, delta compression)
- Training system (server-side daily processing)
- Season management (automated scheduling)
- Leaderboards (14 categories)
- Auto-substitution AI (injury/fatigue/tactical)
- Injury mechanics (fatigue-based muscle tear, micro-damage)
- Formation discipline (dynamic anchoring + tactical squeeze)
- Goalkeeper AI (reaction delay, predictive positioning, rushing/parry logic)
- Captaincy system (leadership multiplier on team AI decisions)
- Game state awareness (score/time-dependent strategic adaptation)
- **Rarity upgrade progression** (dynamic rarity recalculation + NFT metadata sync)
- **Pack system** (with/without NFT, free packs)

## Known Bugs

| Bug | Severity | Detail | Status |
|-----|----------|--------|--------|
| BUG-001 | HIGH | Player upgrade boosts random stats | **FIXED** (role-priority stat mapping) |
| BUG-002 | HIGH | Stars not recalculated after upgrade | **FIXED** (getStars/getStarPercent called post-upgrade) |
| BUG-003 | HIGH | Coach upgrade invisible | **FIXED** (abilityScore now avg-of-3, not max-of-all) |
| BUG-004 | MEDIUM | Coach upgrade random stats | **FIXED** (role-priority mapping for trainers) |
| BUG-005 | CRITICAL | Player generation rarity-blind | **FIXED** (RarityStatsBonus multiplier system) |
| BUG-006 | CRITICAL | Trainer generation rarity-blind | **FIXED** (same RarityStatsBonus system) |
| BUG-007 | HIGH | Practice booster cards not consumed | **FIXED** (useBooster called in practiceMatch) |
| BUG-008 | MEDIUM | Marketplace sell price hard-coded 0.25 SOL | Partially fixed (backend takes param, client still 0.25 SOL) |

## Assessment History

| Date | Match Engine | Full Game | Notes |
|------|-------------|-----------|-------|
| Jan 2026 | 40-50% | — | Initial comparison |
| 4 Feb 2026 | 75-80% | — | Deep review |
| 6 Feb 2026 | 85% | 58% | v2.0 specs |
| 6 Feb 2026 (post) | 90% | 65% | 71-file update |
| 10 Feb 2026 | 95% | 70% | 13 commits, 63 files |
| 10 Feb 2026 (2nd) | 96% | 71% | 3 commits, 38 files |
| 10 Feb 2026 (3rd) | 96% | 72% | 2 commits, 31 files |
| 11 Feb 2026 | 98% | 75% | 18 commits, 57 files |
| **13 Feb 2026** | **98%** | **79%** | **10 commits, 148 files, 7 bugs fixed, rarity overhaul** |
