# Match Engine Summary — FM2026 vs Legacy

**Updated: 23 February 2026 (deep-dive audit)** | **Score: 98%** (unchanged — no new commits since 17 Feb)

> **23 Feb deep-dive audit:** No new commits. cmp-042 (Foul Detection & Severity) corrected: `determineFoulType()` in `challengeController.js` confirmed with 6 foul types (STANDARD/VIOLENT/PROFESSIONAL/HANDBALL/SIMULATION/VERBAL) + last-man-back detection — status open→resolved with advisory. Fouls/Cards score 93%→97%. cmp-047 MISSING tag corrected (existsInFM2026 "no"→"yes"). Open ME items: reduced. Missing in FM2026 count: 9→8.
>
> **20 Feb status audit:** No new commits. cmp-028 chemistry confirmed active (15% pass bonus already live — previous 'TRACKING ONLY' label was wrong). cmp-043 goal pause, cmp-047 duplicate bugs confirmed resolved. cmp-046 transition lag confirmed (tacticalCacheUntil=0.9s + 0.3s throttle). Open ME items: 12 remaining (cmp-053 match balance most critical).
>
> Major feature additions across passing, GK AI, off-ball movement, set pieces, substitutions, and statistics. **CRITICAL CONCERN:** Decision interval halved (0.5s→0.15s) will worsen scoring inflation. cmp-053 documents the 7-area rebalancing plan needed to achieve realistic 0-0 through 5-0 scorelines.
>
> **DEEP-DIVE CORRECTION:** Initial 17 Feb assessment missed 23 implemented features. Deep read of all 24 changed files confirms: chemistry system (15% pass bonus), communication/ball-request, offside correction on attacking runs, GK punch + parry fumble, flair-based sweep range, high ball claiming, control-based first touch error, ball dribble pivot, full curl on all free balls, tactical movement flags (MovementFlag/MarkingFlag/squeeze), dynamic match duration (6s per goal + 30s per sub), attribute-based confidence init, movement smoothing, urgency-based acceleration, dribbler collision avoidance, context-aware celebration duration, goal post/crossbar collision physics, and free kick/corner specialist selection. Score corrected from 97% to 98%.

## What Changed (17 Feb 2026)

2 commits, 25 files (24 match engine). **Comprehensive realism overhaul.**

### Pass AI Rewrite (aiPass.js — 118 new lines)

| Feature | Detail |
|---------|--------|
| Vision-angle gate | Can't pass behind facing direction (vision+90° max) |
| RPG vision cone | Low-vision players (<50) restricted to 90° forward cone for receiver scan |
| Weak foot penalty | Cross-body passes penalized (0.6-1.0x based on weakFoot stat) |
| Completion probability | Long passes gate-checked against passing+vision skill |
| Power feasibility | Weak players can't deliver effective long-range passes |
| Backpass penalty | Unpressured defensive backpasses: 0.9→0.3 score (forces forward play) |
| Bounce-back killer | A→B→A pass patterns penalized 0.35x (kills ping-pong) |
| Tight marking penalty | Passes to tightly marked players penalized 0.5x |
| **Chemistry system** | playerFeeds tracks pass history; ≥3 passes to same target = up to 15% score bonus + 15% more accurate lead |

### GK AI Overhaul (aiKeeper.js — 179 new lines)

| Feature | Detail |
|---------|--------|
| Pre-shot awareness | GK positions on shooting arc 0.5s before shot is taken |
| Organic dive | No more teleport — 40% instant + 60% via movement system |
| Advanced penalty saves | Anticipation-weighted direction (42/16/42 vs 25/50/25) |
| Goal kick intelligence | Dedicated function targeting midfielders with skill-based inaccuracy |
| Clearance clamping | Bug fix: prevents kicks to coordinates outside pitch |
| **High ball claiming** | ball.h > 2.0m → BallPrediction times claim at 2.4m height (aerial sweeping) |
| **Flair-based sweep range** | Range = 15 + flair/5 (capped 25m). Neuer-style keepers with high flair territory |
| **Blocker visibility delay** | +50ms per nearby teammate blocking sightline in crowded box |
| **Parry fumble** | fumbleRoll > shotStopping → ball stays central, 60% speed reduction, rebound danger |

### New Movement Systems

| Feature | Detail |
|---------|--------|
| Sprint decisions | Timed runs behind defense (offside line proximity + carrier facing triggers) |
| Offside correction | applyOffsideCorrection clips attacking run targets 2m behind 2nd-deepest defender |
| Communication / ball-request | Player sets askingForBall when in space; attackers have lower thresholds (2.5m, 0.3 space) |
| Check-runs | Lateral bursts every 4-6s creating passing lanes |
| Organic movement | Distance-scaled amplitude (far from ball = more drift) |
| Cut-inside intelligence | Position + intelligence gates; GK jink evasion |
| **Tactical movement flags** | MovementFlag: "intobox" (box run) / "takethemon" (aggressive cut) from tactics system |
| **MarkingFlag / squeeze** | ManToMan reduces lane discipline 80%; squeezeInstruction limits block width (20-28m) |
| **Movement smoothing** | FADE_FACTOR=0.85 target interpolation prevents AI snap-to-target jitter |
| **Urgency acceleration** | critical=1.8x, high=1.3x accel rate — AI urgency physically affects movement ramp-up |
| **Dribbler collision avoidance** | Steers around opponents within 4m ahead; boundary repulsion at 2m from edges |

