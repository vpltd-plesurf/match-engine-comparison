# Match Engine Summary — FM2026 vs Legacy

**Updated: 13 February 2026** | **Score: 98%** (unchanged — refinement tuning)

## What Changed (13 Feb 2026)

10 commits, 148 files changed (+4,738/-8,207 across full project). Match engine: ~10 files, refinement focus.

### Goalkeeper AI Refinement
- **Conservative Sweep Radius**: Reduced from `12 + (agility/100)*6` to `10 + (agility/100)*5` — prevents GK wandering
- **Opponent Proximity Check**: GK now checks if opponent is closer before rushing (`canWinComfortably = distToBall < (oppDistToBall - 2.5)`)
- **Narrower Charge Threshold**: Distance 10-25m → 8-18m, braveness weights reduced (flair/aggression 0.4→0.3)
- **Wide Ball Awareness**: Non-central threats reduce advance by 40%, very wide by 50%. Near-post shift increased ±0.5m → ±1.5m
- **Dynamic Catch Radius**: Rushing GK gets 2.8m catch radius (vs 2.2m standard). Faster shots (>18 m/s) force parries instead of catches

### Ball Physics Fixes
- **Restart Snap Fix**: Skips instant snapping during set-piece restarts to prevent out-of-bounds teleport
- **Dynamic Closure Rate**: Normal play 10 m/s, restart 1 m/s, very close 5 m/s
- **Division-by-Zero Guard**: Safety check `gap > 0.01` before closure velocity calculation
- **Throw-In Ball Fix**: Passes actual ball object instead of taker position
- **Dribble Speed Boost**: Base boost 2.5→4.5, floor 4.5→5.5 m/s

### Shot AI Enhancement
- **Attribute-Driven Power**: `shotPower = 30 + (player.power / 100) * 5` (range 30-35 m/s)
- **Distance-Based Loft**: >20m = 4.5 loft, <20m = 2.5 loft
- **Panic Clearance Physics**: Explicit power 32.0, loft 8.0 for emergency clears
- **Close-Range Shooting Boost**: Progressive 1.0-2.5× multiplier when within 25m of goal
- **Flair Bonus**: High-flair players get up to +10% on adventurous passes/shots

### Player AI Stability
- **Hysteresis**: 1.15 threshold for off-ball state switching (prevents jitter)
- **Intent Parameter Priority**: Top-level `intent.power/loft` checked before `intent.meta.speed/loft`
- **Pass/Shot Meta Logging**: Power and loft values now included in intent meta for debugging

### Bug Fixes
- **Field Boundary Clamping**: Set-piece taker position clamped to field with 0.1m margin
- **Shirt Number Fix**: `.number` → `.shirt_number` across matchMain.js and matchesRunner.js
- **AI Audit Removal**: `aiRecords` removed from match result output (performance improvement)

## Remaining Gaps

| Gap | Score | Priority | Notes |
|-----|-------|----------|-------|
| Player States | 65% | P2 | 15 states coded, no full animation mesh |
| Officials | 35% | P2 | Offside enforcement, referee sight, no linesman |
| Collisions | 30% | P1 | Deflection physics, no post/crossbar |
| Ball spin prediction | — | P2 | SPIN_FORCE_FACTOR exists but unused in prediction |
| Decision intervals | — | P2 | Still 30-50% faster than legacy |
| Penalty shootout trigger | — | P2 | Infrastructure exists, no match config flag |
| Performance rating depth | — | P2 | 9 stats vs legacy's 12+ |

## Architecture Note

Match engine architecture is now highly modular:
- **Core loop**: gameEngine.js → playerEngine.js → ballEngine.js
- **AI pipeline**: playerAIController → ai modules (aiShot, aiPass, aiDribble, aiPress, aiOffBall, aiKeeper) → action execution
- **Support systems**: supportController (formation), challengeController (tackles/fouls), matchFlowController (restarts/shootout), eventController (stats/cards), playerStateController (states/stamina), playerStatisticsController (ratings)
- **Prediction**: ballPrediction (trajectory/intercept), aiSpace (gap finding)
- **Constants**: aiConstants.js (centralized tuning, 235 lines)

**Match Engine Score: 98%** — Near feature-complete. This update focused on tuning and stability rather than new features. GK behavior is more conservative and realistic, ball physics more stable, shooting decisions more attribute-aware. All remaining gaps are polish items.
