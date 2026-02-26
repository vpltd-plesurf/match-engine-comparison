# FM2026 vs Legacy — Combined Summary

**Updated: 26 February 2026 (14 commits, 91 files, 37 JS/CS source files)**

## Overall Scores

| Area | Score | Trend |
|------|-------|-------|
| **Match Engine** | **99%** | — (internal improvements: Officials 35→55%, Collisions 55→70%, Player States 80→92%, 8 categories up) |
| **Game Features** | **84%** | +2% (replay overhaul, squad management polish, rarity boosters, training APIs) |
| **Full Game** | **91%** | +1% |

> **26 Feb 2026:** 14 commits pulled. **Match engine:** Ball physics retuned (drag +60%, friction +150%, first touch failure system, outfield shot blocking), 6 tackle variants (angle+aggression based), GK reaction delay model + freeze fix + 12-type dive classification, linesman error ±0.4m, referee blind spot 12%, 30+ player action states, futile chase prevention, auto-dispossession. **Client:** Complete match replay viewer (intro overlay, live scoreboard, goal celebrations, highlights log with click-to-seek, 1-15x speed, ball shadow), 16 rarity-specific booster images, squad management polish (rarity gradients, in-squad icon, INF/CON/SHP columns, foot preference, nationality flags), upgrade guards (squad/free player protection), practice match APIs. **8 match engine entries resolved.** Open ME items: 2 (offside, referee). Only P0: financial economy.
>
> **Previous (24 Feb):** 22 commits (18-24 Feb). cmp-053 scoring realism P0 substantially fixed (7/7 areas). Player states ~40+. Defensive AI overhauled.

## Match Engine Breakdown (99%)

| Category | Score | Change |
|----------|-------|--------|
| **Ball Physics** | **98%** | **+2** (air drag +60%, ground friction +150%, spin transfer on bounce, first touch failure, outfield shot blocking, net zone separation) |
| Player AI | **99%** | — (vision cone, chemistry bonus, jockeying state — already at ceiling) |
| Passing | **99%** | — (chemistry bonus, cutback detection, weighted random selection) |
| **Shooting** | **97%** | **+2** (tactical flag integration, weak foot gate, vision gate, chip shot physics, panic clearance fix) |
| Dribbling | **97%** | — (dribble pivot smoothing, greed 2.0→1.3) |
| Goalkeeper AI | **99%** | — (reaction delay model, GK freeze fix, predictive positioning, 12-type dive classification, elite penalty reading) |
| Off-ball Movement | **99%** | — (5 run types, offside correction, CB anchor, heat map scoring) |
| **Pressing/Defending** | **98%** | **+1** (futile chase prevention, support bonus, auto-dispossession 6%/2m, pass interception) |
| **Tackling/Challenges** | **98%** | **+2** (6 tackle variants by angle+aggression, critical failure on fatigue, GK protection) |
| **Fouls/Cards** | **99%** | **+1** (second yellow→red fix, referee blind spot 12%, GK protection enforcement) |
| Set Pieces | **99%** | — (wall face-ball logic, set piece tactical scaling, stall detection) |
| Formations/Tactics | **99%** | — (CB anchor enforced, compression tightened, wide player lateral tracking) |
| **Stamina/Fitness** | **97%** | **+1** (base drain 0.05→0.04, dual fitness penalty on speed + acceleration) |
| Movement | **98%** | — (movement smoothing FADE 0.85, BASE_SPEED 3.2→2.6) |
| Spatial Analysis | 96% | — |
| Substitutions | **99%** | — (ghost ownership fix, role-aware replacement polished) |
| **Player States** | **92%** | **+12** (30+ ACTION_STATES: 6 directional GK dives, 4 celebrations, SHIELDING, JOCKEYING. ACTION_COOLDOWN 1.2→0.3s) |
| Statistics | **99%** | — (chemistry tracking, confidence system, result multiplier) |
| **Officials** | **55%** | **+20** (linesman error ±0.4m, referee blind spot 12%, 6s/card injury time, second yellow→red, GK protection) |
| **Collisions** | **70%** | **+15** (movement smoothing, separation system, BASE_SPEED nerf, stumble/recovery tuned) |
| Replay/Debug | 100% | — (complete replay viewer with intro, scoreboard, celebrations, highlights) |

## Game Features Breakdown (84%)

| Category | Score | Change |
|----------|-------|--------|
| **Match System** | **97%** | **+2** (complete replay viewer: intro, scoreboard, celebrations, highlights log, click-to-seek, 1-15x speed) |
| **Cards/Packs** | **97%** | **+2** (16 rarity-specific booster images, rarity background frame, static texture cache) |
| **Squad Management** | **90%** | **+4** (rarity gradients, in-squad icon, INF/CON/SHP columns, foot preference, morale, nationality flags) |
| **UI/Client** | **93%** | **+6** (replay overhaul, search improvements, manager avatar, rarity-coloured dropdowns, practice routing) |
| Marketplace | 83% | — |
| League System | 80% | — |
| **Training** | **78%** | **+3** (StartPracticeMatch + CheckPracticeMatchStatus APIs, practice tab, booster filtering) |
| Communication | 75% | — |
| Player Generation | 80% | — |
| Economy/Finances | 15% | — |
| PvP | 10% | — |
| Scout System | 5% | — |
| Tutorial | 5% | — |
| Cup Competitions | 0% | — |

## Critical Gaps (P0)

1. ~~**SCORING REALISM (cmp-053)**~~ — **SUBSTANTIALLY FIXED.** All 7 areas addressed + further tuning (first touch failure, outfield blocking, auto-dispossession). **Demoted to P2.**
2. **Financial economy missing** — No match income, wages, or sponsorship — **ONLY remaining P0**

## Major Gaps (P1)

1. Cup competitions — empty stub
2. Scout system — stub only
3. PvP — framework only, no matchmaking
4. ~~Collisions — 55%~~ → **70%** (movement smoothing, separation, speed retuning — upgraded to P2)

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
- Tackle system (6 variants by approach angle + aggression, critical failure on fatigue)
- GK reaction delay (agility/intelligence/confidence model, visibility delay per blocker)
- Outfield shot blocking (bravery+positioning within 1.5m of ball path)
- First touch failure system (multi-factor: distance, speed, touch, pressure, aggression)
- Linesman error modeling (±0.4m based on refereeSight attribute)
- Auto-dispossession (proximity-based 6% chance within 2m, 0.15s cooldown)
- Match replay viewer (intro overlay, live scoreboard, goal celebrations, highlights log, 1-15x speed)
- Rarity-specific booster artwork (16 images across 4 types × 4 rarities)
- Squad management UI (rarity gradients, in-squad indicators, INF/CON/SHP columns)

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
| BUG-009 | CRITICAL | Unrealistic scorelines (23-18, 32-26) | **SUBSTANTIALLY FIXED** — cmp-053 7/7 areas + further tuning (first touch failure, outfield blocking, auto-dispossession). Verification testing needed. |
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
| 24 Feb 2026 | 99% | 82% | 22 commits (18-24 Feb). cmp-053 scoring realism P0 substantially fixed (7/7 areas). Player states ~40+. Defensive AI overhauled. |
| **26 Feb 2026** | **99%** | **84%** | **14 commits, 91 files. ME: ball physics retuned, 6 tackle variants, GK reaction delay+freeze fix, linesman error, 30+ player states, auto-dispossession. Client: complete replay viewer (intro/scoreboard/celebrations/highlights/1-15x), 16 rarity booster images, squad mgmt polish (gradients/icons/columns). 8 ME entries resolved. Open ME: 2.** |
