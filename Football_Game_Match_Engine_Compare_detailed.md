# Football Match Engine Comparison — Detailed Gap Analysis

**Date:** 6 February 2026 (created) | **Last inline update:** 14 February 2026
**Scope:** Match engine only — no game features, API, marketplace, or NFT systems
**Purpose:** Expanded version of `Football_Game_Match_Engine_Compare.md` with specific detail on every missing feature

---

## 1. Executive Summary

| Metric | FM2026 | Legacy |
|--------|--------|--------|
| Language | JavaScript (Node.js) | C# (Unity) |
| Core Lines | ~7,500-10,000 | ~18,000-20,000 (logic only, ~37K with visuals) |
| Tick Rate | 20Hz (0.05s) | 750Hz (TIMESCALE) |
| Determinism | Seeded RNG | Integer math (ROTATION_SCALE) |
| AI Decision Rate | Every 0.35-0.75s (vision-based) | Every tick |
| Player States | ~15 action states | 130+ |
| Game States | ~7 play states + penalty shootout | 25+ |
| Files | ~42 | ~22 |

### Overall Match Engine Score: **FM2026 is 90% feature-complete vs Legacy**

> **14 Feb 2026 NOTE:** Score reduced from 98% to 90% despite no features being removed. The engine produces **17-32 scorelines** due to critical balance issues: 8x shot multiplier stacking, 95% GK parry rate, 1.1m GK height gate, and inflated foul rates. Features *exist* but are severely unbalanced. Score will return to 98% once the 6 identified balance fixes are applied.

---

## 2. Feature-by-Feature Comparison with Detailed Gap Analysis

---

### 2.1 Ball Physics — **93%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Gravity | -9.81 m/s² | ROTATION_SCALE / 5000 | Both present |
| Air drag | Quadratic (0.015) | Quadratic (0.0002) | Both present, different coefficients |
| Ground friction | 9.0 m/s² decel | GROUND_FRICTION = 10 | Both present |
| Bounce damping | 0.65 (35% loss) | 0.5 (50% loss) | Both present |
| Ball flight | Full ballistic model | Full ballistic model | Both present |
| Roll stop | 0.5 m/s threshold | Friction-based decay | Both present |
| Curl/swerve | Free kick curl only | Full `m_CurlVelocity` system with foot-side | **Legacy deeper** |
| Ball prediction | `ballPrediction.js`: trajectory, intercept, height-crossing | `NewTimeBallWillBeClosest()` | FM2026 richer (dedicated module) |
| Header prediction | Via `ballPrediction.js` height-crossing detection | `NewTimeBallWillBeHeadable()` with drop table | **Mostly matched** |
| Restart physics | Dynamic closure rate (normal 10, restart 1, close 5 m/s) | Instant snap | FM2026 smoother |
| Dribble speed | Base +4.5, floor 5.5 m/s | Not explicit | FM2026 has it |
| Division-by-zero | `gap > 0.01` guard | Not explicit | FM2026 has it |

**What FM2026 is missing (remaining gaps):**

- **Full curl/swerve vector (`m_CurlVelocity`):** Legacy applies a continuous perpendicular curl velocity to the ball throughout its entire flight — not just on free kicks. This means every pass, cross, and shot can curve naturally. FM2026 only applies curl on free kick shots via `(curveAttr - 60) / 4.0`. The legacy curl equation is `deviation = 1 + ((v² × 0.5) - (v × 1.5))` which creates increasing swerve at moderate speeds and extreme swerve at high speeds. `SPIN_FORCE_FACTOR` exists in FM2026's physicsConstants but `ballPrediction.js` ignores it.

- **Foot-side curl detection:** Legacy's `CalcCurlAndAim()` detects which foot the player is using and applies natural curl direction. FM2026 has a `curveAttr` for free kicks but doesn't model foot-side swerve on regular passes and shots.

**Previously missing, now resolved:**
- ~~Dedicated header prediction~~ — `ballPrediction.js` provides height-crossing detection that covers ~85-90% of legacy's `NewTimeBallWillBeHeadable()` capability.
- ~~Ball trajectory prediction~~ — New `ballPrediction.js` (131 lines) with trajectory prediction, intercept calculation, and height-crossing detection using realistic physics (gravity -9.81, quadratic drag, bounce damping).

---

### 2.2 Player AI Decision Making — **97%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Decision framework | Intent-based (pass/shoot/dribble/move) | State machine + scoring | Both solid |
| Pass decision | Scored 0-100 with lane safety + vision cone | 360° scan with angle scoring | Both thorough |
| Shot decision | 6-gate filter + GK-aware aiming + attribute power | Finishing accuracy + pressure scoring | **FM2026 now deeper** |
| Dribble decision | Multi-factor scoring (7+ factors) | Safety distance/angle/speed thresholds | FM2026 richer |
| Off-ball decision | 5-tier hierarchy + communication + 5 run types | Heat map + marking + role aggression | Both present |
| AI decision rate | Every 0.35-0.75s (vision-based) + 600ms hysteresis | Every tick | Legacy faster, FM2026 smarter |
| `AmIBestPlaced()` | Implicit in scoring + close-range boost | Explicit function comparing shot vs pass | Both effective |
| Game state awareness | Score diff + match stage → protect/chase/push | Not explicit | **FM2026 has it** |
| Captain leadership | Proximity 5% boost within 25m, 0.75-1.25× modifier | Not explicit | **FM2026 has it** |
| Flair impact | +10% on adventurous passes/shots for high-flair players | Not explicit | **FM2026 has it** |
| Decision stability | Hysteresis 1.15 for off-ball state switching | Not explicit | **FM2026 has it** |
| Close-range boost | Progressive 1.0-2.5× within 25m of goal | Not explicit | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Per-tick AI responsiveness:** Legacy AI recalculates every tick (750Hz). FM2026 uses vision-based intervals (0.35-0.75s) which are smarter but still 30-50% faster decision cycles than legacy (0.87-1.53s). This is now a minor gap — FM2026's decision intervals are reasonable and the hysteresis system prevents jitter.

**Previously missing, now resolved:**
- ~~`AmIBestPlaced()`~~ — Close-range shooting boost (1.0-2.5× within 25m) and 6-gate shot filter effectively replicate this.
- ~~No game state awareness~~ — All AI modules now receive score differential and match stage context.
- ~~No captain/leadership system~~ — Proximity-based 5% boost within 25m with attribute-derived modifier.
- ~~Decision intervals too fast~~ — Vision-based 0.35-0.75s intervals with 600ms hysteresis (improved from flat 0.2s).

---

### 2.3 Passing System — **95%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Pass scoring | 0-100 with 5+ factors | Angle/distance/pressure scoring | Both thorough |
| Lane safety | Cone-based blocking (~25°) | Opposition angle effect | Both present |
| Chemistry/feeds | `playerFeeds` tracking + CHEMISTRY bonuses | `m_playerFeeds[4,11]` matrix | Both present |
| Weak foot | 30% accuracy, 10% power penalty | Left/right foot skill difference | Both present |
| Through balls | Progress bonus in scoring | Pass area zones | Both present |
| Pass types | Ground/lofted/cross/cutback | Short/long/through/cross/clearance | Both present |
| Communication | `askingForBall` + COMMS_BONUS + HeatMap | Not explicit | **FM2026 has extra system** |
| Vision cone | Players with vision < 50 limited to 90° forward | Not explicit | **FM2026 has it** |
| Cutback detection | 2.0-2.5× tactical bonus | Not explicit | **FM2026 has it** |
| Pass blocking cone | Angle-based with 15° safety margin + dynamic | Opposition angle effect | FM2026 deeper |
| Training effect | None | Team training bonuses affect quality | **Legacy has it** |

**What FM2026 is missing:**

- **Training effect on passing quality:** In legacy, team training sessions (e.g. `m_training_crossing`, `m_training_corners`) apply bonuses to set-piece delivery quality and specific pass types. A team that trains crossing frequently will deliver better crosses. FM2026 has no mechanism for training to influence match-engine pass quality — training only affects player stats outside the engine.

- **Per-formation feed matrix:** Legacy's `m_playerFeeds[4,11]` is a 2D matrix mapping 4 saved formations × 11 players, where each player has designated feed targets per formation. This creates structured passing patterns — e.g., in a 4-3-3, the right-back's primary feed target might be the right winger, and the CM feeds the strikers. FM2026's `playerFeeds` dictionary tracks actual combinations that develop organically during the match, which is good, but it lacks the pre-match tactical intent of "this player should primarily pass to these specific teammates."

---

### 2.4 Shooting System — **75%** (was 98% — balance regression)

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Shot scoring | 6-gate filter: distance → vision → pressure → weak foot → facing → threshold | Distance + angle + finishing | **FM2026 deeper** |
| GK-aware aiming | Looks at GK position, aims for gap | Yes | Both present |
| Shot error | Based on shooting attribute | Based on finishing accuracy | Both present |
| Shot power | Attribute-driven: `30 + (player.power/100)*5` (30-35 m/s) | Based on shooting attribute | Both present |
| Distance-based loft | >20m = 4.5, <20m = 2.5 | Not explicit | **FM2026 has it** |
| Close-range boost | Progressive 1.0-2.5× within 25m | Not explicit | **FM2026 has it** |
| Chip shots | GK positioning aware | Not explicit | **FM2026 has it** |
| Free kick shots | 28 m/s, curl, dip | Full curl/swerve via CalcCurlAndAim | Both present, legacy deeper curl |
| Penalty system | GK-aware + direction guessing (anticipation-based) | Dedicated state + training effect | Both present |
| Panic clearance | Explicit power 32.0, loft 8.0 | Via emergency pass | **FM2026 more explicit** |
| Shot range cap | Power-based: maxRange = 18 + (power/5) | Not explicit | **FM2026 has it** |
| Heat map learning | Threshold reduced in areas of previous attack success | Not explicit | **FM2026 has it** |
| Flair bonus | +10% on adventurous shots for high-flair players | Not explicit | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Full curl on all shots:** Legacy applies curl via `m_CurlVelocity` on every shot, not just free kicks. FM2026 shots use error deviation but not continuous swerve on regular shots.

