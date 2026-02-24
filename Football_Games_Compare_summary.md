# FM2026 vs Legacy — Combined Summary

**Updated: 24 February 2026 (deep-dive — 22 new commits pulled, 18-24 Feb)**

## Overall Scores

| Area | Score | Trend |
|------|-------|-------|
| **Match Engine** | **99%** | +1% (cmp-053 P0 scoring realism addressed, player states 68%→80%, stats 98%→99%) |
| **Game Features** | **82%** | — (no game feature commits in this batch) |
| **Full Game** | **90%** | +1% |

> **DEEP-DIVE (24 Feb):** 22 commits pulled (18-24 Feb, previously not in local copy). **cmp-053 scoring realism (P0) substantially addressed** — all 7 areas: decision cadence intelligence-based (0.2-4.2s), shot thresholds 0.92/0.97, inaccuracy 16x, GK radii expanded, ball drag/decel increased, control time 0.8-2.0s, dead-ball 6-12s per type, shot refractory + parry rebound suppression. Player states expanded ~16→~40+ (GK dives, set piece, celebrations, combat, movement). Statistics now match legacy (14+ factors: interceptions, clearances, dribbles, key passes, foulsWon). Defensive AI overhauled (goal-threat intercept, predictive line, offside trap, strict shape). Set pieces: short FK, throw-in positioning, corner roles, double-touch rule. Tactics: 30-zone BallGrid, dynamic shifting, freerole. Replay: scoreboard UI, 1-15x speed, ball shadow. BUG-009 status: **SUBSTANTIALLY FIXED.**
>
> **Previous (23 Feb):** Deep-dive audit — no new commits. cmp-042 resolved, BUG-012/013 found.
>
> **NOTE:** The 22 commits include 14 commits from 18-23 Feb that were NOT in the local copy during the 20 Feb and 23 Feb audits. Those audits were performed against stale code — findings remain valid but the engine was already evolving during that period.

## Match Engine Breakdown (99%)

| Category | Score | Change |
|----------|-------|--------|
| Ball Physics | **96%** | — (physics retuned: drag +60%, decel +30% — calibration) |
| Player AI | **99%** | — (decision intervals intelligence-based RESTORED: 0.2-4.2s) |
| Passing | **99%** | — (pass noise rebalanced, bias 1.3x maintained) |
| Shooting | **95%** | **+1** (0.92/0.97 thresholds, 16x inaccuracy, refractory, rebound suppression) |
| Dribbling | **97%** | — (possession time 5.0s, greed 1.3x) |
| Goalkeeper AI | **99%** | — (radii expanded, reaction 100ms, aerial catch/punch) |
| Off-ball Movement | **99%** | — (goal-threat intercept, predictive line, strict shape) |
| **Pressing/Defending** | **97%** | **+1** (pre-press anticipation, secondary defender chase, engagement override) |
| **Tackling/Challenges** | **96%** | **+1** (proximity ball acquisition, context-scaled foul types) |
| **Fouls/Cards** | **98%** | **+1** (context-scaled simulation/handball, ceremony enforcement) |
| Set Pieces | **99%** | — (short FK, throw-in positioning, corner roles, double-touch) |
| Formations/Tactics | **99%** | — (30-zone BallGrid, dynamic shifting, freerole, cornerRoles) |
| Stamina/Fitness | **96%** | — (base drain 0.04, sprint drain 6.5) |
| Movement | **98%** | — (visual action states: sprinting/running/idle/jockeying) |
| Spatial Analysis | 96% | — |
| **Substitutions** | **99%** | **+1** (grounded bypass, timeout, hasBeenSubbedOff) |
| **Player States** | **80%** | **+12** (~40+ states: GK dives, set piece, celebrations, combat, movement) |
| **Statistics** | **99%** | **+1** (interceptions, clearances, dribbles, key passes, foulsWon. 14+ rating factors) |
| Officials | 35% | — |
| Collisions | 55% | — |
| Replay/Debug | 100% | — (array delta, teleport flag, scoreboard UI, 1-15x speed) |

## Game Features Breakdown (82%)

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

1. ~~**SCORING REALISM (cmp-053)**~~ — **SUBSTANTIALLY FIXED.** All 7 areas addressed in 22 commits. Decision cadence intelligence-based (0.2-4.2s), shot difficulty dramatically increased, GK radii expanded, ball physics retuned, dead-ball pauses 6-12s, shot refractory + parry rebound suppression. **Demoted to P2 pending verification testing.**
2. **Financial economy missing** — No match income, wages, or sponsorship

## Major Gaps (P1)

1. Cup competitions — empty stub
2. Scout system — stub only
3. PvP — framework only, no matchmaking
4. Collisions — 55% (post/crossbar confirmed; GK ball collision incomplete)

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
- Ball zone positioning (30-zone tactical adaptation)
- Movement smoothing (position fade prevents jitter)
- GK pre-shot awareness (positions on shooting arc before shot)
- Penalty save intelligence (anticipation-weighted direction bias)
- Player statistics (role-weighted ratings, 14+ factors incl. interceptions/clearances/dribbles/keyPasses)
- Goal net physics (4-zone damping: back/side/top/general)
- Defensive AI (goal-threat intercept, predictive defensive line, offside trap/step-up)
- Shot refractory memory (prevents repeated attempts from parries)
- Set piece intelligence (short FK, throw-in 3-option positioning, double-touch rule)
- Player action states (~40+ for replay animation: GK dives, celebrations, tackles, combat)

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
| BUG-009 | CRITICAL | Unrealistic scorelines (23-18, 32-26) | **SUBSTANTIALLY FIXED — cmp-053 7/7 areas addressed. Verification testing needed.** |
| BUG-010 | HIGH | NFT buy lock date arithmetic (`new Date() + Duration` = string concat) | **OPEN** |
| BUG-011 | MEDIUM | SOL price stub — `getSolPriceInUSD()` returns hardcoded 1.0 | **OPEN** |
| BUG-012 | HIGH | Player sacrifice calls `deleteTrainer()` — wrong DB table, creates orphan | **OPEN** |
| BUG-013 | MEDIUM | `injury` stat rarity-scaled — Legendary starts 77-89 injury | **OPEN** |

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
| 17 Feb 2026 | 97% | 81% | 2 commits, 25 files — massive realism pass |
| 17 Feb 2026 (deep-dive) | 98% | 81% | Score correction: 23 features missed in initial analysis |
| 20 Feb 2026 | 98% | 82% | Status audit — gf entries reclassified |
| 23 Feb 2026 | 98% | 82% | Deep-dive — cmp-042 resolved, BUG-012/013 found |
| **24 Feb 2026** | **99%** | **82%** | **22 commits (18-24 Feb). cmp-053 scoring realism P0 SUBSTANTIALLY FIXED (7/7 areas). Player states ~16→~40+. Stats match legacy (14+ factors). Defensive AI overhauled. Set pieces: short FK, throw-in options, corner roles. Tactics: 30-zone BallGrid, freerole. Replay: scoreboard, 1-15x speed.** |
