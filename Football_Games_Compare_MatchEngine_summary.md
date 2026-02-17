# Match Engine Summary — FM2026 vs Legacy

**Updated: 17 February 2026** | **Score: 97%** (+1% — massive realism pass, 25 files, 1,007 insertions)

> Major feature additions across passing, GK AI, off-ball movement, set pieces, substitutions, and statistics. **CRITICAL CONCERN:** Decision interval halved (0.5s→0.15s) will worsen scoring inflation. cmp-053 documents the 7-area rebalancing plan needed to achieve realistic 0-0 through 5-0 scorelines.

## What Changed (17 Feb 2026)

2 commits, 25 files (24 match engine). **Comprehensive realism overhaul:**

### Pass AI Rewrite (aiPass.js — 118 new lines)

| Feature | Detail |
|---------|--------|
| Vision-angle gate | Can't pass behind facing direction (vision+90° max) |
| Weak foot penalty | Cross-body passes penalized (0.6-1.0x based on weakFoot stat) |
| Completion probability | Long passes gate-checked against passing+vision skill |
| Power feasibility | Weak players can't deliver effective long-range passes |
| Backpass penalty | Unpressured defensive backpasses: 0.9→0.3 score (forces forward play) |
| Bounce-back killer | A→B→A pass patterns penalized 0.35x (kills ping-pong) |
| Tight marking penalty | Passes to tightly marked players penalized 0.5x |

### GK AI Overhaul (aiKeeper.js — 179 new lines)

| Feature | Detail |
|---------|--------|
| Pre-shot awareness | GK positions on shooting arc 0.5s before shot is taken |
| Organic dive | No more teleport — 40% instant + 60% via movement system |
| Advanced penalty saves | Anticipation-weighted direction (42/16/42 vs 25/50/25) |
| Goal kick intelligence | Dedicated function targeting midfielders with skill-based inaccuracy |
| Clearance clamping | Bug fix: prevents kicks to coordinates outside pitch |

### New Movement Systems

| Feature | Detail |
|---------|--------|
| Sprint decisions | Timed runs behind defense (offside line proximity + carrier facing triggers) |
| Check-runs | Lateral bursts every 4-6s creating passing lanes |
| Organic movement | Distance-scaled amplitude (far from ball = more drift) |
| Cut-inside intelligence | Position + intelligence gates; GK jink evasion |

### Other Major Changes

| Feature | Detail |
|---------|--------|
| Tactical pressing flags | none (0.5x), deep (0.8x), high (1.3x) on trigger + intensity |
| Corner defensive positioning | 6 roles: near/far post, 3 zonal, edge clearance |
| Dynamic kickoff | Uses loaded tactic instead of hardcoded 4-3-3 |
| Smart substitutions | Role-aware 4-tier fallback with stamina tiebreaker |
| Card ceremony delays | Red card +15s, yellow +3s dead ball time |
| Fatigue-aware challenges | Effective attributes used instead of raw values |
| Injury grounding | injuryLevel>25 = 3s on ground, no AI |
| Statistics overhaul | Touches, SOT, offsides tracked; role-weighted rating formula |
| Stamina model softened | No degradation above 50%; 50% floor at zero stamina |
| Spin force increased | 0.8→1.2 (free kicks bend more) |
| Goal net zones | Back/side/top with different damping coefficients |
| Decision interval halved | 0.50s→0.15s floor (WORSENS scoring inflation) |

### Bug Fixes

| Fix | Detail |
|-----|--------|
| Offside reference | Used passer position → now uses actual ball position |
| Ghost kick | Pass vector from player pos → from ball pos |
| Wall release | Wall players freed before restart state reset |
| GK clearance | Target clamped to pitch bounds |
| Stale offside | Cleared on non-offside possession change |
| Curl on long passes | Removed (only crosses get curl now) |

## Score Breakdown

| Category | Score | Change | Notes |
|----------|-------|--------|-------|
| Ball Physics | 95% | +2 | Net zones, spin force, offside fix |
| Player AI | 98% | +1 | Sprint decisions |
| **Passing** | **98%** | **+2** | Vision-angle, weak foot, completion prob, power feasibility |
| Shooting | 94% | +1 | Weak foot suppression, FK routing |
| **Dribbling** | **96%** | **+2** | Cut-inside intelligence, GK jink |
| **Goalkeeper AI** | **97%** | **+2** | Pre-shot awareness, organic dive, penalty logic |
| **Off-ball Movement** | **99%** | **+2** | Sprint decisions, check-runs |
| **Pressing/Defending** | **95%** | **+2** | Tactical pressing flags |
| **Tackling/Challenges** | **95%** | **+2** | Fatigue-aware, injury grounding |
| Fouls/Cards | 93% | +1 | Card ceremonies |
| **Set Pieces** | **99%** | **+2** | Corner defense, dynamic kickoff, FK routing |
| Formations/Tactics | 99% | +1 | Dynamic kickoff |
| Stamina/Fitness | 96% | -1 | Soft model possibly too gentle |
| Movement | 97% | +1 | Dive override, stamina-dribble |
| Spatial Analysis | 96% | — | |
| **Substitutions** | **98%** | **+3** | Role-aware 4-tier fallback |
| Player States | 68% | +3 | INJURED_GROUND, action states |
| **Statistics** | **98%** | **+3** | Touches, SOT, offsides, role-weighted |
| Officials | 35% | — | |
| Collisions | 30% | — | |
| Replay/Debug | 100% | — | |

## Remaining Gaps

| Gap | Score | Priority | Notes |
|-----|-------|----------|-------|
| **Scoring realism** | — | **P0** | cmp-053: 7-area rebalance (decision cadence, defense, shooting, GK, dead ball) |
| Player States | 68% | P2 | 16 states coded (+INJURED_GROUND), no full animation mesh |
| Officials | 35% | P2 | Offside enforcement, referee sight, no linesman |
| Collisions | 30% | P1 | Deflection physics, no post/crossbar |
| Ball spin prediction | — | P2 | Constants exist but unused |

## Recommended Next Steps

1. **URGENT: Apply cmp-053 rebalancing** — 7 areas to produce realistic scorelines. Quick smoke test: decision interval 0.15s→2.0s, shot thresholds 0.72→0.85, 0.82→0.93
2. **Consider softening stamina model less** — 100% effectiveness above 50% stamina may be too gentle
3. **Add post/crossbar collisions** — Most impactful remaining feature gap
4. **Verify scoring rates** after rebalancing with 20+ test matches

**Match Engine Score: 97%** — Feature-rich and approaching Legacy parity. Scoring realism is the critical remaining challenge.