- **Penalty training bonus:** Legacy tracks `m_training_penalties` which improves penalty conversion rate. FM2026's penalties use attribute-based system with no training influence.

**NEW CRITICAL ISSUES (14 Feb 2026 — causing 17-32 scorelines):**

- **Shot multiplier stacking (cmp-048):** aiShot.js applies 2x at <16m and another 2x at <10m (cumulative 4x), plus playerAIController.js adds another ~2x distance boost. Combined: **~8x score multiplier** inside the box. A base score of 0.07 clears the 0.55 threshold. Every player near the goal shoots on every decision cycle.

- **Shot accuracy clamped too tight (cmp-051):** ACTUAL_TARGET_CLAMP_Y = 4.5m but goalposts are at 3.66m — shots can only miss wide by 0.84m. Legacy uses a 5x inaccuracy multiplier for shots (vs passes) with no clamping, so shots genuinely miss the target ~50-65% of the time.

- **No pass-vs-shoot intelligence gate (cmp-052):** Legacy's Vision stat check makes intelligent players pass to better-placed teammates (maxDist/4 if teammate is better positioned). FM2026 has no equivalent — the massive multipliers make shooting always win over passing inside the box.

**Previously missing, now resolved:**
- ~~Power variation too static~~ — Now attribute-driven with range 30-35 m/s.
- ~~No shot filtering~~ — 6-gate filter matches legacy's multi-layered approach (distance, vision, pressure, weak foot, facing, threshold).

---

### 2.5 Dribbling System — **93%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Dribble scoring | 7+ factors (progress, safety, pressure, solo, tactical, space) | Safety distance/angle/speed thresholds | FM2026 more sophisticated |
| Dribble styles | carry, cut, shield, gap | Not explicit styles | FM2026 has variety |
| Solo run prevention | Penalty after 20m/40m | Not explicit | FM2026 has it |
| Ball control | Control attribute affects first touch | ballControl attribute | Both present |
| Tactical context | Role-based multipliers (defender discouraged) | Role aggression values | Both present |
| 360° scanning | Via heat map | Explicit 360° per-degree scoring | **Legacy deeper** |

**What FM2026 is missing:**

- **360-degree per-degree directional scanning:** Legacy's `PlayerAI.cs` scans every degree around the dribbler (0-359°), scoring each direction based on:
  - `theirAngle` — angle to each opponent relative to this direction
  - `angleGap` — gap between opponents in this direction
  - `theirSpeed` — closing speed of opponents from this direction
  - `theirDistance` — distance of opponents in this direction
  - `theirGoalDistance` — how close this direction leads toward goal

  This produces a detailed "safety map" showing exactly which direction has the most space. FM2026 uses heat map zones and opponent distance checks, which is effective but coarser — it evaluates zones rather than exact angles. The legacy per-degree scan catches narrow channels between two defenders that a zone-based system might miss.

---

### 2.6 Goalkeeper System — **70%** (was 98% — balance regression)

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Positioning | Angle narrowing + predictive positioning | CloseAnglePosition() | Both present |
| Dive system | Catch/parry/deflection with elastic reflection | 12 distinct dive variants with ms timing | Legacy has more visual variety |
| Rush/sweep | Conservative: 10+(agility/100)*5 radius, opponent check | Flair + agility based thresholds | Both present |
| 1v1 charging | Braveness-based 8-18m threshold, catch radius 2.8m | Flair + agility based | Both present |
| Distribution | Defender preference, lane safety, 3 methods | Roll/bowl/kick | Both present |
| Reaction delay | Agility/intelligence/confidence + blocker penalty (0.15-0.4s) | Alert distance based | **FM2026 more detailed** |
| Cross claiming | Via aerial challenge + high ball trajectory prediction | Dedicated keeper event | Both present |
| Hold duration | 400ms-6000ms based on pressure | Not explicit | FM2026 has it |
| Parry physics | 8-12 m/s, 30-90° variance + fast shots (>18 m/s) force parry | ParryBall() with skill-based accuracy | Both present |
| Wide ball awareness | Non-central -40%, very wide -50%, near-post shift ±1.5m | Not explicit | **FM2026 has it** |
| Chip shot defense | Positioning awareness for chip attempts | Not explicit | **FM2026 has it** |
| Penalty saves | Direction guessing (anticipation-based) | Dedicated penalty state | Both present |
| Sweeper keeper | Flair-based sweep range (15 + flair/5) | Not explicit | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **12 dive animation variants:** Legacy has 12 distinct dive types with ms-level timing. FM2026 uses catch/parry/deflection distinction with elastic reflection physics — functionally effective but less visually granular. For headless simulation this is cosmetic, but if a 3D viewer is added, dive variants would improve realism.

- **Keeper emotional reactions:** Legacy has `keeperReactingAngry` and `keeperReactingDisappointed` states. FM2026 has confidence drops numerically but no behavioral change. Low priority for headless engine.

**NEW CRITICAL ISSUES (14 Feb 2026 — causing 17-32 scorelines):**

- **GK height gate (cmp-049):** `_checkBallPickup()` in gameEngine.js requires `ball.height <= 1.1m` to trigger a save attempt. The crossbar is at 2.44m. Shots between 1.1m and 2.44m bypass the save system entirely — no dive, no parry, nothing. The keeperAction.js code handles heights up to 2.6m internally, but is never called for mid/high shots.

- **95% parry rate — pinball effect (cmp-050):** The catch probability formula produces ~5% catch rate for average shots. For a keeper with handling=50 facing a 25 m/s shot: catchChance=0.34, speedPenalty=0.60, finalCatchProb=max(0.05, -0.26)=0.05. The 95% of saves that become parries drop the ball 2-5m from goal, where another attacker shoots immediately (due to 8x multiplier + fast cooldowns). This creates shot→parry→shot→goal loops. Legacy's timing-based system catches the ball when the GK reacts in time, ending the attack cleanly.

**Previously missing, now resolved:**
- ~~No reaction delay~~ — Full attribute-based reaction system (agility/intelligence/confidence + blocker penalty).
- ~~No 1v1 charging~~ — Braveness-based charge with opponent proximity check, 2.8m rushing catch radius.
- ~~No high ball claiming~~ — Trajectory prediction for sprint-to-intercept lobs.
- ~~Basic positioning~~ — Now has conservative sweep radius, wide ball awareness, near-post shifting, and predictive positioning.

---

### 2.7 Tackling/Challenges — **93%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Tackle types | 6 types: BLOCK, BLOCK_HARD, SWIVEL, SWIVEL_HARD, SLIDE_SAFE, SLIDE_WILD | 4 types: block/slide × normal/hard | **FM2026 now exceeds** |
| Win probability | 50% base + strength + angle + grace | Tackling vs dribbling/ballControl | Both present |
| Cooldowns | Detailed (winner 1.2s, loser 1.8s, steal 0.85s) | Present | FM2026 more explicit |
| Post-tackle effects | Stumble (0.4s), speed boost (0.4s), immunity (0.35s) | 10+ trip/fall variants | Legacy deeper visual |
| Tackle radius | 1.6m | Not explicit constant | FM2026 more defined |
| Aggression influence | Per-player aggression + approach angle selects type | Player aggression stat + hard tackle selection | Both present |
| Foul risk per type | Different per tackle type (slide > block, hard > normal) | Different per tackle type | Both present |
| Tactical flags | stayonfeet (-60% foul, -6% win) / noprisoners (+120% foul, +12% win) | Not explicit | **FM2026 has it** |
| Injury from tackles | Physique + velocity + proneness; noprisoners = 1.6× damage | Not explicit | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Shoulder charge variant:** Legacy has a shoulder-to-shoulder challenge type. FM2026's 6 types cover standing and sliding but not shoulder charges.

- **10+ post-tackle fall/trip variants:** Legacy has specific trip animations with different recovery times. FM2026 uses a single `stumbleUntil` timer (0.4s). For headless simulation the functional impact is minor.

- **Careless vs reckless distinction:** Legacy distinguishes between careless (free kick), reckless (yellow card), and excessive force (red card) for the same tackle type. FM2026 has foul type classification but not this three-tier severity within each type.

**Previously missing, now resolved:**
- ~~Single challenge type~~ — Now 6 tackle types selected by approach angle + aggression.
- ~~No per-player aggression~~ — Aggression stat now influences tackle type selection.
- ~~Flat 15% foul rate~~ — Each tackle type has distinct foul risk profile.
- ~~No tactical tackle modifiers~~ — stayonfeet and noprisoners flags with significant risk/reward tradeoffs.

---

