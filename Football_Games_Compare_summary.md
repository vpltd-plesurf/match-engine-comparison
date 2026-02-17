# FM2026 vs Legacy — Combined Summary

**Updated: 17 February 2026 (eighth assessment)**

## Overall Scores

| Area | Score | Trend |
|------|-------|-------|
| **Match Engine** | **97%** | +1% (massive realism pass — pass overhaul, GK AI, sprint decisions, corner defense, smart subs) |
| **Game Features** | **81%** | — (NFT transfer logic only) |
| **Full Game** | **89%** | — (ME +1% offset by unchanged GF and persistent scoring inflation) |

> **CRITICAL CONCERN:** Decision interval halved (0.5s→0.15s floor) in this update. Combined with new sprint decisions creating more through-ball opportunities, scoring inflation (23-18, 32-26 scorelines) will likely WORSEN. The 7-area rebalancing in cmp-053 is more urgent than ever.

## Match Engine Breakdown (97%)

| Category | Score | Change |
|----------|-------|--------|
| Ball Physics | 95% | +2 (net zones, spin force 0.8→1.2, offside fix) |
| Player AI | 98% | +1 (sprint decisions, hesitation) |
| **Passing** | **98%** | **+2** (vision-angle gate, weak foot, completion probability, power feasibility, backpass/bounce-back) |
| Shooting | 94% | +1 (weak foot suppression, FK routing) |
| Dribbling | 96% | +2 (cut-inside intelligence, GK jink evasion) |
| **Goalkeeper AI** | **97%** | **+2** (pre-shot awareness, organic dive, penalty logic, goal kick intent) |
| **Off-ball Movement** | **99%** | **+2** (sprint decisions, check-runs, organic movement) |
| **Pressing/Defending** | **95%** | **+2** (tactical pressing flags: none/deep/high) |
| **Tackling/Challenges** | **95%** | **+2** (fatigue-aware attributes, injury grounding) |
| Fouls/Cards | 93% | +1 (card ceremony delays: red +15s, yellow +3s) |
| **Set Pieces** | **99%** | **+2** (corner defensive positioning 6 roles, dynamic kickoff, FK routing) |
| Formations/Tactics | 99% | +1 (dynamic kickoff from loaded tactic) |
| Stamina/Fitness | 96% | -1 (soft model: 100% above 50% stamina — possibly too gentle) |
| Movement | 97% | +1 (dive override, stamina-dribble coupling) |
| Spatial Analysis | 96% | — |
| **Substitutions** | **98%** | **+3** (role-aware with 4-tier fallback + stamina tiebreaker) |
| Player States | 68% | +3 (INJURED_GROUND, action state in snapshots) |
| **Statistics** | **98%** | **+3** (touches, SOT, offsides, role-weighted rating formula) |
| Officials | 35% | — |
| Collisions | 30% | — |
| Replay/Debug | 100% | — |

## Game Features Breakdown (81%)

| Category | Score | Change |
|----------|-------|--------|
| Match System | 95% | — |
| Cards/Packs | 95% | — |
| Squad Management | 86% | — |
| UI/Client | 87% | — |
| Marketplace | 83% | — |
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

1. **SCORING REALISM (cmp-053)** — Still producing 23-18, 32-26 scorelines. Decision interval HALVED in this update (worsens problem). 7-area rebalancing plan documented in cmp-053: decision cadence, ball control times, defensive effectiveness, pressing/marking, shooting difficulty, goalkeeper, dead ball time. **THIS IS THE TOP PRIORITY.**
2. **Financial economy missing** — No match income, wages, or sponsorship

## Major Gaps (P1)

1. Cup competitions — empty stub
2. Scout system — stub only
3. PvP — framework only, no matchmaking
4. Collisions — no post/crossbar (deflection physics added)

## FM2026 Exceeds Legacy In

- Dribble AI (cut-inside intelligence + GK jink evasion + 7-factor scoring)
- Pressing AI (tactical flags: none/deep/high + urgency-based + captain multiplier)
- Pass AI (vision-angle gate, weak foot, completion probability, power feasibility, chemistry)
- Stamina system (dual permanent + activity model, soft degradation)
- Weak foot handling (detailed pass + shot penalties)
- Heat map tracking
- Space finding AI
- Sprint decisions (timed runs behind defense)
- Off-ball check-runs (lateral bursts creating passing lanes)
- Ball prediction algorithms
- Corner defensive positioning (6-role zonal system)
- Replay/debug system (AIAudit, delta compression, action states)
- Training system (server-side daily processing)
- Season management (automated scheduling)
- Leaderboards (14 categories)
- Auto-substitution AI (role-aware 4-tier fallback)
- Injury mechanics (fatigue-based muscle tear, micro-damage, ground injury state)
- Formation discipline (dynamic anchoring + tactical squeeze + dynamic kickoff)
- Captaincy system (leadership multiplier on team AI decisions)
- Game state awareness (score/time-dependent strategic adaptation)
- Rarity upgrade progression (dynamic rarity recalculation + NFT metadata sync)
- Pack system (with/without NFT, free packs, ownership verification)
- Pass chemistry (organic build-up tracking with repetition penalty)
- Ball zone positioning (6-zone tactical adaptation)
- Movement smoothing (position fade prevents jitter)
- GK pre-shot awareness (positions on shooting arc before shot)
- Penalty save intelligence (anticipation-weighted direction bias)
- Player statistics (role-weighted ratings, touches, SOT, offsides)
- Goal net physics (4-zone damping: back/side/top/general)

## Known Bugs

| Bug | Severity | Detail | Status |
|-----|----------|--------|--------|
| BUG-001 | HIGH | Player upgrade boosts random stats | **FIXED** |
| BUG-002 | HIGH | Stars not recalculated after upgrade | **FIXED** |
| BUG-003 | HIGH | Coach upgrade invisible | **FIXED** |
| BUG-004 | MEDIUM | Coach upgrade random stats | **FIXED** |
| BUG-005 | CRITICAL | Player generation rarity-blind | **FIXED** |
| BUG-006 | CRITICAL | Trainer generation rarity-blind | **FIXED** |
| BUG-007 | HIGH | Practice booster cards not consumed | **FIXED** |
| BUG-008 | MEDIUM | Marketplace sell price hard-coded 0.25 SOL | **MOSTLY FIXED** |
| BUG-009 | CRITICAL | Unrealistic scorelines (23-18, 32-26) | **OPEN — cmp-053 7-area plan documented** |

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
| 13 Feb 2026 | 98% | 79% | 10 commits, 148 files, 7 bugs fixed |
| 14 Feb 2026 | 90% | 79% | Balance regression (17-32 scorelines) |
| 16 Feb 2026 | 96% | 81% | ALL scoring fixes applied + pack overhaul |
| **17 Feb 2026** | **97%** | **81%** | **2 commits, 25 files — massive realism pass. Decision interval halved (worsens scoring). cmp-053 7-area plan.** |