### Other Major Changes

| Feature | Detail |
|---------|--------|
| Tactical pressing flags | none (0.5x), deep (0.8x), high (1.3x) on trigger + intensity |
| Corner defensive positioning | 6 roles: near/far post, 3 zonal, edge clearance |
| Dynamic kickoff | Uses loaded tactic + intelligent best-fit player-to-slot sorting |
| Smart substitutions | Role-aware 4-tier fallback with stamina tiebreaker |
| Card ceremony delays | Red card +15s, yellow +3s dead ball time |
| Fatigue-aware challenges | Effective attributes used instead of raw values |
| Injury grounding | injuryLevel>25 = 3s on ground, no AI |
| Statistics overhaul | Touches, SOT, offsides tracked; role-weighted rating formula |
| Stamina model softened | No degradation above 50%; 50% floor at zero stamina |
| Spin force increased | 0.8→1.2 (free kicks bend more) |
| Goal net zones | Back/side/top with different damping coefficients |
| Decision interval halved | 0.50s→0.15s floor (WORSENS scoring inflation) |
| **Post/crossbar physics** | 4 posts FIFA geometry, elastic restitution 0.6; crossbar under/top/face collision |
| **GK keeper punch** | High balls (>1.8m) + low handling or fast shot → punch instead of parry (strength-based) |
| **First touch error** | Control-based: max ~1.5m error for control=0 + high incoming speed (matches legacy) |
| **Ball dribble pivot** | Ball pivots angularly at 12.0 rad/s when dribbler changes direction (smooth physics) |
| **Full curl on all balls** | SPIN_FORCE_FACTOR applies lateral curl every tick to any free ball — not just free kicks |
| **Dynamic match duration** | +6s injury time per goal, +30s per sub. High-scoring games run 5+ min beyond 90 |
| **Confidence initialization** | (perf*0.5 + ability*0.3 + intelligence*0.2) clamped 40-95. Elite players start higher |
| **Context-aware celebration** | Winning team +2s celebration; losing team -1.5s (hurries back) |
| **Free kick / corner specialists** | curve>75 selects FK taker; crossing>75 selects corner taker |

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
| Ball Physics | **96%** | +3 | Net zones, spin force, offside fix + curl on all balls, dribble pivot, post physics |
| Player AI | **99%** | +2 | Sprint decisions + confidence init, communication, offside correction |
| **Passing** | **99%** | **+3** | Vision-angle, weak foot, completion prob, power feasibility + chemistry, RPG cone |
| Shooting | 94% | +1 | Weak foot suppression, FK specialist |
| **Dribbling** | **97%** | **+3** | Cut-inside intelligence, GK jink + collision avoidance, boundary repulsion |
| **Goalkeeper AI** | **99%** | **+4** | Pre-shot awareness, organic dive, penalty logic + punch, fumble, flair sweep, high claim |
| **Off-ball Movement** | **99%** | **+2** | Sprint decisions, check-runs + offside correction, communication |
| **Pressing/Defending** | **96%** | **+3** | Tactical pressing flags + ManToMan, squeeze confirmed |
| **Tackling/Challenges** | **95%** | **+2** | Fatigue-aware, injury grounding |
| Fouls/Cards | **97%** | **+4** | Card ceremonies + 6-type foul classification confirmed (cmp-042 resolved) |
| **Set Pieces** | **99%** | **+2** | Corner defense, dynamic kickoff, FK/corner specialist selection |
| Formations/Tactics | 99% | +1 | Dynamic kickoff + intelligent slot sorting |
| Stamina/Fitness | 96% | -1 | Soft model possibly too gentle |
| Movement | **98%** | +2 | Dive override, stamina-dribble + movement smoothing, urgency accel |
| Spatial Analysis | 96% | — | |
| **Substitutions** | **98%** | **+3** | Role-aware 4-tier fallback |
| Player States | 68% | +3 | INJURED_GROUND, action states |
| **Statistics** | **98%** | **+3** | Touches, SOT, offsides, role-weighted |
| Officials | 35% | — | |
| **Collisions** | **55%** | **+25** | Post/crossbar elastic rebound confirmed (4 posts + crossbar, restitution 0.6) |
| Replay/Debug | 100% | — | |

## Remaining Gaps

| Gap | Score | Priority | Notes |
|-----|-------|----------|-------|
| **Scoring realism** | — | **P0** | cmp-053: 7-area rebalance (decision cadence, defense, shooting, GK, dead ball) |
| Player States | 68% | P2 | ~16 states coded, legacy has 130+ |
| Officials | 35% | P2 | Offside enforcement, referee sight, no linesman |
| Collisions | 55% | P1 | Post/crossbar physics confirmed; goalkeeper collision with ball (heading saves) still incomplete |

## Recommended Next Steps

1. **URGENT: Apply cmp-053 rebalancing** — 7 areas to produce realistic scorelines. Quick smoke test: decision interval 0.15s→2.0s, shot thresholds 0.72→0.85, 0.82→0.93
2. **Consider softening stamina model less** — 100% effectiveness above 50% stamina may be too gentle
3. **Verify scoring rates** after rebalancing with 20+ test matches (post/crossbar now confirmed, no longer a blocker)
4. **Player States** — close gap from 68% toward 80%+ for richer animation variety

**Match Engine Score: 98%** — Feature-rich and approaching Legacy parity. Scoring realism is the critical remaining challenge.