### 2.8 Foul/Card System — **85%** (was 92% — foul rate regression)

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Foul detection | Context-based per tackle type | Incident-based with types | Both present |
| Foul types | 6 types: STANDARD, VIOLENT, PROFESSIONAL, HANDBALL, SIMULATION, VERBAL | Standard, violent, professional, handball, verbal, simulation | **Now matched** |
| Yellow cards | Yes + confidence tracking | Yes + animated sequence | Both present |
| Red cards | DOGSO, violent conduct, 2nd yellow → red | DOGSO, violent conduct, 2 yellows | Both present |
| 2nd yellow → red | Full: card count tracking, isSecondYellow flag, ejection | Yes | **Now matched** |
| Simulation/diving | FlairStat-based simulation type | Yes, FlairStat-based | Both present |
| Professional foul | DOGSO + tactical foul detection | Explicit professional foul detection | Both present |
| Handball | Handball foul type exists | Explicit handball detection | Both present |
| Referee blindness | Sight-based (85/100) foul miss chance for minor fouls | Visibility-based (100-point threshold) | Both present |
| Injury time | +6s per card event | Not explicit per-event | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Full referee visibility system:** FM2026 has referee blindness (85/100 sight-based miss chance) but not the full positional visibility system where the referee must have line-of-sight based on actual position and angle. Legacy scores 100+ visibility points from distance/angle. FM2026's system is simpler but functional.

- **Card presentation sequence:** Legacy has animated card presentation states. FM2026 is headless so this is cosmetic.

**NEW ISSUE (14 Feb 2026):**

- **Foul base rate inflated 7x (cmp-012 reopened):** challengeController.js:402 has `foulRisk || 0.35` — a code comment says "Temporarily boosted (0.05 -> 0.35)" but it was never reverted. This means ~35% of all tackles produce fouls before any aggression/tackling modifiers. With from-behind (2.5x) and noprisoners (+220%) modifiers, fouls in the penalty area are extremely frequent, generating excessive penalties. Legacy uses a geometric/timing check (defender closer to opponent than ball), not a flat probability.

**Previously missing, now resolved:**
- ~~1 generic foul type~~ — Now 6 foul types matching legacy's classification.
- ~~No 2nd yellow tracking~~ — `eventController.js` tracks per-player card count, emits `isSecondYellow`, triggers ejection.
- ~~No simulation/diving~~ — Simulation foul type now exists.
- ~~No professional foul~~ — Professional foul type now exists.
- ~~No referee awareness~~ — Sight-based blindness system for minor fouls.

---

### 2.9 Set Pieces — **97%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Kickoff | Full setup sequence | Full setup with dedicated state | Both present |
| Corner kicks | 3 strategies (load/short_corner/safe) + specialist placement | Dedicated roles (nearpost, farpost, goshort, onkeeper, zonal, marker, covershort) | Both present |
| Free kicks | Direct with curl/dip | Direct + indirect, dedicated states per type | Legacy has indirect |
| Throw-ins | ±35°, 8-12 m/s, ball object passed correctly | Dedicated taker state | Both present |
| Penalties | GK-aware + anticipation-based direction guessing | Dedicated state + training effect | Both present |
| Goal kicks | Present | Present | Both present |
| Penalty shootout | Full: 5-round + sudden death, taker selection by attribute | `shootOut` / `inPlayShootOut` | **Now matched** |
| Wall positioning | 9.15m perpendicular, 2-5 players by distance/angle | Dedicated wall formation | Both present |
| Conditional tactics | Time (15/30/45/60/75min) + state triggers | Not explicit | **FM2026 has it** |
| Boundary clamping | Taker position clamped with 0.1m margin | Not explicit | **FM2026 has it** |
| Training effect | None | 9 training types affect set piece quality | **Legacy has it** |

**What FM2026 is missing (remaining gaps):**

- **Indirect free kicks:** Legacy distinguishes between direct and indirect free kicks. FM2026 only handles direct.

- **9 training types affecting set piece quality:** FM2026 has no training→match quality pipeline. Set piece quality is purely based on individual player attributes.

- **Penalty shootout trigger:** Infrastructure exists (full 5-round + sudden death) but no match configuration flag triggers it automatically (needs cup competition integration).

**Previously missing, now resolved:**
- ~~No corner strategies~~ — 3 strategies (load/short_corner/safe) with specialist placement (tallest to near/far post).
- ~~No penalty shootout~~ — Full implementation: 5-round + sudden death, taker selection by penalty attribute, round/turn/score tracking.
- ~~No defensive wall~~ — 2-5 players, 9.15m perpendicular from ball, sized by distance/angle.
- ~~No conditional tactics~~ — Time triggers (15/30/45/60/75min) + state triggers (GoalUp/Down/AllSquare).
- ~~Generic corner positioning~~ — Specialist placement now assigns tallest players to near/far post.

---

### 2.10 Formations & Tactics — **98%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Grid system | 6×5 | 6×5 (standard) + 18×15 (heat map) | Both present |
| Formation compression | Tactical squeeze: width 0.85-0.92, depth 0.80-0.90 | Squeeze (0.25) / spread (0.025) | **FM2026 now exceeds** |
| Tactical instructions | Passing/pressing/tempo/possession/squeeze/corner | Passing/pressing/squeeze/tempo/possession/corner/defence | Both present |
| Conditional instructions | Time (15/30/45/60/75min) + state (GoalUp/Down/AllSquare) | Not explicit | **FM2026 has it** |
| Per-player roles | Role advancement multipliers | TacticalRole enum (11 roles) | Both present |
| Formation bank | Single active + conditional switching | Multiple saved formations (m_tacticbank) | Legacy slightly richer |
| Formation anchoring | 95% stickiness for players >40m from ball | Target-based movement | **FM2026 more precise** |
| Defensive line | Last Man tracking + hard depth constraints (CB -35m, FB -28m) | Not explicit | **FM2026 has it** |
| Key players | Captain (leadership multiplier), penalty taker by attribute | Captain, penalty/FK/corner takers | Both present |
| Elasticity | 3 phases (possession/out/transition) | Not explicit | FM2026 has it |
| Man-to-man marking | Flag-driven with relaxed lane discipline | Not explicit | **FM2026 has it** |
| Holdshape | Caps movement to 5m from formation position | Not explicit | **FM2026 has it** |
| Retrieval urgency | Sprint back when >5m from tactical target | Not explicit | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Multiple saved formations (`m_tacticbank[]`):** Legacy stores an array of complete formations. FM2026 has conditional instructions that change parameters but can't switch to an entirely different formation shape mid-match. However, conditional tactics partially compensate for this.

- **3 zones per player (tactic/pass/run):** FM2026 uses formation anchor + leash radius. Legacy's 3-zone system is more nuanced for off-ball movement (home, passing, running positions).

**Previously missing, now resolved:**
- ~~No formation discipline~~ — Dynamic anchoring + tactical squeeze + hard depth constraints. **FM2026 now exceeds legacy.**
- ~~No key player designations~~ — Captain system with leadership multiplier (0.75-1.25×). Penalty takers selected by attribute.
- ~~No squad compression~~ — Tactical squeeze (width 0.85-0.92, depth 0.80-0.90) when out of possession.
- ~~No marking system~~ — Man-to-man marking flag with relaxed lane discipline.
- ~~No holdshape~~ — Movement capped to 5m from formation position when flagged.

---

### 2.11 Stamina/Fatigue — **97%**

FM2026 exceeds legacy in this area. Dual model: permanent degradation (`condition²`) + activity-based drain. Post-match fitness drain formula: `minutes*0.08 + distanceKm*0.3 + actions*0.01` (cap 30). Injury mechanics include fatigue-based muscle tear and micro-damage. No significant gaps remaining.

---

### 2.12 Movement Physics — **95%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Speed calculation | 1.6-4.8 m/s from pace/accel | Pace attribute based | Both present |
| Sprint boost | 1.6× for 0.4s | Not explicit multiplier | FM2026 has it |
| Acceleration | 0.5-4.5 m/s² ramp | Not explicit ramp | FM2026 more detailed |
| Separation force | 3.5m radius, 0.4 weight | Not explicit | FM2026 has it |
| Formation spring | 0.12 × dt anchor pull | Target-based movement | Both present |
| Turning | Not explicit | TURN_SPEED_INT per tick | Legacy more explicit |
| Position clamping | ±52.5m × ±34m | ±GOALLINE × ±SIDELINE | Both present |
| Leash radius | GK:8, DEF:10, MID:12, FWD:14 | Not explicit | FM2026 has it |
| Hysteresis | 1.15 threshold for state switching | Not explicit | **FM2026 has it** |
| Organic idle | Sinusoidal breathing/scanning/shuffling sway | Not explicit | **FM2026 has it** |
| Retrieval urgency | Sprint back when >5m from tactical target | Not explicit | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Explicit turning mechanic:** Legacy has `TURN_SPEED_INT = ROTATION_SCALE` defining per-tick turn rate. FM2026 handles facing direction for first touch but doesn't model turning time as a constraint on movement. Minor gap — most noticeable for sharp direction changes.

---

### 2.13 Spatial Analysis — **96%**

FM2026 meets or exceeds legacy. Both use 18×15 grids. FM2026 adds attack success zone tracking, `findOpenPocket()` and `calculateGapRun()` in `aiSpace.js`, and heat map shot learning (threshold reduced in areas of previous attack success). No significant gaps.

---

### 2.14 Player States — **65%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Total states | 15 action states with locking/duration | 130+ | Gap reduced but still large |
| Basic states | 15 well-defined with state hysteresis | 7 basic | FM2026 now richer in basics |
| Trip/fall variants | Stumble timer (0.4s) | 10+ variants | Legacy deeper visual |
| Injury states | Fatigue-based muscle tear + micro-damage | injuredOnBack, injuredOnFront | Both present, different approach |
| Celebration | GOAL_CELEBRATION match phase | celebrate per-player state | Both present |
| Set piece states | Functional via shared states | 25+ dedicated states | Legacy deeper visual |
| GK states | Rush/claim/parry/catch/penalty distinction | 30+ dive/reaction variants | Legacy deeper visual |
| Tackle states | 6 tackle types | 4 variants | **FM2026 now exceeds** |
| Recovery states | Cooldown timers per tackle type | recoverFromBack, recoverFromFront | Both present |
| Dual stamina | Permanent degradation + activity drain | Simple stamina | **FM2026 exceeds** |

