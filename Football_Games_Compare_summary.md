# FM2026 vs Legacy — Combined Summary

**Updated: 16 February 2026 (seventh assessment)**

## Overall Scores

| Area | Score | Trend |
|------|-------|-------|
| **Match Engine** | **96%** | +6% from 90% (ALL scoring realism fixes applied — balance restored) |
| **Game Features** | **81%** | +2% (pack purchase overhaul, ownership verification) |
| **Full Game** | **89%** | +4% from 85% (recovery from balance regression) |

> **Note:** All 6 scoring realism issues from 14 Feb are now addressed. Score not fully back to 98% due to flat cooldowns (lost intelligence differentiation) and risk of over-correction (cumulative nerfs may make scoring too rare). New features added: ball zone positions, pass chemistry, specialist takers, movement smoothing.

## Match Engine Breakdown (96%)

| Category | Score | Change |
|----------|-------|--------|
| Ball Physics | 93% | — |
| Player AI | 97% | +4 (Vision-based pass-vs-shoot gate ADDED) |
| Passing | 96% | +1 (chemistry system, repetition penalty) |
| **Shooting** | **93%** | **+18** (multipliers fixed 4x→1.44x, 4x inaccuracy multiplier, thresholds raised) |
| Dribbling | 94% | +1 (role-based bias from legacy) |
| **Goalkeeper AI** | **95%** | **+25** (height gate fixed, trajectory prediction, catch rates improved, 8m save range) |
| Off-ball Movement | 97% | — |
| Pressing/Defending | 93% | — |
| Tackling/Challenges | 93% | — |
| **Fouls/Cards** | **92%** | **+7** (foul base rate reverted 0.35→0.05) |
| Set Pieces | 97% | — (specialist takers added) |
| Formations/Tactics | 98% | — (ball zone positions added) |
| Stamina/Fitness | 97% | — |
| Movement | 96% | +1 (position smoothing) |
| Spatial Analysis | 96% | — |
| Substitutions | 95% | — |
| Player States | 65% | — |
| Statistics | 95% | — |
| Officials | 35% | — |
| Collisions | 30% | — |
| Replay/Debug | 100% | — |

## Game Features Breakdown (81%)

| Category | Score | Change |
|----------|-------|--------|
| Match System | 95% | — |
| Cards/Packs | 95% | +2 (ownership verification, economy balancing) |
| Squad Management | 86% | — |
| UI/Client | 87% | — |
| Marketplace | 83% | +3 (server-authoritative pricing, new purchase flow) |
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

1. ~~SCORING REALISM~~ — **ALL 6 ISSUES FIXED** (16 Feb 2026):
   - ~~cmp-048~~: Shot multipliers reduced 4x→1.44x
   - ~~cmp-049~~: GK height gate 1.1m→2.6m
   - ~~cmp-050~~: GK catch rates improved, trajectory prediction added
   - ~~cmp-044~~: Thresholds raised 0.55→0.72, 0.70→0.82
   - ~~cmp-045~~: Cooldowns: pass 0.8s, shot 1.5s, dribble 1.2s
   - ~~cmp-051~~: Shot inaccuracy 4x multiplier, error doubled, clamp widened
   - ~~cmp-052~~: Vision-based teammate preference + cross-first priority
   - ~~cmp-012~~: Foul rate 0.35→0.05
2. **Financial economy missing** — No match income, wages, or sponsorship — **ONLY remaining P0**
3. ~~Player generation rarity-blind~~ — **FIXED**
4. ~~Formation position discipline~~ — **RESOLVED**

## Major Gaps (P1)

1. Cup competitions — empty stub
2. Scout system — stub only
3. PvP — framework only, no matchmaking
4. Collisions — no post/crossbar (deflection physics added)
5. Full curl/swerve — ball prediction ignores spin

## New Concerns (P2)

1. **Over-correction risk** — cumulative balance changes may make scoring too rare (need verification)
2. **Flat cooldowns** — lost intelligence differentiation (elite players no longer faster)
3. **2.6m reach for all players** — field players may pick up balls that should be headers

## FM2026 Exceeds Legacy In

- Dribble AI (7-factor scoring + role bias)
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
- Pack system (with/without NFT, free packs, ownership verification)
- Pass chemistry (organic build-up tracking with repetition penalty)
- Ball zone positioning (6-zone tactical adaptation)
- Movement smoothing (position fade prevents jitter)

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
| BUG-008 | MEDIUM | Marketplace sell price hard-coded 0.25 SOL | **MOSTLY FIXED** (new SOL transfer flow uses pack.price; candy machine bypassed; SOL price stub TODO) |
| ~~BUG-009~~ | ~~CRITICAL~~ | ~~Unrealistic scorelines (17-32)~~ | **FIXED** — All 6 compounding balance issues addressed (16 Feb) |

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
| 14 Feb 2026 | 90% | 79% | 2 commits, 25 files — balance regression diagnosed (17-32 scorelines) |
| **16 Feb 2026** | **96%** | **81%** | **8 commits, 26 files — ALL scoring realism fixes applied + pack overhaul** |
