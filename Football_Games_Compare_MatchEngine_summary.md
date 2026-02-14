# Match Engine Summary — FM2026 vs Legacy

**Updated: 14 February 2026** | **Score: 90%** (-8% from 98% — BALANCE REGRESSION)

> Score reduced due to scoring realism issues (17-32 scorelines), not feature removal. Features exist but are severely unbalanced. 6 identified fixes would restore to 98%+.

## What Changed (14 Feb 2026)

2 commits, 25 files changed. **No match engine logic changes** — only cosmetic/data fixes:
- `.number` → `.shirt_number` field rename in matchMain.js and matchesRunner.js
- `aiRecords` removed from match result output (performance improvement)
- Visual card UI updates (client-side only)

### CRITICAL: Scoring Realism Diagnosis

Deep investigation revealed **6 compounding root causes** for 17-32 scorelines:

| # | Issue | ID | Severity |
|---|-------|----|----------|
| 1 | **Shot multiplier stacking**: 8x compound boost inside box (aiShot.js 4x + playerAIController.js 2x) | cmp-048 | P0 |
| 2 | **GK parry pinball**: 95% of saves are parries → shot-parry-shot-goal loops | cmp-050 | P0 |
| 3 | **GK height gate**: Save system requires ball.height ≤ 1.1m (crossbar at 2.44m) | cmp-049 | P0 |
| 4 | **Shot thresholds**: 0.55/0.70 insufficient when multipliers create 8x boost | cmp-044 | P0 |
| 5 | **Shot accuracy**: 4.5m lateral clamp (posts at 3.66m) — shots can't miss wide | cmp-051 | P1 |
| 6 | **No pass-vs-shoot intelligence**: No Vision-based teammate preference gate | cmp-052 | P1 |
| 7 | **Foul rate inflated 7x**: Base 0.35 (should be 0.05 per code comment) | cmp-012 | P1 |
| 8 | **Decision cooldowns**: 0.5s uniform vs legacy's 0.87-1.53s action-specific | cmp-045 | P0 |

### How Legacy Achieves Realistic Scores

Legacy produces 1-3 goal matches through:
- **5x shot inaccuracy multiplier** (vs passes) — shots genuinely miss
- **No close-range multipliers** — distance gate alone (18+PowerStat/5 yards) is sufficient
- **Timing-based catch/parry** — catches are the norm, parries only when GK is late
- **Vision-based pass preference** — intelligent players pass to better-placed teammates (maxDist/4)
- **Action-type-specific cooldowns** — dribble lock 1.33s, shot cooldown 0.8s, keeper hold 1.6-4.0s
- **Decision chain priority** — Cross > Shoot > Pass > Dribble (shooting must beat alternatives)

## Score Breakdown

| Category | Score | Change | Notes |
|----------|-------|--------|-------|
| Ball Physics | 93% | — | |
| Player AI | 93% | -4 | No Vision-based pass-vs-shoot gate |
| Passing | 95% | — | |
| **Shooting** | **75%** | **-23** | 8x multiplier stacking, accuracy clamping |
| Dribbling | 93% | — | |
| **Goalkeeper AI** | **70%** | **-28** | Height gate, 95% parry rate |
| Off-ball Movement | 97% | — | |
| Pressing/Defending | 93% | — | |
| Tackling/Challenges | 93% | — | |
| **Fouls/Cards** | **85%** | **-7** | Foul base rate 0.35 (should be 0.05) |
| Set Pieces | 97% | — | |
| Formations/Tactics | 98% | — | |
| Stamina/Fitness | 97% | — | |
| Movement | 95% | — | |
| Spatial Analysis | 96% | — | |
| Substitutions | 95% | — | |
| Player States | 65% | — | |
| Statistics | 95% | — | |
| Officials | 35% | — | |
| Collisions | 30% | — | |
| Replay/Debug | 100% | — | |

## Remaining Gaps

| Gap | Score | Priority | Notes |
|-----|-------|----------|-------|
| **Scoring realism** | — | **P0** | **6 compounding issues producing 17-32 scorelines** |
| **Decision intervals** | — | **P0** | 0.5s uniform vs legacy 0.87-1.53s |
| Player States | 65% | P2 | 15 states coded, no full animation mesh |
| Officials | 35% | P2 | Offside enforcement, referee sight, no linesman |
| Collisions | 30% | P1 | Deflection physics, no post/crossbar |
| Ball spin prediction | — | P2 | SPIN_FORCE_FACTOR exists but unused in prediction |
| Penalty shootout trigger | — | P2 | Infrastructure exists, no match config flag |
| Performance rating depth | — | P2 | 9 stats vs legacy's 12+ |

## Recommended Fix Priority

Apply these in order for maximum impact:

1. **Reduce shot multipliers** (cmp-048) — Change 4x to 1.4x in aiShot.js, DELETE duplicate boost in playerAIController.js
2. **Fix GK height gate** (cmp-049) — One-line change: `ball.height <= 1.1` → `ball.height <= 2.6`
3. **Fix GK catch rate** (cmp-050) — Reduce speed penalty: `(ballSpeed - 15) / 40` instead of `(ballSpeed - 12) / 20`
4. **Raise shot thresholds** (cmp-044) — 0.55→0.72 close, 0.70→0.82 distant
5. **Revert foul rate** (cmp-012) — 0.35→0.05 (one-line change)
6. **Widen shot accuracy** (cmp-051) — BASE_ERROR_MIN: 8.0, MAX: 30.0, CLAMP: 8.0
7. **Add Vision gate** (cmp-052) — Quarter shot range when teammate is better placed
8. **Action-specific cooldowns** (cmp-045) — Shot 1.5s, dribble lock 1.2s, pass 0.8s

**Match Engine Score: 90%** — Balance regression. Features are near-complete but produce unrealistic results. The 6 fixes above would restore realistic 1-3 goal matches.