**What FM2026 is missing (remaining gaps):**

The state count gap remains the largest between engines (15 vs 130+), but much of legacy's state variety is animation-driven (visual states for a Unity client). For FM2026's headless server-side simulation:

- **Trip/fall visual variants** (10 types) — FM2026 uses functional timer-based lockouts. Different recovery per direction would add realism.
- **Receiving variants** (6 types) — FM2026 uses single RECEIVE state. Distinguishing header vs ground reception would improve.
- **Shooting phases** (3 types) — FM2026 uses single SHOOT state. Setup/shooting/completion phases would add tactical realism.
- **GK dive variants** (12 types) — FM2026 uses catch/parry/deflection. Adding directional dive types would improve for replay visualization.
- **Dedicated set piece states** (25+ types) — FM2026 reuses general states. Functionally adequate for headless but needed for visual replay.

**Context note:** FM2026's 15 action states with locking/duration achieve ~85% of the functional gameplay effects of legacy's 130+ states. The remaining gap is primarily visual/animation rather than simulation logic. If FM2026 adds a 3D match viewer, these become critical.

---

### 2.15 Match Statistics — **95%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Team stats | 15 categories | 5 categories | FM2026 richer |
| Player stats | 22 categories | 10+ | FM2026 richer |
| Performance rating | 30-100 scale (9 factors) via playerStatisticsController.js | 20+ weighted factor calculation | Legacy slightly deeper |
| Man of the Match | Auto-selected from ratings | Not explicit | **FM2026 has it** |
| Chemistry tracking | playerFeeds dictionary | Not explicit per-match | FM2026 has it |
| Distance tracking | Yes | Not per-match | FM2026 has it |
| Player form | Rolling 3-match average for 11 statistics | Not per-match | **FM2026 has it** |
| Confidence tracking | Dynamic initial + per-event updates | Not explicit per-match | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Performance rating depth:** FM2026's `playerStatisticsController.js` uses 9 factors (base 50 + passes/goals/assists/shots/tackles/saves - cards, clean sheet bonus, goal differential multiplier). Legacy uses 12+ weighted factors including interceptions, clearances, dribbles, crosses, aerial duels, key passes, and xG. FM2026 covers ~75% of legacy's rating granularity.

**Previously missing, now resolved:**
- ~~No performance rating~~ — New `playerStatisticsController.js` (72 lines) calculates 30-100 rating with MOTM selection.

---

### 2.16 Officials System — **35%**

FM2026 now has partial referee functionality:

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Referee blindness | Sight-based (85/100) foul miss chance | Positional visibility (100-point threshold) | FM2026 simpler but functional |
| Offside enforcement | Full detection with 5s window + 2nd-deepest defender line | Linesman flagging | FM2026 rule-based, legacy visual |
| Foul decisions | Context-based per tackle type + foul type | RegisterIncident() with type routing | Both present |
| Card presentation | Headless (data only) | Animated sequence states | Legacy visual |
| Referee position | Not simulated | Active entity with movement AI | **Legacy only** |
| Linesman | Not simulated | 2 assistant referees on touchlines | **Legacy only** |
| Injury time | +6s per card/injury event | Not explicit per-event | **FM2026 has it** |

**What FM2026 is missing (remaining gaps):**

- **Referee as physical entity:** Legacy simulates the referee with position, movement AI, and 15+ states. FM2026 handles referee decisions procedurally without a physical referee on the pitch.

- **Linesman system:** Legacy has 2 assistant referees tracking offside lines and signaling. FM2026 handles offside via rule-based detection (correct functionally but no linesman entity).

- **Full positional visibility:** Legacy's `SeeIncident()` uses actual referee position and angle for a 100-point visibility score. FM2026 uses simplified sight-based probability (85/100).

**Previously missing, now resolved:**
- ~~No foul detection intelligence~~ — Referee blindness system for minor fouls.
- ~~No offside~~ — Full offside enforcement with 5s window and 2nd-deepest defender line correction.

---

### 2.17 Collision System — **30%**

| Feature | FM2026 | Legacy | Gap |
|---------|--------|--------|-----|
| Goal detection | Ball crosses goal line between posts | Code 1 — Back of net | Both present |
| Boundary detection | Ball crosses touchline/goal line | Code 7 — Pitch boundary | Both present |
| Deflection physics | Elastic reflection in gameEngine.js | Full CollisionVelocity() | FM2026 partial |
| Post collision | Not present | Code 6 — angle-dependent rebound | **Legacy only** |
| Crossbar collision | Not present | Code 5 — height-dependent rebound | **Legacy only** |
| Side netting | Not present | Code 2 — energy absorption | **Legacy only** |
| Net roof | Not present | Codes 3/4 — dropping/rising variants | **Legacy only** |
| Body deflection | Basic via challenge system | Facing-angle based bounce | Legacy deeper |
| Collision predictor | Not present | CollisionPredictor() lookahead | **Legacy only** |

**What FM2026 is missing (remaining gaps):**

- **Post and crossbar collisions:** The most impactful gap. Legacy implements angle-dependent post rebounds (inside deflects toward goal, outside deflects wide) and height-dependent crossbar rebounds. FM2026 shots at post/bar height either go in or miss — no dramatic woodwork moments.

- **Collision predictor:** Legacy's `CollisionPredictor()` looks ahead in time to predict collisions precisely. FM2026 checks boundaries per-tick.

- **Side netting / net roof:** Visual-only collisions, low priority for headless simulation.

**Previously at 20%, now 30%:**
- Deflection physics added in `gameEngine.js` (elastic reflection for ball-player interactions).
- Ball trajectory prediction in `ballPrediction.js` partially compensates for collision prediction.

**Impact:** Post and crossbar remain the most important missing collision types — essential for realistic match simulation drama.

---

### 2.18 Replay/Recording — **100%**

FM2026 meets or exceeds legacy with more efficient delta compression. No gaps.

---

## 3. Priority-Ranked Gap Summary (Updated 13 Feb 2026)

### P0 — Critical (originally 3, now 0 remaining)

All original P0 gaps have been **RESOLVED**:
- ~~Collision system~~ → Deflection physics added, moved to P1 (post/crossbar still missing)
- ~~Foul type variety~~ → **RESOLVED** — 6 foul types (STANDARD, VIOLENT, PROFESSIONAL, HANDBALL, SIMULATION, VERBAL)
- ~~Tackle variety~~ → **RESOLVED** — 6 tackle types (BLOCK, BLOCK_HARD, SWIVEL, SWIVEL_HARD, SLIDE_SAFE, SLIDE_WILD)

### P1 — High (remaining gaps)

| # | Gap | What's Missing Specifically | Score | Est. Lines |
|---|-----|----------------------------|-------|------------|
| 1 | **Collision system** | Post rebound (inside/outside), crossbar rebound (top/bottom), collision predictor lookahead. Side netting and net roof are low priority. | 30% | 300-400 |
| 2 | **Curl/swerve physics** | `m_CurlVelocity` vector on all actions (not just FK), foot-side detection, `SPIN_FORCE_FACTOR` unused in ballPrediction.js | — | 200-300 |
| 3 | **Full referee visibility** | Referee as physical entity with position/movement AI, full 100-point visibility scoring, linesman entities on touchlines | 35% | 400-600 |

### P2 — Medium (polish items)

| # | Gap | What's Missing Specifically | Score | Est. Lines |
|---|-----|----------------------------|-------|------------|
| 4 | **Player state depth** | Trip/fall variants (10), receiving variants (6), shooting phases (3), GK dive variants (12). Mostly visual for headless engine. | 65% | 300-500 |
| 5 | **Decision intervals** | 0.35-0.75s vs legacy 0.87-1.53s — still 30-50% faster. Hysteresis helps but intervals remain shorter. | — | 50-100 |
| 6 | **Performance rating depth** | 9 factors vs legacy's 12+. Missing: interceptions, clearances, dribbles, crosses, aerial duels, key passes, xG | 95% | 100-150 |
| 7 | **Formation bank** | `m_tacticbank[]` array of saved formations switchable mid-match. Conditional tactics partially compensate. | 98% | 100-150 |
| 8 | **Set piece training** | 9 training types multiplying set piece quality in the engine. No training→match quality pipeline. | — | 200-300 |
| 9 | **Penalty shootout trigger** | Infrastructure exists but no match config flag to trigger automatically (needs cup integration). | — | 20-50 |
| 10 | **Ball spin prediction** | `SPIN_FORCE_FACTOR` exists in physicsConstants but ignored in ballPrediction.js | — | 50-100 |

### P3 — Low (cosmetic/minor)

| # | Gap | What's Missing Specifically | Score | Est. Lines |
|---|-----|----------------------------|-------|------------|
| 11 | **Commentary** | `CommentaryDataStream`, `MatchReportType` enum. FM2026 has AIAudit which partially serves this purpose. | — | 200-300 |
| 12 | **Kit clash** | RGB brightness comparison. Low priority. | — | 50-100 |
| 13 | **Turning mechanic** | Explicit per-tick turn rate. Players change direction more freely in FM2026. Minor realism gap. | — | 80-120 |
| 14 | **Per-formation feed targets** | `m_playerFeeds[4,11]` predefined passing targets. FM2026 builds chemistry organically. | — | 100-150 |
| 15 | **3 zones per player** | Tactic/pass/run zones. FM2026 uses anchor + leash which is less nuanced. | — | 150-200 |
| 16 | **Indirect free kicks** | Legacy distinguishes direct vs indirect. FM2026 only handles direct. | — | 50-100 |

