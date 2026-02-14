# FM2026 vs Legacy — Combined Summary

**Updated: 14 February 2026 (sixth assessment)**

## Overall Scores

| Area | Score | Trend |
|------|-------|-------|
| **Match Engine** | **90%** | -8% from 98% (BALANCE REGRESSION — features exist but produce 17-32 scorelines) |
| **Game Features** | **79%** | — (no game feature changes, cosmetic commits only) |
| **Full Game** | **85%** | -4% from 89% |

> **Note:** Score reduction reflects balance quality, not feature removal. All features exist — they just produce unrealistic results. Applying 6 identified fixes would restore scores to 98%+.

## Match Engine Breakdown (90%)

| Category | Score | Change |
|----------|-------|--------|
| Ball Physics | 93% | — |
| Player AI | 93% | -4 (no Vision-based pass-vs-shoot gate) |
| Passing | 95% | — |
| **Shooting** | **75%** | **-23** (8x multiplier stacking, accuracy clamping, no pass preference) |
| Dribbling | 93% | — |
| **Goalkeeper AI** | **70%** | **-28** (1.1m height gate, 95% parry rate, pinball loop) |
| Off-ball Movement | 97% | — |
| Pressing/Defending | 93% | — |
| Tackling/Challenges | 93% | — |
| **Fouls/Cards** | **85%** | **-7** (foul base rate 0.35, should be 0.05) |
| Set Pieces | 97% | — |
| Formations/Tactics | 98% | — |
| Stamina/Fitness | 97% | — |
| Movement | 95% | — |
| Spatial Analysis | 96% | — |
| Substitutions | 95% | — |
| Player States | 65% | — |
| Statistics | 95% | — |
| Officials | 35% | — |
| Collisions | 30% | — |
| Replay/Debug | 100% | — |

## Game Features Breakdown (79%)

| Category | Score | Change |
|----------|-------|--------|
| Match System | 95% | — |
| Cards/Packs | 93% | — |
| Squad Management | 86% | — |
| UI/Client | 87% | — |
| Marketplace | 80% | — |
| League System | 80% | — |
| Training | 75% | — |
| Communication | 75% | — |
| Player Generation | 80% | — |
| Economy/Finances | 15% | — |
| PvP | 10% | — |
| Scout System | 5% | — |
| Tutorial | 5% | — |
| Cup Competitions | 0% | — |

## Critical Gaps (P0)

1. **SCORING REALISM (URGENT)** — Engine produces 17-32 scorelines due to 6 compounding issues:
   - **cmp-048**: Shot multiplier stacking (8x compound boost inside box)
   - **cmp-049**: GK height gate (1.1m limit — shots above bypass saves)
   - **cmp-050**: GK parry pinball (95% parry rate → shot-parry-shot-goal loops)
   - **cmp-044**: Shot thresholds too low (0.55/0.70 insufficient with 8x multipliers)
   - **cmp-045**: Decision cooldowns too fast (0.5s uniform vs legacy 0.87-1.53s)
2. **Financial economy missing** — No match income, wages, or sponsorship
3. ~~Player generation rarity-blind~~ — **FIXED**
4. ~~Formation position discipline~~ — **RESOLVED**

## Major Gaps (P1)

1. **Shot accuracy clamping (cmp-051)** — shots can't miss wide (4.5m clamp, posts at 3.66m)
2. **Pass-vs-shoot intelligence (cmp-052)** — no Vision-based teammate preference
3. **Foul base rate inflated (cmp-012)** — 0.35 should be 0.05 (7x inflation)
4. Cup competitions — empty stub
5. Scout system — stub only
6. PvP — framework only, no matchmaking
7. Collisions — no post/crossbar (deflection physics added)
8. Full curl/swerve — ball prediction ignores spin

## FM2026 Exceeds Legacy In

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
- Captaincy system (leadership multiplier on team AI decisions)
- Game state awareness (score/time-dependent strategic adaptation)
- Rarity upgrade progression (dynamic rarity recalculation + NFT metadata sync)
- Pack system (with/without NFT, free packs)

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
| **BUG-009** | **CRITICAL** | **Unrealistic scorelines (17-32)** | **OPEN** — 6 compounding balance issues (cmp-048/049/050/044/045/012) |

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
| 13 Feb 2026 | 98% | 79% | 10 commits, 148 files, 7 bugs fixed, rarity overhaul |
| **14 Feb 2026** | **90%** | **79%** | **2 commits, 25 files — balance regression diagnosed (17-32 scorelines)** |