### Grand Total Estimate: ~1,600-3,100 additional lines (down from 3,850-6,300)

---

## 4. Score Summary (Updated 13 Feb 2026)

| Area | Score | Change | Key Remaining Gaps |
|------|-------|--------|-------------------|
| Ball Physics | **93%** | +8 | Curl/swerve on all actions, foot-side detection |
| Player AI | **97%** | +17 | Decision interval still 30-50% faster than legacy |
| Passing | **95%** | +5 | Training bonuses, per-formation feed matrix |
| Shooting | **98%** | +13 | Curl on regular shots, penalty training bonus |
| Dribbling | **93%** | +13 | 360° per-degree scanning (zone-based approach effective) |
| Goalkeeper | **98%** | +13 | 12 dive animation variants (functional system excellent) |
| Tackling | **93%** | +33 | Shoulder charge, careless/reckless distinction |
| Fouls/Cards | **92%** | +37 | Full positional referee visibility |
| Set Pieces | **97%** | +27 | Indirect FK, training bonuses, shootout trigger |
| Formations | **98%** | +13 | Formation bank, 3 zones per player |
| Stamina | **97%** | +7 | FM2026 exceeds legacy (dual model) |
| Movement | **95%** | +10 | Explicit turning mechanic |
| Spatial Analysis | **96%** | +1 | FM2026 exceeds legacy |
| Off-ball Movement | **97%** | NEW | Communication, 5 run types, offside awareness |
| Pressing/Defending | **93%** | NEW | FM2026 exceeds legacy (urgency-based + captain) |
| Substitutions | **95%** | NEW | Auto-sub AI (injury/fatigue/tactical) |
| Player States | **65%** | +50 | Visual state variety (functional states adequate) |
| Statistics | **95%** | +5 | Performance rating depth (9 vs 12+ factors) |
| Officials | **35%** | +35 | Referee/linesman as physical entities |
| Collisions | **30%** | +10 | Post, crossbar, collision predictor |
| Replay/Debug | **100%** | — | FM2026 exceeds legacy (AIAudit, delta compression) |

### **Weighted Overall: 98%** (up from 72% on 6 Feb 2026)

---

---

## Assessment Update: 10 February 2026

### Changes Since Last Review (6 Feb 2026)

**13 new commits** pulled from FM2026 remote. 63 files changed, 1,723 additions, 452 deletions.

**Major structural changes:**
- **Deleted entire decision layer** (`decisions/gkDecision.js`, `passDecision.js`, `shotDecision.js`, `tackleDecision.js`, `gameEngineController.js`, `intentTypes.js`). AI now flows directly from `playerAIController` → AI modules → `playerEngine`. Cleaner architecture.
- **New file: `AIAudit.js`** — Records every AI decision with tick, player, action, reason, confidence, metadata. Saved to `_ai.json` files. Exceeds legacy (no equivalent).
- **New file: `aiConstants.js`** — Centralized 235-line constants file for all AI tuning parameters (SHOT, KICK, DRIBBLE, PASS, TACTICAL, POSSESSION).

### Match Engine Changes (25+ gaps closed)

| Feature | Previous | Now | Detail |
|---------|----------|-----|--------|
| **Captaincy/Leadership** | None | Full | Proximity-based 5% boost within 25m; attribute-derived leadership modifier (0.75x-1.25x) |
| **Penalty Shootout** | None | Full | 5-round + sudden death; taker selection by penalty attribute |
| **Defensive Wall** | None | Full | 2-5 players, 9.15m from ball, sized by distance/angle |
| **Corner Strategies** | Basic | 3 types | load/short_corner/safe; tallest players forced to near/far post |
| **Conditional Tactics** | None | Full | Time triggers (15/30/45/60/75min) + state triggers (GoalUp/Down/AllSquare) |
| **Referee Blindness** | None | Full | Sight-based (85/100) foul miss chance for minor fouls |
| **GK Reaction Delay** | None | Full | Attribute-based (agility/intelligence/confidence) + visibility blockers |
| **Sweeper Keeper** | None | Full | Flair-based sweep range (15 + flair/5) |
| **1v1 GK Charging** | None | Full | Braveness-based charge threshold (10-25m) |
| **Vision Cone (Pass)** | None | Full | Players with vision < 50 limited to 90° forward cone |
| **Pass Blocking Cone** | Basic | Full | Angle-based with 15° safety margin + dynamic for closer opponents |
| **Cutback Detection** | None | Full | 2.0-2.5x tactical bonus for cutback passes |
| **Shot Range Cap** | None | Full | Power-based: maxRange = 18 + (power/5) |
| **Heat Map Shot Learning** | None | Full | Shot threshold reduced in areas of previous attack success |
| **Communication (Ask for Ball)** | None | Full | HeatMap + position based "asking for ball" flag |
| **Smart Attacking Runs** | Basic | 5 types | Straight burst, half-space, diagonal in/out, far post |
| **Offside Awareness (Off-ball)** | None | Full | 2nd-deepest defender line correction |
| **Squeeze/Compression** | None | Full | Width (0.85-0.92) + depth (0.80-0.90) out-of-possession compression |
| **Man-to-Man Marking** | None | Full | Flag-driven with relaxed lane discipline |
| **Tactical Tackle Flags** | None | Full | stayonfeet (-60% foul, -6% win) / noprisoners (+120% foul, +12% win) |
| **Injury from Challenges** | None | Full | Physique + velocity + proneness; noprisoners = 1.6x damage |
| **Dynamic Initial Confidence** | None | Full | performance*0.5 + ability*0.3 + intelligence*0.2 (40-95 range) |
| **Post-Match Fitness Drain** | None | Full | minutes*0.08 + distanceKm*0.3 + actions*0.01 (cap 30) |
| **Formation Retrieval** | None | Full | Urgency-based sprint back when >5m from tactical target |
| **Organic Idle Movement** | None | Full | Sinusoidal breathing/scanning/shuffling sway |
| **Game State Awareness** | None | Full | Late-game, score-aware behavior in all AI modules |
| **Flair Impact** | None | Full | Flair > 60 boosts progressive passes and good shots |
| **Decisions Attribute** | None | Full | Reduces randomness in option selection for high-decisions players |

### Game Feature Changes

| Feature | Previous | Now | Detail |
|---------|----------|-----|--------|
| **Captaincy System** | None | Full | `squad_captain` in DB, flows through to match engine |
| **Match Replay Viewer** | None | Full | 2D Unity replay with tick interpolation, speed control, highlights |
| **Practice Match** | None | Full | Uses Practice booster, simulates next scheduled match |
| **Leadership Leaderboard** | None | Full | Players ranked by (aggression + intelligence) / 20 |
| **Player Form Tracking** | None | Full | Rolling 3-match average for 11 statistics |
| **League Promotion** | Partial | Full | Top 20% of clubs promoted each season |
| **Card Upgrade UI** | Basic | Full | Drag-and-drop with rarity filters, stat comparison |
| **Search System** | None | Full | Player/trainer name search with full stats |
| **NFT Marketplace** | Coded | Still disabled | Full sell/buy/cancel coded but NFTEnabled = false |

### Logic & Coherence Check

- AI architecture is now cleaner with decision layer removed
- AIAudit system enables systematic debugging and tuning
- Captaincy flows correctly from DB → API → match engine → stat boost
- Conditional tactics properly trigger formation/style changes mid-match
- Penalty shootout integrates cleanly with match flow controller

### Failings Identified

- **Player generation still rarity-blind** (BUG-005 unchanged)
- **Trainer generation still rarity-blind** (BUG-006 unchanged)
- **Financial economy still missing** — no match day income, no wages, no sponsorship
- **Cup competitions still empty stub** — `checkForStartCup()` is noop
- **Scout system still stub only** — `BoosterType.Scout` exists but no logic
- **PvP still framework only** — `MatchType.Pvp` exists but no matchmaking
- **NFT still disabled** — `Constants.NFTEnabled = false`
- **Coach upgrade bug persists** (BUG-003) — max-of-all scoring + tiny multipliers
- **Player upgrade still random stats** (BUG-001/BUG-002)
- **No relegation** — promotion exists but no demotion system

### Gap Status Update

| Gap | Previous | Current | Change |
|-----|----------|---------|--------|
| Match Engine overall | 90% | **95%** | +5% (25+ features added) |
| Full Game overall | 65% | **70%** | +5% (replay, captaincy, promotion, form tracking) |
| Captaincy/Leadership | MISSING | RESOLVED | New system |
| Penalty Shootout | MISSING | RESOLVED | Full implementation |
| Defensive Walls | MISSING | RESOLVED | Full implementation |
| Conditional Tactics | MISSING | RESOLVED | Full implementation |
| Referee System | 0% | 20% | Blindness only, no linesman/4th official |
| Set Pieces | 70% | 90% | Shootout + walls + corner strategies |
| Fouls/Cards | 55% | 75% | Tackle flags + injury system + referee blindness |
| GK AI | 80% | 92% | Reaction delay + sweeper + 1v1 charging |
| Off-ball AI | 75% | 92% | Communication + 5 run types + offside + squeeze + marking |
| Player generation | CRITICAL | CRITICAL | Unchanged (rarity-blind) |
| Financial economy | CRITICAL | CRITICAL | Unchanged (no revenue) |
| Cup competitions | MAJOR | MAJOR | Unchanged (empty stub) |

### Updated Score Table

| Category | Previous Score | Updated Score |
|----------|---------------|---------------|
| Ball Physics | 85% | 85% |
| Player AI Decision Making | 80% | 92% |
| Passing System | 90% | 95% |
| Shooting System | 88% | 93% |
| Dribbling System | 92% | 93% |
| Goalkeeper AI | 80% | 92% |
| Off-ball Movement | 75% | 92% |
| Pressing/Defending | 85% | 90% |
| Tackling/Challenges | 70% | 85% |
| Fouls/Cards | 55% | 75% |
| Set Pieces | 70% | 90% |
| Formations/Tactics | 85% | 93% |
| Stamina/Fitness | 90% | 95% |
| Movement | 85% | 90% |
| Spatial Analysis | 95% | 95% |
| Player States | 15% | 15% |
| Statistics | 90% | 92% |
| Officials | 0% | 20% |
| Collisions | 20% | 20% |
| Replay/Debug | 100% | 100% |

### **Weighted Overall Match Engine: 90% → 95%**

*Note: Player states (15%) and collisions (20%) remain low but are less impactful for a headless server-side engine where visual animation states aren't needed.*

---

---

## Assessment Update: 10 February 2026 (third assessment)

### Changes Since Last Review
2 new commits (f45af9f6, 95f60003), 31 files changed (+1305/-385). **No match engine changes** — both commits are game feature additions (practice match, marketplace improvements).

### Logic & Coherence Check — Scoring Rate-Limiter Analysis
Deep investigation into why FM2026 produces scores like 9-34 and 24-19 while Legacy produces realistic 1-3 goals per team. Root causes identified and added to comparison tool as cmp-034 through cmp-038:

**P0 Issues (primary causes of unrealistic scoring):**
1. **Goal pause too short** (cmp-034): 2 seconds flat vs Legacy's 3.9-5.3s multi-phase system (goalAwarded→celebration→kickoff→blown→inPlay). No context-aware delay (winning team should waste time).
2. **Shot thresholds too permissive** (cmp-035): THRESHOLD_CLOSE=0.34, THRESHOLD_DISTANT=0.48. Any attacker within 25m with a reasonable angle easily exceeds 0.34. Legacy has 6+ layered gates (distance, angle, pressure, facing, weak foot, vision) making shots the exception not the rule. FM2026: ~90-200 shots/team/match. Legacy: ~10-15.
3. **Decision interval too fast** (cmp-036): Players decide every 0.25-0.65s vs Legacy's 0.87-1.53s. Post-shot cooldown only 0.5s (identical to pass). Legacy has action-type-specific cooldowns: shot lock 0.93-1.33s, dribble decision lock 1.33s, keeper holding 1.6-4.0s, NoTouchStamp 0.13-1.28s.
4. **Duplicate call bugs** (cmp-038): handleBallOut() called twice (line 241-242) and queueRestart() called twice (lines 490-496) in matchFlowController.js. Copy-paste errors causing double-processing of every ball-out event.

**P1 Issues (secondary contributors):**
5. **No possession transition delay** (cmp-037): Legacy freezes tactical cache for ~0.93s after turnover. FM2026 has instant counter-attacks.
6. **No formation recalculation throttle**: Legacy updates team shape every 0.68s. FM2026 recalculates every tick (20Hz).

### Quantified Impact
| Factor | FM2026 | Legacy |
|--------|--------|--------|
| Ticks per match | 108,000 | Event-driven (~50,000 equivalent) |
| Decisions per player per match | 8,300-21,600 | 4,000-8,000 |
| Shot threshold | 0.34 (trivial) | 6-gate filter (hard) |
| Goal dead time | 2s | 3.9-5.3s |
| Shots per team per match | ~90-200 | ~10-15 |
| Expected goals per team | 14-50 | 1-3 |

### Failings Identified
- BUG-007 still present: practice booster cards not consumed (useBooster commented out in matchesService.js lines 320, 323-324, 334)
- Match details were missing from database — now fixed by commit 95f60003
- Club parameter type mismatch in matchesService.js — now fixed by commit 95f60003

### Improvement Summary
| Area | Before | After |
|------|--------|-------|
| Practice match | UI only | Full backend + frontend flow |
| Match details | Missing from DB | Per-player stats saved and returned |
| Marketplace structure | Flat array | Categorized by type (boosters/badges/kits/players/trainers) |
| NFT queries | Missing type field | All queries include type |
| Comparison tool | 33 entries | 38 entries (5 new scoring/rate-limiter entries) |

### Gap Status Update
**Match Engine: 96% (unchanged)** — no engine code changed in this pull.
**Game Features: 72% (+1%)** — practice match backend complete, match details fixed, marketplace improved.
**Full Game: 84% (+1%)** — marginal improvement from game feature polish.

---

## Assessment Update: 11 February 2026

### Changes Since Last Review
18 commits (f45af9f6..02b5668e), 57 files changed (+1,918/-352 lines). **Massive match engine update** — largest single pull since the project began. Includes 2 brand-new files and significant rewrites across 12+ match engine modules. Also includes NFT enablement and marketplace improvements.

**New Files:**
- `ballPrediction.js` (131 lines) — Ball trajectory prediction with intercept calculation
- `playerStatisticsController.js` (72 lines) — Performance rating system (30-100 scale)

**Major Rewrites (50+ lines changed each):**
- `challengeController.js` — 6 tackle types, 6 foul types, tactical modifiers
- `aiKeeper.js` — High ball claiming, reaction delay, 1v1 charging, penalty saves
- `aiShot.js` — 6-gate shot filter (vision, pressure, weak foot, facing), chip shots, GK-aware aiming
- `supportController.js` — Formation anchoring, tactical squeeze, defensive line, gap runs
- `gameEngine.js` — Tactical cache transition lag, offside enforcement, deflection physics
- `matchFlowController.js` — Penalty shootout, corner specialists, wall formation
- `eventController.js` — Second yellow→red, confidence tracking, spatial metrics
- `playerAIController.js` — Game state context, captain leadership, loose ball chase control
- `playerStateController.js` — 15 action states, state hysteresis, dual stamina model
- `matchMain.js` — Deterministic player sorting, captain system, injury time

### Logic & Coherence Check

**Scoring Rate-Limiter Fixes (cmp-034 through cmp-038):**
All five P0 issues from previous assessment have been addressed:

| ID | Issue | Previous | Now | Status |
|----|-------|----------|-----|--------|
| cmp-034 | Goal pause too short | 2s flat | 5.0s + context ±2s | **FIXED** |
| cmp-035 | Shot thresholds too low | 0.34/0.48 | 0.55/0.70 + 6 gates | **FIXED** |
| cmp-036 | Decision intervals too fast | 0.25-0.5s flat | 0.35-0.75s vision-based + 600ms hysteresis | **IMPROVED** |
| cmp-037 | No transition delay | Instant | 0.9s tactical cache freeze | **FIXED** |
| cmp-038 | Duplicate call bugs | handleBallOut ×2, queueRestart ×2 | Both duplicates removed | **FIXED** |

Shot AI now mirrors legacy's multi-gate approach: distance → vision roll → pressure proximity → weak foot penalty → facing angle gate → threshold check. Expected shot volume should drop from ~90-200/team/match to ~15-30 (closer to legacy's 10-15).

**Formation Discipline (previously P0):**
The back-four drift issue is comprehensively addressed:
- Defensive line calculation with Last Man tracking
- Formation anchoring: 95% stickiness for players >40m from ball
- Tactical squeeze: width 0.85-0.92, depth 0.80-0.90 when out of possession
- Hard depth constraints: CB min -35m, FB/WB min -28m
- Retrieval urgency system prevents drift during counter-attacks
- Holdshape enforcement caps movement to 5m from formation position
- **FM2026 now exceeds legacy** in formation discipline (legacy uses 6×5 grid interpolation; FM2026 has dynamic anchoring + compression + hard constraints)

**Ball Prediction (previously P0 gap):**
New `ballPrediction.js` provides three core functions: trajectory prediction, height-crossing detection, and intercept point calculation. Uses realistic physics (gravity -9.81, quadratic drag, bounce damping). Covers ~85-90% of legacy's Ball.cs prediction capability. Missing: spin/Magnus effect integration, collision prediction with players, next-bounce prediction.

**Tackle/Foul System (previously P0 gap):**
6 tackle types (BLOCK, BLOCK_HARD, SWIVEL, SWIVEL_HARD, SLIDE_SAFE, SLIDE_WILD) selected by approach angle + aggression. 6 foul types (STANDARD, VIOLENT, PROFESSIONAL, HANDBALL, SIMULATION, VERBAL). Missing: shoulder charge variant, careless vs reckless distinction, DOGSO as separate category.

**Card System (previously P0 gap — 2nd yellow):**
Second yellow → red now handled in `eventController.js`. Player card count tracked per match. `isSecondYellow` flag emitted for UI. Red card triggers immediate ejection (`onPitch = false`, `isEjected = true`, role = "SENT_OFF"). +6s injury time per card.

**Goalkeeper AI (major upgrade):**
- High ball claiming with trajectory prediction (sprint to intercept lobs)
- Shot reaction delay: 0.15-0.4s based on agility/intelligence/confidence + blocked sight penalty
- 1v1 charging based on flair/aggression/confidence (10-25m threshold)
- Penalty save intent with direction guessing (anticipation-based)
- Catch vs parry vs deflection distinction with elastic reflection physics
- Chip shot defense awareness

**Penalty Shootout System (NEW):**
Full implementation in matchFlowController: 5-round format with sudden death, penalty taker selection by attribute, round/turn/score tracking, history recording. Legacy has full shootout; FM2026 now matches ~85% (missing: training modifier for GK, penalties flag in match config for triggering).

**Performance Rating (previously P0 gap):**
New `playerStatisticsController.js` calculates 30-100 rating. Base 50 + passes/goals/assists/shots/tackles/saves - cards. Clean sheet bonus for defensive players. Goal differential multiplier. Man of the Match selection. ~50% of legacy's granularity (legacy tracks 12+ event types vs FM2026's 9; legacy has role-weighted tackles and cross tracking).

### Failings Identified

1. **BUG-005/006 unchanged** — Player and trainer generation still rarity-blind
2. **BUG-007 unchanged** — Practice booster cards not consumed (useBooster still commented out)
3. **BUG-008 partially fixed** — Backend `sell()` now takes price parameter, but client still hard-codes 0.25 SOL in CardItem.cs
4. **No spin in ball prediction** — `SPIN_FORCE_FACTOR` exists in physicsConstants but ballPrediction.js ignores it
5. **Performance rating missing stats** — No interceptions, clearances, dribbles, crosses, aerial duels, key passes, xG
6. **Penalty shootout not triggerable** — Infrastructure exists but no match configuration flag triggers it
7. **activeSub flag never cleared** — matchMain.js uses 300s safety break as band-aid
8. **Solana keypair in repo** — `solana-devnet-keypair.json` hardcoded path (security risk)
9. **No mainnet support** — NFT operations hardcoded to devnet

### Improvement Summary

| Area | Before | After |
|------|--------|-------|
| Ball Prediction | None (P0 gap) | Full trajectory/intercept/height system |
| Shot Filtering | 2 thresholds (0.34/0.48) | 6-gate filter + raised thresholds (0.55/0.70) |
| Goal Pause | 2s flat | 5.0s + context-aware ±2s |
| Duplicate Bugs | handleBallOut ×2, queueRestart ×2 | Both fixed |
| Transition Delay | Instant counter-attacks | 0.9s tactical cache freeze |
| Tackle System | Basic challenge | 6 tackle types by angle/aggression |
| Foul System | Basic foul check | 6 foul types with context |
| Card System | No 2nd yellow | Full 2nd yellow→red + ejection |
| Corner Positioning | Generic | Specialist placement (tallest to posts) |
| Wall Formation | None | 9.15m perpendicular wall, 2-5 players |
| Formation Discipline | Drifting defenders | Anchoring + squeeze + hard constraints |
| Goalkeeper AI | Basic positioning | Reaction delay, 1v1, penalty saves, high ball |
| Penalty Shootout | None | Full 5-round + sudden death |
| Performance Rating | None (P0 gap) | 30-100 rating, MOTM selection |
| Decision Cooldowns | 0.25-0.5s flat | Vision/composure-based + 600ms hysteresis |
| Player States | None | 15 action states with locking/duration |
| Stamina Model | Single drain | Dual permanent degradation + activity |
| Offside | No enforcement | Full detection with 5s window |
| NFT Operations | Fully coded, disabled | Enabled on Solana devnet |
| Marketplace | Price hard-coded | Backend accepts price parameter |
| Captaincy | None | Leadership multiplier 0.75-1.25× on AI |
| Game State Awareness | None | Score diff, match stage, protect/chase |

### Gap Status Update

**Previously P0 — Now Resolved/Improved:**
- ~~Ball trajectory prediction~~ → RESOLVED (ballPrediction.js)
- ~~Tackling variants~~ → RESOLVED (6 types)
- ~~Foul types~~ → RESOLVED (6 types)
- ~~Card system (2nd yellow)~~ → RESOLVED (eventController)
- ~~Corner positioning~~ → RESOLVED (specialist placement)
- ~~Performance rating~~ → RESOLVED (playerStatisticsController)
- ~~Formation discipline~~ → RESOLVED (exceeds legacy)
- ~~Scoring rate-limiters~~ → MOSTLY FIXED (4/5 fully fixed, 1/5 improved)

**Remaining Gaps:**

| Gap | Score | Priority | Notes |
|-----|-------|----------|-------|
| Player generation rarity-blind | 30% | P0 | BUG-005/006 unchanged |
| Financial economy | 15% | P0 | No revenue model |
| Cup competitions | 0% | P1 | Empty stub |
| Scout system | 5% | P1 | Stub only |
| PvP | 10% | P1 | Framework only |
| Collisions (post/crossbar) | 30% | P1 | Deflection physics added but no posts |
| Officials (linesman) | 35% | P2 | Offside enforcement but no linesman |
| Ball spin prediction | — | P2 | Constants exist but unused in prediction |
| Decision intervals still fast | — | P2 | 0.35-0.75s vs legacy 0.87-1.53s |

**Match Engine: 96% → 98%** — Massive improvements across all subsystems. Every P0 gap addressed.
**Game Features: 72% → 75%** — NFT enabled, marketplace improved, UI polish.
**Full Game: 84% → 87%** — Largest single-pull improvement (+3%).

---

## Assessment Update: 13 February 2026

### Changes Since Last Review

**10 commits** (12-13 Feb), **148 files changed** (+4,738/-8,207 lines). Mix of match engine refinement and massive game feature/bug-fix overhaul.

**Commits:**
- `02c646bb` — New stats balance for players/trainers, rarity upgrades, email sub-types, backup script, migration updates, AI club fixes, NFT metadata
- `c272b726` — League graph fix
- `b8a48cbb` — Web3 validation improvements
- `15393081` — Packs without NFT, cards without NFT, role-priority upgrades, kit fixes, free pack, new emails, general improvements
- `9c1bca3b` — API fixes for transfer emails
- `8f27b1a7` — Player cards UI
- `213d2cea` — AI and match engine tuning
- `9dd4f8df` — Player card UI update
- `348fb923` — Visual update of all cards, remove AI logs from match data
- `eb8b893a` — Number fix update

### Logic & Coherence Check

**Match Engine (10 files, refinement focus):**

1. **Goalkeeper AI** (`aiKeeper.js`, 68 lines) — More conservative behavior:
   - Sweep radius reduced: `12 + (agility/100)*6` → `10 + (agility/100)*5`
   - Opponent proximity check before rushing (`canWinComfortably = distToBall < (oppDistToBall - 2.5)`)
   - Charge threshold narrowed: 10-25m → 8-18m
   - Braveness weights reduced: flair/aggression 0.4→0.3
   - Wide ball awareness: non-central threats reduce advance 40%, very wide 50%
   - Near-post shift increased ±0.5m → ±1.5m for wide threats
   - Rushing GK gets 2.8m catch radius (vs 2.2m standard)
   - Faster shots (>18 m/s) force parries instead of catches

2. **Ball Physics** (`ballEngine.js`, 22 lines) — Stability fixes:
   - Set-piece restart snap prevention (skips instant snapping on restarts)
   - Dynamic closure rate: normal 10 m/s, restart 1 m/s, close 5 m/s
   - Division-by-zero guard (`gap > 0.01`)
   - Throw-in ball argument fix (passes ball object, not taker position)
   - Dribble speed boost: base +2.5→+4.5, floor 4.5→5.5 m/s

3. **Shot AI** (`aiShot.js`, 9 lines) — Attribute-driven shooting:
   - Shot power: `30 + (player.power / 100) * 5` (range 30-35 m/s)
   - Distance-based loft: >20m = 4.5, <20m = 2.5
   - Panic clearance: explicit power 32.0, loft 8.0
   - Close-range shooting boost: progressive 1.0-2.5× within 25m of goal

4. **Player AI** (`playerAIController.js`, 20 lines) — Decision stability:
   - Hysteresis 1.15 for off-ball state switching (prevents jitter)
   - Flair bonus: up to +10% on adventurous passes/shots for high-flair players

5. **Intent System** (`playerEngine.js`, 8 lines) — Parameter priority:
   - Top-level `intent.power/loft` now checked before `intent.meta.speed/loft`
   - Pass/shot meta now includes power/loft values for debugging

6. **Set Pieces** (`matchFlowController.js`, 8 lines) — Boundary fix:
   - Restart taker position clamped to field with 0.1m margin
   - Prevents ball snapping to out-of-bounds during possession updates

7. **Data Fixes** (`matchMain.js`, `matchesRunner.js`) — `.number` → `.shirt_number`, AI audit logging removed from results

**Game Features (major overhaul):**

8. **Rarity System** (`model.js`, 468 lines changed) — Complete rewrite:
   - New `RarityStatsBonus` table: Free (0.8×+1), Regular (1.0×+1-10), Rare (1.2×+20-30), Epic (1.4×+40-50), Legendary (1.6×+65-70)
   - `processRoleDefaultStats(rarity)` now accepts and applies rarity parameter for both Players and Trainers
   - Dynamic rarity calculation via `getQualityFromScore()` — rarity derived from ability score post-generation
   - Player stat defaults changed from 0 to 1 (prevents division-by-zero)
   - Stat ranges rebalanced from 60-95 to 8-18 base with rarity multipliers
   - Trainer `abilityScore()` changed from max-of-all to average-of-3 role-specific stats
   - 12 new `EmailSubType` values for transfer, upgrade, pack reward, PvP notifications
   - `CardsPack` model with create/load/formMetadata/mapData

9. **Upgrade System** (`upgradesService.js`, 141 lines changed) — Role-priority:
   - `upgradeInternal()` shared method for players and trainers
   - `rolePriorityStats` mapping: 10 player roles × 3 priority stats, 2 trainer roles × 3 priority stats
   - Priority pool shuffled separately, placed first in weighted list
   - Stars/star_percent recalculated after every upgrade (lines 261-271)
   - Rarity recalculated after upgrade — if changed, NFT metadata updated on-chain
   - Sacrifice mechanic: 30% of stat difference transferable as bonus multiplier

10. **Pack System** (`cardsService.js`, `nftService.js`, `squadService.js`) — NFT-optional:
    - `withNFT` parameter on createPlayer/createTrainer/createBooster/createKit/createBadge
    - Free packs: Pack ID 4 (visible, 5/5/10/5/5) and Pack ID 1000 (hidden reward, 3/3/3/2/2)
    - `rewardWithCardsPack()` creates packs without NFT minting
    - Practice booster now consumed via `useBooster()` in `practiceMatch()`
    - 7,595 lines of hardcoded `kits.json` deleted (moved to DB/generation)

### Failings Identified

1. **BUG-008 still partially open** — Marketplace sell price still hard-coded 0.25 SOL on client side (`CardItem.cs:114`). Backend accepts price parameter but client doesn't expose UI for custom pricing.

2. **mapUpdateData() gaps** — Neither Player nor Trainer `mapUpdateData()` includes `stars`, `star_percent`, or `rarity`. These are recalculated on `load()` so functionally correct, but not persisted on update — minor data consistency issue.

3. **Financial economy unchanged** — Still no match day income, wages, sponsorship, or revenue model. Only remaining P0 gap.

4. **Cup/Scout/PvP unchanged** — All still stubs.

### Improvement Summary

| Area | Before | After | Change |
|------|--------|-------|--------|
| BUG-001: Player upgrade random stats | Open | **FIXED** | Role-priority mapping |
| BUG-002: Stars not recalculated | Open | **FIXED** | getStars/getStarPercent called |
| BUG-003: Coach upgrade invisible | Open | **FIXED** | abilityScore avg-of-3, not max-of-all |
| BUG-004: Coach upgrade random stats | Open | **FIXED** | Trainer role-priority mapping |
| BUG-005: Player gen rarity-blind | Open | **FIXED** | RarityStatsBonus multiplier system |
| BUG-006: Trainer gen rarity-blind | Open | **FIXED** | Same RarityStatsBonus system |
| BUG-007: Practice booster not consumed | Open | **FIXED** | useBooster() in practiceMatch() |
| GK positioning | Good | Better | Conservative sweep/charge, wide ball aware |
| Ball physics | Good | Better | Restart snap fix, dribble boost, closure rate |
| Shot AI | Good | Better | Attribute-driven power, distance loft |
| Decision stability | Good | Better | Hysteresis 1.15, flair bonus |
| Pack system | NFT-only | NFT-optional | Free packs, withNFT parameter |
| Email system | Basic | Expanded | 12 sub-types |
| Card UI | Basic | Enhanced | Rarity visuals, new fonts, redesigned cards |

### Gap Status Update

**Previously P0 — Now Resolved:**
- ~~Player generation rarity-blind~~ → **FIXED** (RarityStatsBonus: Free 0.8×, Regular 1.0×, Rare 1.2×, Epic 1.4×, Legendary 1.6×)
- ~~Trainer generation rarity-blind~~ → **FIXED** (same system)
- ~~Upgrade bugs (BUG-001-004)~~ → **ALL FIXED** (role-priority + star recalc + trainer abilityScore)
- ~~Practice booster not consumed~~ → **FIXED** (useBooster called)

**Remaining Gaps:**

| Gap | Score | Priority | Notes |
|-----|-------|----------|-------|
| Financial economy | 15% | **P0** | **ONLY remaining P0** — no revenue model |
| Cup competitions | 0% | P1 | Empty stub |
| Scout system | 5% | P1 | Stub only |
| PvP | 10% | P1 | Framework only |
| Collisions (post/crossbar) | 30% | P1 | Deflection physics but no posts |
| Officials (linesman) | 35% | P2 | Offside enforcement but no linesman |
| Ball spin prediction | — | P2 | Constants exist but unused in prediction |
| Decision intervals still fast | — | P2 | 0.35-0.75s vs legacy 0.87-1.53s |
| Marketplace price (client) | — | P2 | BUG-008 partially fixed |

**Match Engine: 98% → 98%** — Refinement and tuning, no new feature categories. GK more conservative, ball physics more stable, shooting more attribute-aware.
**Game Features: 75% → 79%** — 7 bugs fixed, rarity system overhauled, pack system made NFT-optional. Massive quality improvement.
**Full Game: 87% → 89%** — Strongest game features pull yet.

---

## Assessment Update: 14 February 2026

### Changes Since Last Review

2 commits since 13 Feb 2026 (25 files changed):
1. **348fb923** — Visual update of all cards (client UI), removed `aiRecords` from match replay data output (performance improvement, no engine logic change)
2. **eb8b893a** — Field rename: `.number` → `.shirt_number` across matchMain.js and matchesRunner.js (data mapping fix, no engine logic change)

**No match engine logic changes. No scoring balance fixes.**

### Logic & Coherence Check

**CRITICAL FINDING: Unrealistic Scorelines (17-32)**

Deep investigation into why the engine produces absurd scorelines revealed **6 compounding root causes** that create a feedback loop:

1. **Shot Score Multiplier Stacking (P0, cmp-048):** aiShot.js applies 2x at <16m and 2x at <10m (cumulative 4x). playerAIController.js adds another ~2x distance boost. Combined: **~8x score multiplier** inside the box. A mediocre base score of 0.07 becomes 0.58, clearing the 0.55 close threshold. Every player near the goal shoots on every decision cycle (~1s).

2. **GK Parry Pinball Effect (P0, cmp-050):** Catch probability is ~5% for average shots (speedPenalty=0.60 overwhelms catchChance=0.34). 95% of saves become parries that drop the ball 2-5m from goal. Another attacker picks it up and shoots immediately → shot-parry-shot-goal loops.

3. **GK Height Gate (P0, cmp-049):** `_checkBallPickup()` requires `ball.height <= 1.1m`. Crossbar is at 2.44m. Shots between 1.1-2.44m bypass the save system entirely. The keeperAction.js code handles heights up to 2.6m but is never called.

4. **Shot Accuracy Too Generous (P1, cmp-051):** ACTUAL_TARGET_CLAMP_Y = 4.5m (posts at 3.66m) — shots can only miss wide by 0.84m. Legacy uses 5x inaccuracy multiplier with no clamping.

5. **No Pass-vs-Shoot Intelligence (P1, cmp-052):** No Vision-based gate to prefer passing to a better-placed teammate. Legacy quarters the shooting range if a teammate is better placed.

6. **Foul Base Rate Inflated (P1, cmp-012 reopened):** 0.35 base (should be 0.05 per code comment "temporarily boosted"). 7x more fouls → excessive free kicks/penalties.

### Failings Identified

| ID | Severity | Issue | Root Cause |
|----|----------|-------|------------|
| cmp-048 | P0 | 8x shot multiplier stacking | Double-boost from aiShot.js + playerAIController.js |
| cmp-049 | P0 | GK can't save shots above 1.1m | Height check in _checkBallPickup() |
| cmp-050 | P0 | 95% parry rate = pinball loop | Speed penalty on catch too severe |
| cmp-051 | P1 | Shots can't miss wide | 4.5m clamp too tight, no 5x error multiplier |
| cmp-052 | P1 | Players always shoot over pass | No Vision-based teammate preference |
| cmp-012 | P1 | Foul rate 7x too high | 0.05→0.35 "temporary" boost never reverted |
| cmp-044 | P0 | Shot thresholds insufficient | 0.55/0.70 too low given multiplier stacking |
| cmp-045 | P0 | Decision cooldowns too fast | 0.5s uniform vs legacy's 0.87-1.53s action-specific |

### Improvement Summary

| Area | Before | After | Change |
|------|--------|-------|--------|
| Shooting System | 98% | 75% | -23% (multiplier stacking + accuracy clamping) |
| Goalkeeper System | 98% | 70% | -28% (height gate + parry rate) |
| Fouls/Cards | 92% | 85% | -7% (foul rate regression) |
| Player AI | 97% | 93% | -4% (no pass-vs-shoot intelligence) |
| **Overall Match Engine** | **98%** | **90%** | **-8%** (features exist but balance is broken) |
| Game Features | 79% | 79% | — (no game feature changes) |
| **Full Game** | **89%** | **85%** | **-4%** |

> **Note:** The score reduction reflects BALANCE quality, not feature presence. All features exist — they just produce unrealistic results. Applying the 6 identified fixes would restore scores to 98%+.

### Gap Status Update

**NEW P0 Gaps (scoring realism):**
- Shot multiplier stacking (cmp-048) — 8x compound boost
- GK height coverage (cmp-049) — 1.1m limit
- GK parry pinball (cmp-050) — 95% parry rate
- Shot thresholds (cmp-044 reopened) — too low given multipliers

**REOPENED Gaps:**
- Foul base rate (cmp-012) — 0.35 should be 0.05
- Shot thresholds (cmp-044) — 0.55/0.70 insufficient

**Unchanged:**
- Financial economy — **still the only structural P0**
- Cup competitions — empty stub
- Scout system — stub only
- PvP — framework only

**Match Engine: 98% → 90%** — Significant balance regression identified. All features present but 6 compounding issues produce 17-32 scorelines. Fix priority: multipliers (#1) + GK parry rate (#2) + GK height gate (#3) together will have the biggest impact.
**Game Features: 79% → 79%** — No changes (only cosmetic commits).
**Full Game: 89% → 85%** — Reduced by match engine balance regression.

*End of Detailed Match Engine Comparison*
