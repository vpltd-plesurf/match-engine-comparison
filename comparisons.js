// Auto-generated from comparisons.json
window.COMPARISONS_DATA = [
  {
    "id": "_metadata",
    "type": "metadata",
    "lastAssessment": "2026-02-14",
    "weighted": {
      "matchEngine": 90,
      "gameFeature": 79,
      "fullGame": 85
    },
    "assessmentHistory": [
      { "date": "2026-01-xx", "matchEngine": 45, "gameFeature": null, "fullGame": null },
      { "date": "2026-02-04", "matchEngine": 78, "gameFeature": null, "fullGame": null },
      { "date": "2026-02-06", "matchEngine": 85, "gameFeature": 58, "fullGame": 72 },
      { "date": "2026-02-06b", "matchEngine": 90, "gameFeature": 65, "fullGame": 78 },
      { "date": "2026-02-10", "matchEngine": 95, "gameFeature": 70, "fullGame": 82 },
      { "date": "2026-02-10b", "matchEngine": 96, "gameFeature": 71, "fullGame": 83 },
      { "date": "2026-02-10c", "matchEngine": 96, "gameFeature": 72, "fullGame": 84 },
      { "date": "2026-02-11", "matchEngine": 98, "gameFeature": 75, "fullGame": 87 },
      { "date": "2026-02-13", "matchEngine": 98, "gameFeature": 79, "fullGame": 89 },
      { "date": "2026-02-14", "matchEngine": 90, "gameFeature": 79, "fullGame": 85, "note": "Balance regression: 17-32 scorelines diagnosed. 6 compounding issues identified." }
    ]
  },
  {
    "id": "cmp-001-ball-curl",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Ball Curl / Swerve Physics",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Magnus force model with perpendicular velocity vectors. Spin stored as ball.cvy (lateral) and ball.cvx (topspin). Curl force: spinFactor * (speed / 15.0) applied perpendicular to velocity direction. Topspin calculated from technique stat (>65). Spin dampens 95% per bounce (SPIN_DAMPING_GROUND=0.95). Constants: SPIN_FORCE_FACTOR=0.8, AIR_DRAG_COEFF=0.015.",
    "fm2026Files": [
      "ballEngine.js:469-480",
      "ballEngine.js:200-205",
      "physicsConstants.js:6-22"
    ],
    "legacyDetails": "Polynomial equation-based curl. Curl stored as m_CurlVelocity (IntVector3). Formula: equation = 1 + (((v*v) * 0.5f) - (v * 1.5f)). Applied as: posx += (int)(equation * (pCVel.x * 0.003f)). Curl zeroed after bounce. Fixed curl divisor of 65. Constants: AIR_FRICTION=0.0002, curlamount=65.",
    "legacyFiles": [
      "Ball.cs:195-202",
      "Ball.cs:927-1026",
      "Ball.cs:282-287"
    ],
    "gapAnalysis": "Different approaches: FM2026 uses physics-based Magnus force (simpler, more realistic), Legacy uses polynomial frame-dependent calculation (more complex, less physical). FM2026 adds topspin/backspin (Legacy has no vertical curl). FM2026 curl scales dynamically with ball speed; Legacy uses fixed divisor. FM2026 retains 95% spin per bounce; Legacy zeroes spin entirely on bounce.\n\nFM2026 is arguably MORE realistic here. Not a gap per se \u2014 different but valid approach.",
    "codeSuggestions": "No fix needed \u2014 FM2026's curl model is physically more accurate than Legacy's polynomial approach. However, if you want Legacy's more dramatic curl effect, you could increase SPIN_FORCE_FACTOR from 0.8 to 1.2 or add a polynomial curl component alongside the Magnus force.",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-002-ball-collision",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Ball Collision System (Post / Bar / Net)",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Post collision: 4 posts with FIFA geometry (52.5m, \u00b13.66m). Distance-based detection (BALL_RADIUS 0.11 + POST_RADIUS 0.06 = 0.17m). Vector reflection with restitution=0.6. Crossbar: 3 modes (under 50% bounce, over 70% bounce, face 40% reflection). Net: inside-goal zone detection with heavy damping (NET_DAMPING=12.0) and gravity assist. Emits BALL_COLLISION events.",
    "fm2026Files": [
      "ballEngine.js:549-572",
      "ballEngine.js:574-599",
      "ballEngine.js:601-612"
    ],
    "legacyDetails": "Post collision: stamped debounce (200 frames). Angle-based deflection with deflectiondiff normalized to HALF_BALL_SIZE. X velocity reduced by factor z, Y/Z halved. Crossbar: height-based deflection, upper/lower bar calculations. Netting: back net 95% X cull, side net 75% Z cull, top net variants. Uses p=1-6 collision type identifiers.",
    "legacyFiles": [
      "Ball.cs:846-878",
      "Ball.cs:802-845",
      "Ball.cs:748-778"
    ],
    "gapAnalysis": "FM2026 has modern physics-based collision (vector reflection, restitution coefficient). Legacy uses angle-based reduction with arbitrary multipliers. FM2026 adds explicit net damping zone (Legacy has separate net collision types). FM2026 uses continuous collision detection; Legacy uses stamped debounce.\n\nFM2026 is MORE COMPLETE here \u2014 it has post, crossbar, AND net detection. Legacy has more granular net collision types (back/side/top separately) but FM2026's approach is cleaner.",
    "codeSuggestions": "Consider adding separate net collision zones (back net vs side net vs top net) for more realistic ball behavior in the net, similar to Legacy's p=1,2,3,4 system. Currently FM2026 treats the entire goal zone with uniform damping.",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-003-ball-trajectory",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Ball Trajectory Prediction",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "[RESOLVED 11 Feb] New ballPrediction.js (131 lines) with 3 static methods: predictPosition(ball, futureTime, dt=0.05) — full Euler simulation with gravity -9.81, quadratic air drag, bounce damping 0.65, ground decel 6.5. timeToReachHeight(ball, targetHeight, maxTime=3.0) — binary search (15 iterations). findInterceptPoint(ball, playerPos, playerSpeed) — iterative search with 0.3m reach margin, 3.5s lookahead. Used by aiKeeper for high ball claiming, sweep interception, and shot arrival prediction. Used by playerAIController for loose ball chase. Missing: spin/Magnus effect, collision prediction with players, next-bounce prediction.",
    "fm2026Files": [
      "ballPrediction.js:1-131",
      "aiKeeper.js:56-75",
      "playerAIController.js:413-487",
      "physicsConstants.js:24-28"
    ],
    "legacyDetails": "Explicit quadratic trajectory prediction. NewTimeBallWillBeClosest(): linear projection with 500-unit lookahead, dot-product based closest point calculation. NewTimeBallWillBeHeadable(): peak height calculation PHA=((vel.y/200f)+0.1f)*vel.y, with 10-element BallDropTable lookup. Time-to-ground: complex iterative calculation (max 2500 iterations) with flight percentage tracking.",
    "legacyFiles": [
      "Ball.cs:1483-1554",
      "Ball.cs:1557-1606",
      "Ball.cs:1332-1416"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] Ball prediction now implemented in ballPrediction.js covering ~85-90% of legacy capability. Both engines now have intercept calculation, height-crossing detection, and trajectory prediction. Remaining minor gaps: no spin in prediction, no collision prediction with players, no next-bounce prediction.",
    "codeSuggestions": "RESOLVED \u2014 ballPrediction.js implements predictPosition(), timeToReachHeight(), findInterceptPoint(). Remaining improvement: integrate SPIN_FORCE_FACTOR into prediction for curved ball paths.",
    "resolvedDate": "2026-02-11"
  },
  {
    "id": "cmp-004-ball-bounce",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Ball Bounce Physics",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Bounce detection at height<=0.11m. Vertical restitution: 65% (BOUNCE_DAMPING=0.65). Curl-to-velocity transfer: 1.5x multiplier. Spin zeroed after bounce. Ground deceleration: 9.0 m/s\u00b2 (GROUND_DECEL). Stop threshold: |vh|<0.5 or planarSpeed<0.5 (ROLL_STOP_SPEED).",
    "fm2026Files": [
      "ballEngine.js:497-518",
      "physicsConstants.js:14-17"
    ],
    "legacyDetails": "Vertical restitution: 50% (GROUND_BOUNCE=0.5). Horizontal friction: 20% (GROUND_BOUNCE_FRICTION=0.2). Curl-to-velocity transfer: 10x multiplier. Spin zeroed after bounce. Rolling friction: frame-dependent (GROUND_FRICTION=10 * frame * 0.5). Stop threshold: speed < GRAVITY/2.",
    "legacyFiles": [
      "Ball.cs:1029-1191",
      "Ball.cs:282-287"
    ],
    "gapAnalysis": "Both have complete bounce physics with different parameters. FM2026 is MORE bouncy (65% vs 50% retention) but has less dramatic spin transfer (1.5x vs 10x). FM2026 uses constant deceleration (9 m/s\u00b2) which is more physically realistic than Legacy's frame-dependent friction.\n\nNo critical gap \u2014 different but both functional. FM2026 arguably more realistic.",
    "codeSuggestions": "Consider increasing curl-to-velocity transfer from 1.5x to something closer to 3-5x if balls feel too 'flat' after bouncing. The Legacy 10x is excessive but the current 1.5x may be too conservative for noticeable spin effects."
  },
  {
    "id": "cmp-005-movement-physics",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Player Movement Physics",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Base speed: 3.2 m/s. Max speed formula: BASE_SPEED * (0.5 + (pace*0.7 + acceleration*0.3)/100). Sprint multiplier: 1.6x. Acceleration: 0.5 + accelSkill*4.0 m/s\u00b2. Deceleration: 2x acceleration. Urgency modifiers: critical 1.8x, high 1.3x. Dribbling speed: BASE_SPEED*0.85 + (pace*0.4+dribbling*0.4+control*0.2)/100*2.8. Collision avoidance: explicit distance-based repulsion. Separation forces: teammate 3.5m radius, opponent 1.0m. Anchor spring: 0.12 strength.",
    "fm2026Files": [
      "movementController.js:15-23",
      "movementController.js:61-99",
      "movementController.js:193-367"
    ],
    "legacyDetails": "Abstract unit-based. Speed: (m_speed * Condition/100) * (Condition/100) \u2014 quadratic condition penalty. Acceleration: (m_acceleration * Condition)/100 \u2014 linear condition penalty. Min speed: 2 units/frame. Min acceleration: 10 units/frame. Movement via position-based pathfinding with target angles. Integer math (IntVector3). 145+ player states drive movement transitions.",
    "legacyFiles": [
      "Player.cs:917-932",
      "Player.cs:901-915",
      "PlayerAI.cs:1-150"
    ],
    "gapAnalysis": "FM2026 has more sophisticated movement: explicit sprint, urgency scaling, collision avoidance, separation forces. Legacy has quadratic condition penalty (stat scaled twice by condition) which FM2026 lacks \u2014 FM2026 stamina only affects challenge probability, not movement speed directly.\n\nFM2026 MISSING: Legacy's quadratic condition-to-stat scaling (severely punishes low fitness). FM2026 has better: sprint system, urgency modifiers, collision avoidance fields.",
    "codeSuggestions": "Consider adding condition/fitness scaling to movement speed in FM2026:\n\n// In movementController.js, after maxSpeed calculation:\nconst fitnessRatio = player.stamina / player.staminaMax;\nconst fitnessPenalty = 0.7 + fitnessRatio * 0.3; // 70-100% speed based on stamina\nmaxSpeed *= fitnessPenalty;"
  },
  {
    "id": "cmp-006-pass-ai",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Pass Decision AI / Scoring",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "computePassIntent() with evaluatePass() scoring. Distance scoring: sweet spot 15-35m. Receiver pressure: 5m penalty radius. Strategic value: cutback detection (2.0x bonus), defender safety bias, progress bonus (1.3x for 5m+ gain). Blocking: 25\u00b0 safety cone with dynamic widening. Lead factor: 0.8 with time estimation (dist/15, clamped 3s). Vision cap: >25m AND vision<60 = 0.5x. Final score: 100 * distScore * pressureScore * tacticsScore.",
    "fm2026Files": [
      "aiPass.js:39-162",
      "aiPass.js:206-294",
      "aiPass.js:165-200"
    ],
    "legacyDetails": "AIPassing() with FindOwnPassAngles(), OppositionPassAngleEffect(), ScorePassOptions(), BestPassOptions(). Lead factor: (55 + vision/2)/100 adjusted by dribbleEase. Distance scoring: discrete bands (5m, 20/30/40m). Angle scoring: perfect angle diff + facing angle + vision threshold. Safety angle: DRIBBLE_SAFETY_ANGLE*5 = 25\u00b0. Long ball bonus: progress toward goal + 100*ROTATION_SCALE. Vision check: myAngleDiff > (VisionStat + 90)\u00b0 = invalid.",
    "legacyFiles": [
      "PlayerAI.cs:75-111",
      "PlayerAI.cs:1670-1886",
      "PlayerAI.cs:1888-2051",
      "PlayerAI.cs:2054-2400"
    ],
    "gapAnalysis": "Both have sophisticated pass scoring. FM2026 uses continuous normalized scoring (0-100); Legacy uses absolute scoring with discrete bands. FM2026 has explicit cutback detection; Legacy has better angle/facing integration.\n\nFM2026 MISSING:\n- Player pair chemistry bonuses (Legacy doesn't have this either, but FM2026 tracks playerFeeds without using them)\n- Repetition penalties (don't keep passing to same player)\n- Complex multi-angle vision checks\n- Weak foot integration into pass execution (FM2026 has this in ballActionController but unclear if pass AI considers it)\n\nFM2026 BETTER AT: cutback detection, continuous scoring, lead time estimation.",
    "codeSuggestions": "1. Use playerFeeds chemistry data in pass scoring:\n// In aiPass.js evaluatePass(), after tacticsScore:\nconst feedKey = `${passer.id}-${receiver.id}`;\nconst feeds = matchState.playerFeeds?.[feedKey] || 0;\nconst chemistryBonus = 1.0 + Math.min(feeds * 0.02, 0.15); // up to 15% bonus\nfinalScore *= chemistryBonus;\n\n2. Add repetition penalty:\nconst lastPassTarget = passer.lastPassTargetId;\nconst repetitionPenalty = (lastPassTarget === receiver.id) ? 0.7 : 1.0;\nfinalScore *= repetitionPenalty;"
  },
  {
    "id": "cmp-008-dribble-ai",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Dribbling AI",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "computeDribbleIntent() with carry/gap/score calculations. Progress scoring (0.4-2.5x). Safety scoring (opponent proximity). Pressure: exponential retention (baseRetention^oppsNear). Solo run prevention: 40m limit. Boundary avoidance: 1.5m buffer with panic/caution penalties. Role bias: defenders 0.1x, attackers 2.0x. Game state: protecting lead 0.7x, chasing 1.2x. Heat map space integration. Gap exploitation: finds 4m+ gaps between defenders, knock-on if pace>75.",
    "fm2026Files": [
      "aiDribble.js:23-121",
      "aiDribble.js:124-155",
      "aiDribble.js:198-275",
      "aiDribble.js:278-288"
    ],
    "legacyDetails": "FindDribbleDestination() + FindDribbleDirection() + FindDribbleSpeed(). GK targets goal directly. Wide men: directbias calculation with intelligence-based cut-inside decision. Ultimate destination logic: close to goal (<24m) or cutting = target goal. 360-degree gap scanning between defenders. Speed adjusted by opponent blocking. Keeper jink evasion. No explicit solo run prevention or boundary awareness.",
    "legacyFiles": [
      "PlayerAI.cs:1467-1579",
      "PlayerAI.cs:1581-1629",
      "PlayerAI.cs:882-950"
    ],
    "gapAnalysis": "FM2026 is MORE COMPLETE:\n- Solo run prevention (Legacy lacks)\n- Boundary awareness (Legacy lacks)\n- Heat map space integration (Legacy lacks)\n- Explicit role/game-state biases (Legacy implicit)\n- Knock-on mechanic for fast players\n\nFM2026 MISSING:\n- 360-degree angle ordering (Legacy's gap scan is more thorough)\n- Intelligence-based cut-inside decision for wide players\n- Keeper jink evasion mechanic\n\nOverall FM2026 is SUPERIOR with better safety and tactical awareness.",
    "codeSuggestions": "Add intelligence-based cut-inside for wide players:\n// In aiDribble.js computeGapDribbleIntent():\nif (isWidePosition(player) && Math.abs(player.pos.y) > fieldWidth * 0.35) {\n  const cutChance = player.attributes.intelligence / 150;\n  if (rng.nextFloat() < cutChance) {\n    // Cut inside toward goal center\n    targetY = player.pos.y * 0.3; // Move toward center\n  }\n}",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-009-offball-movement",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Off-Ball Movement / Player Runs",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "computeOffBallIntent() with attacking runs (5 types: straight burst, half-space 'Henry' run, diagonal cuts, far post, target box), support runs (limited to closest 1 player, 6-32m from ball), marking (role-based priority: CBs mark STs priority 30, etc.), communication (askingForBall flag), offside correction. Marking has zonal responsibility, occupancy penalty (-1000 if closer teammate), tight marking within 8m. Man-to-man flag reduces lane discipline.",
    "fm2026Files": [
      "aiOffBall.js:42-184",
      "aiOffBall.js:188-298",
      "aiOffBall.js:301-375",
      "aiOffBall.js:436-618"
    ],
    "legacyDetails": "PlayerInMotion() with AnyForwardRun(), AnyBackwardRun(), FindSpace(), AnyMarking(), GetTacticTarget(). Heat map for space finding. Offside check with agility factor. Sprint decision: ShallWeSprint() based on last defender position. Position fade for smooth transitions. FreeRoleFlag enables space-finding mode.",
    "legacyFiles": [
      "PlayerActions.cs:317-551"
    ],
    "gapAnalysis": "FM2026 ADVANTAGES:\n- 5 explicit attacking run types (Legacy has generic forward/backward)\n- Player communication (askingForBall)\n- Sophisticated marking with role priority and occupancy prevention\n- Support run limiting (prevents mob behavior)\n\nFM2026 MISSING:\n- Detailed AnyForwardRun/AnyBackwardRun specifics (Legacy implementation hidden)\n- Position fade for smooth transitions\n- Sprint-based-on-offside-line logic\n\nBoth engines use heat maps for space finding. FM2026 is more explicit and tactical.",
    "codeSuggestions": "Consider adding position smoothing/fade to prevent abrupt position changes:\n// In movementController.js:\nconst FADE_FACTOR = 0.85;\nplayer.targetPos.x = player.pos.x * (1 - FADE_FACTOR) + targetX * FADE_FACTOR;\nplayer.targetPos.y = player.pos.y * (1 - FADE_FACTOR) + targetY * FADE_FACTOR;"
  },
  {
    "id": "cmp-010-space-finding",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Space Finding AI",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "buildHeatMap(): 18x15 grid (5.83m x 4.53m cells). Heat generation: +1.0 at player pos, +0.5 adjacent (diffusion). findOpenPocket(): role-specific search radius (FW=1, MID=3 cells), move if bestScore>2.0. calculateSpaceScore(): horizontal+vertical scan for empty cells. calculateGapRun(): finds gaps >8m between defenders, positions on shoulder of last defender. Offside-aware.",
    "fm2026Files": [
      "aiSpace.js:44-69",
      "aiSpace.js:81-117",
      "aiSpace.js:119-149",
      "aiSpace.js:155-247"
    ],
    "legacyDetails": "CreateHeatMap() + FindSpace() referenced in PlayerActions.cs. 15x18 grid (same coverage as FM2026 but inverted labels). Implementation details hidden but used for open pocket finding near tactical target. Both engines use 8m gap threshold.",
    "legacyFiles": [
      "PlayerActions.cs:342-354",
      "Team.cs:870-877"
    ],
    "gapAnalysis": "FM2026 is more transparent and explicit. Adds: heat diffusion, role-specific search radius, gap running with offside awareness. Legacy is opaque \u2014 implementation hidden. Both use identical grid coverage.\n\nNo significant gaps \u2014 FM2026 is more sophisticated here.",
    "codeSuggestions": "No fix needed. FM2026 space finding is well-implemented.",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-011-tackling",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Tackling Variants",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[RESOLVED 11 Feb] 6 distinct tackle types in TACKLE_CONFIG: BLOCK (0.25s, 5% foul), BLOCK_HARD (0.25s, 15%), SWIVEL (0.84s, 10%), SWIVEL_HARD (0.84s, 25%), SLIDE_SAFE (1.10s, 15%), SLIDE_WILD (0.90s, 35%). selectTackleType() selects by approach angle (>100deg=BLOCK, 75-100=SWIVEL, <75=SLIDE) and aggression determines hard/normal variant. Each has intensity multiplier for injury risk. Plus: Success probability: 0.55 + skillDiff/120 + spacingBonus + fatiguePenalty*0.08 + frontBonus. Tackles from behind: 2.5x foul multiplier. Defender box fortress: +0.20 in own box. GK bonus: +0.25 in penalty area. Cooldowns: win 1.2s, fail 1.8s. Constants: PICKUP_RADIUS=1.2m, OWNER_STUMBLE_S=0.4s.",
    "fm2026Files": [
      "challengeController.js:32-225",
      "challengeController.js:358-424"
    ],
    "legacyDetails": "4 distinct tackle variants based on angle difference:\n1. Block Tackle (angle>100\u00b0): standing block, 250ms duration\n2. Swivel Tackle (angle 75-100\u00b0): spinning defensive move, 840ms\n3. Slide Tackle (angle<75\u00b0): committed full-length, 1100ms safe / 900ms wild\nEach has normal+hard variant (aggression roll: random(0,350) < agg). Predicted ball position accounts for opponent speed vector. Animation-driven timing.",
    "legacyFiles": [
      "PlayerActions.cs:1105-1245",
      "PlayerState.cs:blocktackle/slidetackle states"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] FM2026 now has 6 tackle types matching Legacy's 4+hard variants (8 combos). Angle-based selection implemented. Still missing: shoulder charge variant, light-pressure tackle. FM2026 adds tactical modifiers (stayonfeet/noprisoners) that Legacy lacks.",
    "codeSuggestions": "RESOLVED \u2014 selectTackleType() implements angle+aggression-based selection. Remaining: consider adding shoulder charge for close-quarters defending."
  },
  {
    "id": "cmp-012-fouls",
    "date": "2026-02-14T12:00:00Z",
    "category": "matchEngine",
    "feature": "Foul Types and Referee Decisions",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "resolvedDate": "2026-02-11",
    "reopenedDate": "2026-02-14",
    "reopenReason": "Foul base rate still at 0.35 ('temporarily boosted' from 0.05 per code comment at challengeController.js:402). Inflated fouls in attacking areas = excessive free kicks/penalties, contributing to unrealistic scorelines.",
    "fm2026Details": "[REOPENED 14 Feb] 6 foul types in FOUL_TYPES. determineFoulType() uses context. BUG: Foul base chance at challengeController.js:402 is 0.35 — code comment says 'Temporarily boosted (0.05 -> 0.35)' but was never reverted. This 7x inflation means ~35% of tackles result in fouls before aggression/tackling modifiers. With noprisoners (+220%) and from-behind (2.5x) modifiers, foul rates in the box are extreme, generating excessive penalties. Legacy equivalent: foul occurs only when defender is closer to opponent than ball AND within slide area AND didn't touch ball first — a geometric/timing check, not a flat probability.",
    "fm2026Files": [
      "challengeController.js:227-295"
    ],
    "legacyDetails": "7 distinct foul types: standardFoul, violentConduct (red), professionalFoul (red), handBall (red), verbalFoul (yellow), offside, simulation/diving (yellow). Card logic: standard/verbal/simulation \u2192 yellow, second yellow \u2192 red. Violent/handball/professional \u2192 direct red. Referee 'sees' incident randomly (m_sight=100). Queue-based processing with busy check.",
    "legacyFiles": [
      "Officials.cs:13-23",
      "Officials.cs:112-132",
      "OfficialLogic.cs"
    ],
    "gapAnalysis": "[REOPENED 14 Feb] Foul types are good (6 types matching Legacy's 7), but the BASE FOUL PROBABILITY is broken. challengeController.js:402 has foulRisk default of 0.35 with a comment saying it was 'temporarily boosted' from 0.05. This was never reverted. Effect: ~35% of all tackles produce fouls, heavily skewed toward attacking areas where tackles are most frequent. This generates excessive free kicks near the box and penalty kicks, directly inflating goal counts. Legacy uses a geometric/timing foul check (defender closer to opponent than ball), not a flat probability — making fouls rare but contextually appropriate.",
    "codeSuggestions": "P1 FIX: Revert foul base rate in challengeController.js:402:\n// FROM: let foulChance = (tackle?.foulRisk || 0.35) + (aggression / 400) - (tackling / 300);\n// TO: let foulChance = (tackle?.foulRisk || 0.05) + (aggression / 400) - (tackling / 300);\n// The 0.05 base was the original intended value per the code comment."
  },
  {
    "id": "cmp-013-cards",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Card System (Yellow / Red)",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[RESOLVED 11 Feb] Full card system in eventController.js. Yellow cards tracked per player (pStats.yellow_cards). Second yellow automatically converts to red (isSecondYellow flag). Red card triggers SEND_OFF event, player.onPitch=false, player.isEjected=true, player.role='SENT_OFF'. +6s injury time per card. Confidence reduction on carded player.",
    "fm2026Files": [
      "eventController.js:138-146",
      "challengeController.js:93-123"
    ],
    "legacyDetails": "Explicit second yellow \u2192 red card logic. Yellow triggers: standardFoul, verbalFoul, simulation. If yellowCards>1 \u2192 GiveRedCard() + SecondYellow animation. Red triggers: violentConduct, professionalFoul, handBall. Adds 6 seconds injury time per card. Official animation states (showyellow, showred).",
    "legacyFiles": [
      "Officials.cs:112-132",
      "OfficialLogic.cs:167-202"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] Second yellow = red now implemented. Player ejection on red card works. Injury time per card added. Missing: official animations (showing card), card accumulation across matches (suspensions).",
    "codeSuggestions": "// Add to eventController.js in the CARD case:\ncase 'CARD':\n  if (payload.cardType === 'YELLOW') {\n    stats.yellowCards++;\n    pStats.yellow_cards++;\n    // CHECK FOR SECOND YELLOW\n    if (pStats.yellow_cards >= 2) {\n      payload.cardType = 'RED'; // Upgrade to red\n      stats.redCards++;\n      pStats.red_cards++;\n      player.onPitch = false; // Send off\n      player.role = 'SENT_OFF';\n      this.emit('SEND_OFF', teamIdx, playerId);\n    }\n  } else if (payload.cardType === 'RED') {\n    stats.redCards++;\n    pStats.red_cards++;\n    player.onPitch = false;\n    player.role = 'SENT_OFF';\n    this.emit('SEND_OFF', teamIdx, playerId);\n  }\n  // Add injury time\n  this.match.injuryTime = (this.match.injuryTime || 0) + 6;\n  break;"
  },
  {
    "id": "cmp-014-offside",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Offside Detection",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "Timing-based at pass launch. Sorts opponents by distance to goal line, gets second-last (index 1). Marks teammates in opponent half + ahead of ball + ahead of second-last. Enforcement: 5-second window from pass. If receiver is in offsideIds and same team as passer \u2192 OFFSIDE event + restart.",
    "fm2026Files": [
      "ballEngine.js:219-265",
      "gameEngine.js:182-213"
    ],
    "legacyDetails": "AreTheyOffside() used during pass evaluation. Offside flag on player data (m_offside). Linesman raises flag (TriggerOffsideFlagEast/West). Game stops for free kick. Offside trap possible via marking system. Immediate enforcement.",
    "legacyFiles": [
      "PlayerAI.cs:1631-1698",
      "Officials.cs:71-78",
      "GameState.cs"
    ],
    "gapAnalysis": "Both engines detect offside correctly. Key differences:\n- FM2026: frozen at pass moment (static), 5-second enforcement window\n- Legacy: checked during pass evaluation (proactive), immediate enforcement\n- FM2026 MISSING: dynamic offside trap, linesman animation\n- FM2026 ISSUE: 5-second window may allow late false flags or missed calls on rebounds\n- FM2026 MISSING: offside only on passes, not on free-kick reception or rebounds",
    "codeSuggestions": "1. Reduce 5-second window to 2 seconds:\n// gameEngine.js line 188:\nif ((matchState.timeSeconds - passOffsideState.timestamp) < 2.0) { // was 5.0\n\n2. Clear offside state on any ball contact by non-offside player:\n// After ball ownership change, if new owner is NOT in offsideIds, clear state\nif (newOwner && !ball.passOffsideState?.offsideIds?.includes(newOwner.id)) {\n  ball.passOffsideState = null;\n}"
  },
  {
    "id": "cmp-015-aerial-heading",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Aerial Challenges / Heading",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "Aerial contender detection: AERIAL_MIN_HEIGHT=0.8m, AERIAL_MAX_HEIGHT=2.8m, BASE_REACH_RADIUS=1.8m (+ jumping/200 bonus). Duel win score: (jumping*0.4 + strength*0.4) * (0.8 + stamina/100*0.2) * distance factor * random variance (0.8-1.2). Header direction: shoot if <20m from goal, clearance if defending <15m, else pass to teammate 5-25m. Accuracy: noise = (100-headingAttr)/5 degrees.",
    "fm2026Files": [
      "aerialChallengeController.js:29-31",
      "aerialChallengeController.js:41-73",
      "aerialChallengeController.js:78-100",
      "aerialChallengeController.js:105-159"
    ],
    "legacyDetails": "Three heading height zones (High >1m, Mid 0.6-1m, Low <0.6m) with different animations each. Distance detection: <=1.25m. Power: 13000 + 130*HeadingStat. Direction: shoot if <18 ROTATION_SCALE, else pass. Accuracy: GetRandom(0,130) < HeadingStat for success. GK handling: catch vs parry based on ball speed (skill = (400+HandlingStat*6)*ROTATION_SCALE/120).",
    "legacyFiles": [
      "PlayerActions.cs:1668-1920",
      "PlayerActions.cs:4324-4403",
      "KeeperActions.cs:820-856"
    ],
    "gapAnalysis": "FM2026 MISSING:\n- Height-zone differentiation (Legacy has High/Mid/Low with different animations and difficulty)\n- Fixed height band (0.8-2.8m) vs dynamic player reach\n- No 'receiving header' pre-animation state\n- GK aerial handling not explicit in aerialChallengeController\n\nFM2026 BETTER AT:\n- Explicit duel win-score calculation (Legacy is timing-based)\n- Noise-based accuracy model\n- Stamina integration in aerial duels",
    "codeSuggestions": "Add height-zone differentiation:\n// In aerialChallengeController.js, after win score calculation:\nlet heightZone, difficultyMod;\nif (ball.height > 2.0) { heightZone = 'HIGH'; difficultyMod = 1.0; }\nelse if (ball.height > 1.2) { heightZone = 'MID'; difficultyMod = 0.9; }\nelse { heightZone = 'LOW'; difficultyMod = 0.75; } // harder to head low balls\n\n// Apply to accuracy noise:\nnoise = ((100 - headingAttr) / 5) / difficultyMod;"
  },
  {
    "id": "cmp-017-corners",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Set Pieces \u2014 Corner Kicks",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "[UPDATED 10 Feb] 3 corner strategies: load (floods box, CBs with good jumping/strength join attack), short_corner (winger/fullback comes short), safe (defenders stay at halfway). Height hacking: tallest 2 outfield players (by jumping+strength) forced to near/far post via cornerOverrides. Full defensive corner positioning now in supportController. Taker: closest non-GK.",
    "fm2026Files": [
      "matchFlowController.js:450-469",
      "matchFlowController.js:792-799"
    ],
    "legacyDetails": "Defensive corner roles: nearpost (1 CB), farpost (1 CB), zonal (4-5 players), covershort (1 winger), marker (optional). Short corner option via cornerFlag==3 with secondary helper. Taker selected via SetCornerTaker(). Uses BallGrid tactic system for positioning. Attacking corners had code but commented out.",
    "legacyFiles": [
      "GameState.cs:847",
      "Team.cs:946-1592",
      "GameState.cs:1734-1760"
    ],
    "gapAnalysis": "CRITICAL GAP. FM2026 has NO defensive corner positioning \u2014 all players stay in open-play positions during corners. This means:\n- No near post marker\n- No far post marker\n- No zonal defensive line\n- No short corner cover\n- Corners are essentially free headers for the attacking team\n\nThis is one of the most impactful missing features for match realism.",
    "codeSuggestions": "// Add corner positioning to matchFlowController.js:\n\nfunction setupCornerDefense(team, cornerSide) {\n  const goalX = team.attackingGoalX === 52.5 ? -52.5 : 52.5;\n  const roles = [\n    { role: 'nearpost', pos: { x: goalX, y: cornerSide * 2.5 } },\n    { role: 'farpost', pos: { x: goalX, y: cornerSide * -5.0 } },\n    { role: 'zonal1', pos: { x: goalX + 4, y: -2 } },\n    { role: 'zonal2', pos: { x: goalX + 4, y: 2 } },\n    { role: 'zonal3', pos: { x: goalX + 6, y: 0 } },\n    { role: 'edge', pos: { x: goalX + 12, y: cornerSide * 8 } },\n  ];\n  // Assign defenders to roles by priority (CBs first)\n  const defenders = team.players.filter(p => p.onPitch && p.role !== 'GK')\n    .sort((a, b) => defPriority(a.role) - defPriority(b.role));\n  roles.forEach((r, i) => {\n    if (defenders[i]) {\n      defenders[i].cornerTarget = r.pos;\n      defenders[i].cornerRole = r.role;\n    }\n  });\n}"
  },
  {
    "id": "cmp-018-free-kicks",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Set Pieces \u2014 Free Kicks",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "Direct/indirect based on distance (DIRECT_KICK_RANGE=28m). Wall: 9.15m distance, 2-5 players by distance (5 if <20m, 4 if <25m, 3 if <30m, reduced by 2 if wide). Perpendicular spacing 0.6m. Direct FK shot: curl from curve stat (>60), dip from technique (>60), aims opposite corner. Taker: nearest non-GK (no override). No short FK option.",
    "fm2026Files": [
      "matchFlowController.js:578-589",
      "matchFlowController.js:809-875",
      "matchFlowController.js:771-779",
      "aiShot.js:63-97"
    ],
    "legacyDetails": "Direct vs indirect based on offense type. Wall: 9.15m, angle-based rotation with perpendicular spread. Taker: closest free player OR FreeKickTaker override. Short FK option via cornerFlag==3 with helper. Training attribute (m_training_freekicks) affects quality. Prone check prevents injured taker.",
    "legacyFiles": [
      "GameState.cs:1196-1260",
      "GameState.cs:1797-1818",
      "GameState.cs:1763-1795"
    ],
    "gapAnalysis": "FM2026 MISSING:\n- Designated free kick taker override (always nearest player)\n- Short free kick option\n- Training attribute impact\n- Injured player check for taker\n\nFM2026 BETTER AT:\n- Wall size algorithm (distance-based, granular)\n- Direct FK curl/dip physics (Legacy has no specific FK shot logic)\n- Wall perpendicular spacing calculations",
    "codeSuggestions": "// Add FK taker override to matchFlowController.js:\nfunction selectFreeKickTaker(team, fkSpot) {\n  // Check for designated FK taker first\n  const designated = team.players.find(p => \n    p.onPitch && p.role !== 'GK' && \n    (p.attributes?.freeKickTaker || p.attributes?.curve > 75)\n  );\n  if (designated) return designated;\n  // Fallback to nearest\n  return findNearestNonGK(team, fkSpot);\n}"
  },
  {
    "id": "cmp-019-penalties",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Set Pieces \u2014 Penalties & Shootout",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[UPDATED 10 Feb] Full penalty shootout: 5-round + sudden death. Taker selection by penalty attribute. Shooter: 5 strategies (safe/power/precision/panenka/panic) based on confidence. Full shootout state machine: startShootout(), queueNextPenalty(), checkShootoutWinner(), handleShootoutGoal/Miss(). GK: random L/C/R guess (1% cheat if anticipation>90).",
    "fm2026Files": [
      "aiShot.js:177-258",
      "aiKeeper.js:373-428",
      "matchFlowController.js:292-340"
    ],
    "legacyDetails": "Taker: closest free player with ball control. GK: uses same 12-type dive system. Training attribute (m_training_penalties) affects GK prediction accuracy. If training < threshold, ball position randomized for GK. Penalty shootout support with separate states.",
    "legacyFiles": [
      "KeeperActions.cs:1870-2207",
      "GameState.cs:1197-1210"
    ],
    "gapAnalysis": "FM2026 BETTER AT: shooter strategies (5 types), confidence-based selection, taker sorted by penalty attribute\nFM2026 MISSING:\n- GK penalty save intelligence (just random L/C/R guess)\n- No GK reaction time model for penalties\n- No anticipation based on taker tendency\n- No training attribute for GK prediction\n\nThe GK penalty logic is the weakest part \u2014 penalty shootouts are essentially random for the keeper.",
    "codeSuggestions": "// Improve GK penalty logic in aiKeeper.js:\nfunction computePenaltySaveIntent(gk, ball, rng) {\n  const anticipation = gk.attributes?.anticipation ?? 50;\n  const reflex = gk.attributes?.reflexes ?? 50;\n  \n  // Skill-based prediction (not just random)\n  let guessWeights = [0.33, 0.34, 0.33]; // L, C, R base\n  if (anticipation > 70) {\n    // Better keepers bias toward corners\n    guessWeights = [0.40, 0.20, 0.40];\n  }\n  \n  // Reaction delay based on reflexes\n  const reactionDelay = 0.3 - (reflex / 100) * 0.15; // 0.15-0.30s\n  \n  // Choose direction based on weighted random\n  const roll = rng.nextFloat();\n  let dir = roll < guessWeights[0] ? -1 : roll < guessWeights[0] + guessWeights[1] ? 0 : 1;\n  \n  return { dir, reactionDelay };\n}"
  },
  {
    "id": "cmp-020-throwin-goalkick",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Set Pieces \u2014 Throw-ins & Goal Kicks",
    "existsInFM2026": "partial",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Throw-in: taker is closest non-GK, non-ST. Treated as standard pass. No special throw mechanics or formation. Goal kick: GK selected, treated as standard restart. No explicit kick power/distance model. No special positioning or target selection.",
    "fm2026Files": [
      "matchFlowController.js:441-443",
      "matchFlowController.js:762-770",
      "matchFlowController.js:450-459"
    ],
    "legacyDetails": "Throw-in: closest free player. Standard throw mechanics. No special formation. Goal kick: GK with run-up animation (6.25m offset), 3 states (positioning/prep/approach). Explicit kick power (21000 units) and height (15000 units). Target selection via FindGoalKickTarget(). Inaccuracy effect applied. Receiving header state assigned proactively.",
    "legacyFiles": [
      "GameState.cs:988-998",
      "KeeperActions.cs:191-320"
    ],
    "gapAnalysis": "Both engines are minimal on throw-ins. For goal kicks, FM2026 MISSING:\n- GK run-up animation states\n- Specialized kick power/distance model\n- Target selection function\n- Inaccuracy model\n- Proactive heading assignment for receiver",
    "codeSuggestions": "// Add goal kick specialization to matchFlowController.js or aiKeeper.js:\nfunction computeGoalKickIntent(gk, teammates) {\n  const power = 20 + (gk.attributes?.kicking ?? 50) / 5; // 20-30 m/s\n  const loft = 4.0; // high ball\n  // Find best target: prefer defenders/midfielders 25-40m away\n  const targets = teammates.filter(t => t.role !== 'GK' && t.onPitch)\n    .map(t => ({ player: t, dist: distance(gk.pos, t.pos) }))\n    .filter(t => t.dist > 20 && t.dist < 45)\n    .sort((a, b) => a.dist - b.dist);\n  const target = targets[0]?.player || teammates[1]; // fallback\n  return { target, power, loft };\n}"
  },
  {
    "id": "cmp-021-formations-tactics",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Formation / Tactical Instructions",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "18x15 grid (much finer than Legacy). 3 position variants per formation: main, run, pass. Team instructions: passingStyle (simple/forward/longball/quick), pressing (none/deep/high), tempo, possession, corner, squeeze. Player flags: MarkingFlag (mantoman/zonal), ShootingFlag (4 opts), TacklingFlag (3 opts), MovementFlag (4 opts), PassingFlag (5 opts), CrossingFlag (3 opts). Conditional instructions: time-based + score-based triggers for formation/sub/tactic changes.",
    "fm2026Files": [
      "tacticsController.js:88-107",
      "tacticsController.js:109-117",
      "tacticsController.js:124-175"
    ],
    "legacyDetails": "6x5 grid (30 positions). BallGrid[6x5] system: 30 tactic blocks with player positions per ball zone. Out-of-possession compression: 3 levels (deep 70%/60%, mid 85%/75%, high 100%/90%). Corner roles: nearpost, farpost, zonal, covershort, marker. Dribble bias indexed by role. Formation scaling for kickoff/goal-kick specific positioning.",
    "legacyFiles": [
      "Tactics.cs:10-12",
      "Tactics.cs:102-215",
      "Tactics.cs:325-373"
    ],
    "gapAnalysis": "FM2026 BETTER AT: finer grid (270 vs 30 cells), conditional instructions, per-player tactical flags, multiple formation variants\nFM2026 MISSING:\n- BallGrid system (positions that change based on WHERE the ball is \u2014 very sophisticated)\n- Out-of-possession compression (3 defensive levels)\n- Dribble bias per role\n- Corner-specific roles in formation\n- Kickoff/goal-kick specific positioning\n\nThe BallGrid is the biggest gap \u2014 it means Legacy formations are dynamic (change with ball position) while FM2026 formations are static.",
    "codeSuggestions": "// Add ball-zone-based positioning to tacticsController.js:\nfunction getPositionForBallZone(player, ballPos, formation) {\n  // Divide pitch into 6 zones along X axis\n  const zoneX = Math.floor((ballPos.x + 52.5) / 17.5); // 0-5\n  const zoneKey = Math.min(5, Math.max(0, zoneX));\n  \n  // Each formation should have 6 position variants\n  const positions = formation.ballZonePositions?.[zoneKey];\n  if (positions && positions[player.formationIdx]) {\n    return positions[player.formationIdx];\n  }\n  return formation.positions[player.formationIdx]; // fallback\n}"
  },
  {
    "id": "cmp-022-player-states",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Player States / State Machine",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[UPDATED 11 Feb] Now has 15 ACTION_STATES: IDLE, RUNNING, SPRINTING, PASSING, SHOOTING, HEADING, BLOCK_TACKLE, SLIDE_TACKLE, DIVING_LOW, DIVING_MID, DIVING_HIGH, CELEBRATING, INJURED, RECEIVING + 10 tactical states. setActionState() with duration-based locking. State hysteresis 600ms for PRESS/COVER. Decision intervals: vision-based 0.35-0.75s + composure variance 0.15-0.40s. nudgeDecisionWindow() for immediate re-decision after tackles/ball loss. Dual stamina model: permanent degradation (0.005/s) + activity drain/recovery.",
    "fm2026Files": [
      "playerStateController.js:137-150",
      "playerStateController.js:43-84",
      "playerStateController.js:115-124"
    ],
    "legacyDetails": "145 explicit states covering: standing (2), movement (5), ball interaction (16), tackling (4), injury/stumbling (14), celebrations (4), set pieces (16), goalkeeper (22+), substitution (4), ejection/shootout (3), plus many more. Pending state queue for handling state changes while busy. State lifecycle: SetState(state, busy, forced).",
    "legacyFiles": [
      "PlayerState.cs:13-145"
    ],
    "gapAnalysis": "FM2026 has 10 states vs Legacy's 145. However, FM2026 is a headless server simulation \u2014 it doesn't need animation states. The states map to AI decisions, not visual states.\n\nStill MISSING and RELEVANT for headless sim:\n- Goalkeeper-specific states (no dive variants, positioning modes)\n- Set piece states (no FK/corner/penalty taker states)\n- Injury recovery states\n- Celebration states (for replay timing)\n- Tackle type states\n\nThe 10-state system is adequate for AI decision-making but insufficient for replay rendering variety.",
    "codeSuggestions": "For replay rendering, add a secondary 'action' state that maps to animation:\n\n// Add to playerStateController.js:\nconst ACTION_STATES = {\n  IDLE: 'idle', RUNNING: 'running', SPRINTING: 'sprinting',\n  PASSING: 'passing', SHOOTING: 'shooting', HEADING: 'heading',\n  BLOCK_TACKLE: 'blocktackle', SLIDE_TACKLE: 'slidetackle',\n  DIVING_LOW: 'diving_low', DIVING_MID: 'diving_mid', DIVING_HIGH: 'diving_high',\n  CELEBRATING: 'celebrating', INJURED: 'injured', RECEIVING: 'receiving'\n};\nfunction setActionState(player, action, duration) {\n  player.actionState = action;\n  player.actionUntil = Date.now() + duration;\n}"
  },
  {
    "id": "cmp-023-stamina",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Stamina / Fatigue System",
    "existsInFM2026": "yes",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Active drain model. Permanent decay: 0.005/sec (loses ~27 stamina over 90min). Recovery at speed<1.0 m/s: +2.5/sec. Drain at speed>=1.0 m/s: 0.05 + (effort\u00b2)*4.0 per sec (jog 3m/s = 0.48/sec, sprint 8m/s = 3.22/sec). Stamina affects challenge win chance (+8% per 100% fatigue). StaminaMax decays permanently.",
    "fm2026Files": [
      "playerStateController.js:166-209",
      "playerStateController.js:9-13",
      "challengeController.js:358-392"
    ],
    "legacyDetails": "Static condition metric. Condition = Base Condition - Injury Level (clamped >=0). All stats scaled TWICE by condition: stat = (base * cond/100) * (cond/100) \u2014 quadratic penalty. No active stamina drain during match. No sprint penalty. No recovery mechanic. Condition is snapshot at match start.",
    "legacyFiles": [
      "Player.cs:906-952",
      "Team.cs:438-446"
    ],
    "gapAnalysis": "FM2026 is SIGNIFICANTLY MORE ADVANCED here. Active simulation with sprint drain, recovery, permanent decay. Legacy has no in-match fatigue \u2014 just static condition.\n\nFM2026 MISSING: Legacy's quadratic stat scaling. In Legacy, 50% condition = 25% effective stat (devastating). FM2026 only penalizes challenge probability, not passing/shooting/speed accuracy.",
    "codeSuggestions": "Add stamina-to-attribute scaling:\n// In playerStateController.js or a shared utility:\nfunction getEffectiveAttribute(player, attr, defaultVal) {\n  const base = player.attributes?.[attr] ?? defaultVal;\n  const ratio = player.stamina / player.staminaMax;\n  // Soft penalty: below 50% stamina starts degrading\n  const penalty = ratio > 0.5 ? 1.0 : 0.5 + ratio;\n  return base * penalty;\n}",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-024-injuries",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "In-Match Injuries",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Numeric severity model. Physique: (strength + staminaMax)*0.4. Risk factor: (100 - physique) + 20. Intensity: relSpeed/12 * intensityMod * (foul? 1.5:1.0). Base hazard: 0.2% + injury-prone bonus up to 10%. Micro-damage: 2-12 per tackle (accumulates). Severe at level 50+. 7 injury types weighted: minorknock(40), deadleg(25), calf_strain(15), hamstring_pull(10), dislocated_shoulder(5), broken_leg(3), cruciate_ligament(2). 'noprisoners' tactic multiplies damage by 1.6x.",
    "fm2026Files": [
      "challengeController.js:299-356"
    ],
    "legacyDetails": "State-based system. 7 injury/stumble states: injuredOnBack, injuredOnFront, trippedForward, trippedGentle, takedive, recoverFromBack, recoverFromFront. Recovery tied to animation. Injury levels affect Condition metric (cumulative reduction). Injury trigger implicit in challenge outcomes.",
    "legacyFiles": [
      "PlayerActions.cs:tripped/injured states",
      "Player.cs"
    ],
    "gapAnalysis": "FM2026 is MORE SOPHISTICATED: continuous numeric model, injury types with weighted probabilities, physique resilience, micro-damage accumulation.\nFM2026 MISSING: visual injury recovery states (no stumble/recovery animation feedback for replay).\nLegacy MISSING: injury type variety, physique calculation, damage accumulation.",
    "codeSuggestions": "No major fix needed. FM2026 injury model is more advanced. For replay rendering, add injury animation state:\n// After injury in challengeController.js:\nif (victim.injuryLevel > 25) {\n  victim.actionState = 'INJURED_GROUND';\n  victim.actionDuration = 3.0; // seconds on ground\n}",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-025-substitutions",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Substitutions",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Advanced controller. Max 5 subs. Dead ball phase only. Staggered: WALKING_OFF \u2192 WALKING_ON (15s timeout each). Ball transfer, role transfer, position transfer. Extra time: +30s per sub. Auto-sub AI: injury (level>25), fatigue (after 45min if stamina<60), tactical (after 65min, increasing chance). Replacement: random bench player.",
    "fm2026Files": [
      "substitutionController.js:1-279"
    ],
    "legacyDetails": "Simple FIFO queue. Validates player availability (not Disabled). Adds 12s injury time per sub. No AI auto-subs. Instant swap. No walking animation.",
    "legacyFiles": [
      "SubstitutionController.cs:1-76"
    ],
    "gapAnalysis": "FM2026 is MORE ADVANCED: auto-sub AI, staggered animation, injury/fatigue triggers.\nFM2026 MISSING: Role-aware replacement selection (currently random bench player).\nLegacy MISSING: auto-sub AI, staggered execution, injury-based triggers.",
    "codeSuggestions": "Improve replacement selection:\n// In substitutionController.js autoSubCheck():\nconst sameRoleSub = bench.find(b => b.role === playerOff.role);\nconst replacement = sameRoleSub || bench[0]; // prefer same role",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-026-reaction-time",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Player Reaction Time / BrainStamp",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Decision interval: base = 0.15 + (1-vision/100)*0.25 seconds (0.15-0.4s). Variance: 0.1 + (1-composure/100)*0.15 seconds. Random offset applied. Minimum: 0.25s. Post-tackle nudge: reduces to now+0.15s. State locking prevents rapid switching (PRESS 600ms, COVER 500ms, etc.).",
    "fm2026Files": [
      "playerStateController.js:115-133",
      "playerStateController.js:138-143"
    ],
    "legacyDetails": "BrainStamp system. Reaction bias: 150 - IntelligenceStat. Out of play: 5 * bias game ticks. In play: 10 * bias game ticks (double penalty during live play). Player can only update when GameTime >= BrainStamp. Intelligence 50 = 500-1000 tick delay. Intelligence 100 = 250-500 tick delay. Intelligence 150 = instant.",
    "legacyFiles": [
      "PlayerActions.cs:170-177",
      "Player.cs:956"
    ],
    "gapAnalysis": "Both have decision cooldown systems. FM2026 uses Vision+Composure (two attributes); Legacy uses Intelligence only. FM2026 range is 0.15-0.65s; Legacy has potentially much wider range. FM2026 adds randomness (composure variance); Legacy is deterministic.\n\nFM2026 BETTER: two-attribute system, randomness, post-tackle nudge\nLegacy BETTER: wider penalty range for low intelligence, in-play vs out-of-play distinction",
    "codeSuggestions": "Consider adding in-play vs dead-ball distinction:\n// In playerStateController.js computeDecisionInterval():\nconst inPlayMultiplier = matchState.phase === 'IN_PLAY' ? 1.0 : 0.5;\nreturn Math.max(0.15, (base + randomOffset) * inPlayMultiplier);"
  },
  {
    "id": "cmp-027-pressing",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Pressing / Defensive AI",
    "existsInFM2026": "yes",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Sophisticated system. Trigger: 12m base, 30m panic in own box. Role weights: DM 1.4x, ST 1.5x, CB 0.85x. Stamina factor: below 60% reduces to 0.4-1.0x. Support bonus: +0.2x per teammate within 8m (max 1.4x). Risk penalty: 0.7x if >1 opponent nearby. Slot cap: max 2 pressers. 3 variants: Challenging (<1.8m, threshold 0.45-0.7), Jockeying (1.8-8m, buffer 1-3m), Closing Down (all other). CB protection: avoid pressing wide balls >20m.",
    "fm2026Files": [
      "aiPress.js:1-278"
    ],
    "legacyDetails": "Implicit in PlayerAI.cs and Team.cs. Team pressing flag (none/deep/high). Individual decision based on role, ball position, tactical flag. No explicit pressing score. No support bonus. No slot cap. No jockey/challenge distinction.",
    "legacyFiles": [
      "PlayerAI.cs",
      "Team.cs"
    ],
    "gapAnalysis": "FM2026 is SIGNIFICANTLY MORE ADVANCED. Explicit scoring, 3 press variants, slot cap, support mechanics, role weighting, stamina integration. Legacy has basic implicit pressing only.\n\nFM2026 MISSING: direct use of team pressing flag (deep/high/none) as input to calculations.",
    "codeSuggestions": "Integrate team pressing flag:\n// In aiPress.js, in trigger calculation:\nconst pressingFlag = team.tactics?.pressing || 'none';\nconst flagMultiplier = { 'none': 0.5, 'deep': 0.8, 'high': 1.3 }[pressingFlag];\ntriggerDistance *= flagMultiplier;",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-028-chemistry",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Communication / Chemistry System",
    "existsInFM2026": "yes",
    "existsInLegacy": "no",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "TRACKING ONLY. Pass combinations tracked via playerFeeds: { 'playerId-receiverId': count }. Data stored in matchState and returned in match result. askingForBall flag in off-ball AI. But NO bonuses applied to pass accuracy, decision quality, or understanding. Chemistry data is collected but completely unused in AI decisions.",
    "fm2026Files": [
      "eventController.js:122-126",
      "matchMain.js:50",
      "matchMain.js:482",
      "aiOffBall.js:50-76"
    ],
    "legacyDetails": "NOT IMPLEMENTED. No chemistry or communication tracking found. No player-pair relationship modifiers.",
    "legacyFiles": [],
    "gapAnalysis": "FM2026 has the infrastructure (tracking) but doesn't USE it. Legacy has nothing. This is a MAJOR opportunity \u2014 the data is already collected, just needs to be wired into pass scoring.\n\nNeither engine has chemistry influencing gameplay currently.",
    "codeSuggestions": "// Wire chemistry into aiPass.js evaluatePass():\nconst feedKey = `${passer.id}-${receiver.id}`;\nconst combinationCount = matchState.playerFeeds?.[feedKey] || 0;\n\n// Chemistry bonus: up to 15% better pass evaluation after repeated combinations\nconst chemistryBonus = 1.0 + Math.min(combinationCount * 0.025, 0.15);\nfinalScore *= chemistryBonus;\n\n// Also reduce lead error for familiar combinations:\nif (combinationCount >= 3) {\n  leadError *= 0.85; // 15% more accurate leading passes to familiar target\n}"
  },
  {
    "id": "cmp-029-match-flow",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Match Flow / Game State Machine",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "Two-level hierarchy: Phase (PRE_MATCH, IN_PLAY, DEAD_BALL, FINISHED) + PlayState (IDLE, LIVE, RESTART, GOAL, GOAL_CELEBRATION, HALF_TIME, PENALTY_SHOOTOUT, MATCH_OVER). 10 restart types. Restart substates: POSITIONING \u2192 READY \u2192 EXECUTED. Modular design with separate controllers. GOAL_PAUSE=2s.",
    "fm2026Files": [
      "matchFlowController.js:1-890",
      "constants.js:124-135"
    ],
    "legacyDetails": "44 explicit states in monolithic enum. Monolithic switch-case in UpdateGameState(). Separate 'Awarded' and 'Execution' states for each restart type. GameStateStamp triggers timed transitions. Shootout support. All state logic in single 1,867-line file.",
    "legacyFiles": [
      "GameState.cs:14-44",
      "GameState.cs:210-1685"
    ],
    "gapAnalysis": "FM2026 has fewer explicit states (~20 vs 44) but equivalent coverage through hierarchical design. More maintainable and modular. No critical gaps \u2014 just different architectural approach.\n\nBoth support: kickoff, throw-in, goal kick, corner, free kick, penalty, half-time, full-time, shootout.\nFM2026 MISSING: separate 'awarded' states (collapsed into RESTART + substate).",
    "codeSuggestions": "No fix needed. FM2026's hierarchical state design is cleaner than Legacy's monolithic approach."
  },
  {
    "id": "cmp-030-match-stats",
    "date": "2026-02-10T16:30:44Z",
    "category": "matchEngine",
    "feature": "Match Statistics Tracking",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Team stats: goals, shots, shotsOnTarget, passes, passesComplete, passesPercent, fouls, corners, crosses, offsides, tackles, yellowCards, redCards. Player stats: yellow_cards, red_cards, goals, assists, sheets, apps, subs, penalties, free_kicks, corners, throw_ins, crossing, tackles, injury_level, distance, shots, passes, fitness, ticksOnPitch. Event-driven via eventController.js.",
    "fm2026Files": [
      "eventController.js:55-189",
      "matchMain.js:51-54",
      "matchMain.js:114-120"
    ],
    "legacyDetails": "Per-player: passesCompleted, passesMade, touches, crosses, assists, shotsMade, shotsOnTarget, goals, fouled, foulsMade, offside, headersWon, red, yellow, tacklesMade, tacklesWon, goalsConceded, saves. Team totals aggregated. Data streamed via TotalDataStream.",
    "legacyFiles": [
      "Team.cs:320-850"
    ],
    "gapAnalysis": "FM2026 captures ~95% of Legacy stats. MISSING: player touch count (possessions/touches stat). FM2026 ADDS: injury tracking, combination chemistry logging, distance covered, fitness drain.\n\nMINOR gap only.",
    "codeSuggestions": "// Add touch count to eventController.js:\ncase 'BALL_TOUCH':\n  if (player) pStats.touches = (pStats.touches || 0) + 1;\n  break;"
  },
  {
    "id": "cmp-031-heatmap",
    "date": "2026-02-10T16:58:27Z",
    "category": "matchEngine",
    "feature": "Heat Map / Positional Tracking",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "18x15 grid (5.83m x 4.53m cells). THREE channels: density (opponent pressure), attack (successful attacks), space (inverse of density). Decay: 95% per tick. Gaussian blur: 3x3 kernel (1.0 center, 0.4 edges). Attack heat recorded on goals (+10) and shots (+5). getSpace() query function for AI decisions.",
    "fm2026Files": [
      "heatMapController.js:1-120"
    ],
    "legacyDetails": "15x18 grid (~4.5m x 5.8m cells). Basic float array. Population method referenced but not visible. Used in CalcPerformance and FindSpace(). Single channel (density only).",
    "legacyFiles": [
      "Team.cs:870-877"
    ],
    "gapAnalysis": "FM2026 SIGNIFICANTLY ENHANCES Legacy: adds decay, Gaussian blur, attack success layer, space availability calculation. Legacy has basic grid only.\n\nNo gaps \u2014 FM2026 is superior here.",
    "codeSuggestions": "No fix needed. FM2026 heat map is well-designed and more advanced than Legacy.",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-032-weak-foot",
    "date": "2026-02-10T16:58:27Z",
    "category": "matchEngine",
    "feature": "Weak Foot System",
    "existsInFM2026": "yes",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "Comprehensive system. Player attributes: left_foot, right_foot, preferredFoot. Angle-based foot selection: smooth transition zone between FOOT_SWITCH_ANGLE_DEG_LOW and HIGH. Weak foot penalties: power reduction (FOOT_POWER_BASE + FOOT_POWER_SCALE * footStat/100), accuracy noise (exponential: FOOT_NOISE_INDEX power). Curl direction biased by preferred foot (sideMult). Test coverage: weakFootTest.js.",
    "fm2026Files": [
      "ballActionController.js:40-78",
      "ballEngine.js:183-211",
      "weakFootTest.js"
    ],
    "legacyDetails": "NOT FOUND. No direct weak foot references in PlayerAI.cs or related files. If present, implementation is minimal or hidden.",
    "legacyFiles": [],
    "gapAnalysis": "FM2026 has COMPREHENSIVE weak foot system; Legacy has NONE found. FM2026 applies dual penalties (power + accuracy) based on angle relative to preferred foot.\n\nNo gap \u2014 FM2026 is superior here.",
    "codeSuggestions": "No fix needed. FM2026 weak foot system is well-implemented with test coverage.",
    "exceedsLegacy": true
  },
  {
    "id": "cmp-033-performance-rating",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Player Performance Rating",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[RESOLVED 11 Feb] New playerStatisticsController.js. calculateRating(): base 50, passes (+passAcc*7, -0.5/incomplete), goals +9, assists +8, shots +1.5, tackles +2, saves +7 (GK), yellow -5, red -15. Clean sheet: GK +10, defenders +9. Result multiplier: 1+(goalDiff*0.02). Clamped 30-100. selectManOfTheMatch(): highest rating across both teams. ~50% of legacy granularity (9 vs 12+ stat types).",
    "fm2026Files": [
      "matchMain.js:122-127",
      "eventController.js:68-82",
      "matchMain.js:512-518"
    ],
    "legacyDetails": "Full CalcPerformance() system. Base 50 points. 18+ scoring factors: good passes +7, bad passes -4, touches +5, goals +9, SOT +3.5, missed shots -1.5, assists +8, crosses +2, headers +3, yellow -5, red -15, fouls made -1, being fouled +2, offside -1. Role-dependent tackle scoring (defender +3, mid +2.2, other +0.6). GK: concede -7.5, save +7. Clean sheet: GK +10, def +9. Result multiplier: \u00b12% per goal diff. Clamped 30-100.",
    "legacyFiles": [
      "Team.cs:702-846"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] Performance rating now implemented. Both engines return 30-100 rating. FM2026 tracks 9 stats vs legacy's 12+. Missing: interceptions, clearances, dribbles, crosses, aerial duels, key passes, xG. Also missing: role-weighted tackles (legacy gives defenders +3 vs midfielders +2.2), touches tracking, fouls-won tracking.",
    "codeSuggestions": "// Add to matchMain.js, after stat collection:\n\nfunction calculatePerformanceRating(player, pStats, teamStats, resultDiff) {\n  let rating = 50;\n  \n  // Passing\n  const passAcc = pStats.passes > 0 ? pStats.passesComplete / pStats.passes : 0;\n  rating += passAcc * 7;\n  rating -= (pStats.passes - (pStats.passesComplete || 0)) * 0.5;\n  \n  // Attack\n  rating += (pStats.goals || 0) * 9;\n  rating += (pStats.assists || 0) * 8;\n  rating += (pStats.shots || 0) * 1.5;\n  \n  // Defense\n  rating += (pStats.tackles || 0) * 2;\n  \n  // Discipline\n  rating -= (pStats.yellow_cards || 0) * 5;\n  rating -= (pStats.red_cards || 0) * 15;\n  \n  // Clean sheet (defenders/GK)\n  if (teamStats.goals === 0 && ['GK','CB','LB','RB','LWB','RWB'].includes(player.role)) {\n    rating += player.role === 'GK' ? 10 : 9;\n  }\n  \n  // Result multiplier\n  rating *= 1 + (resultDiff * 0.02);\n  \n  return Math.round(Math.max(30, Math.min(100, rating)));\n}\n\n// Call after match ends, add to result:\nplayer.matchRating = calculatePerformanceRating(player, player.stats, teamStats, goalDiff);"
  },
  {
    "id": "gf-001-player-generation",
    "date": "2026-02-13T12:00:00Z",
    "category": "gameFeature",
    "feature": "Player Generation / Card Rarity",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "FIXED (13 Feb). createPlayer() in squadService.js passes rarity to processRoleDefaultStats(rarity). New RarityStatsBonus table: Free (0.8\u00d7+1), Regular (1.0\u00d7+1-10), Rare (1.2\u00d7+20-30), Epic (1.4\u00d7+40-50), Legendary (1.6\u00d7+65-70). Stats scaled by: min = floor(baseMin * multiplier) + rarityCfg.min. Dynamic rarity recalculation via getQualityFromScore(). Stat defaults changed from 0 to 1. Rarity upgrade progression with NFT metadata sync on-chain.",
    "fm2026Files": [
      "api/services/squadService.js:223-248",
      "api/model.js:607-776"
    ],
    "legacyDetails": "CreatePlayerData() in StatCreator.cs (685 lines). 22 attributes on 0-20 scale. Rarity via CardQuality enum (Free/Common/Rare/Epic/Legendary). QualityFromScore() converts ability to rarity using threshold values (LegendaryAbility, EpicAbility, RareAbility). Role-based stat generation via CreateRoleStats(). Star rating calculated from FineRoleScore(). Foot preference (0-100), height, looks (51-bit facial encoding).",
    "legacyFiles": [
      "Server/ManagementLogic/StatCreator.cs:1-685"
    ],
    "gapAnalysis": "CRITICAL GAP. FM2026 has functional player generation but rarity is completely broken \u2014 a Legendary player is statistically identical to a Free player of the same role. Legacy correctly scales stats by quality thresholds.\n\nAlso missing:\n- Star rating recalculation after upgrades (BUG-002)\n- Quality-from-score threshold system\n- Foot preference granularity (Legacy 0-100, FM2026 binary)",
    "codeSuggestions": "// Fix rarity in processRoleDefaultStats() in model.js:\nconst rarityMultipliers = { free: 0.6, regular: 0.75, rare: 0.85, epic: 0.93, legendary: 1.0 };\nconst mult = rarityMultipliers[rarity] || 0.75;\n// Apply to each stat range:\nstat = Math.round(baseMin + (baseMax - baseMin) * mult * (0.8 + Math.random() * 0.2));"
  },
  {
    "id": "gf-002-pack-system",
    "date": "2026-02-13T12:00:00Z",
    "category": "gameFeature",
    "feature": "Card Pack System",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P3",
    "status": "resolved",
    "fm2026Details": "UPDATED (13 Feb). openCardsPack() in cardsService.js. 6 pack types: Regular (0.01 SOL), Rare (0.05 SOL), Epic (0.10 SOL), Legendary (0.25 SOL), Free visible (Pack 4, 5/5/10/5/5), Free reward (Pack 1000, 3/3/3/2/2). withNFT parameter on all card creation methods \u2014 Free packs create non-NFT cards (no on-chain minting cost). rewardWithCardsPack() for pack rewards. NFT-optional system. 7,595 lines of hardcoded kits.json deleted (moved to DB).",
    "fm2026Files": [
      "api/services/cardsService.js:123-180",
      "api/data/packs.json"
    ],
    "legacyDetails": "OpenNFTCardsPack() in BoosterPack.cs (2,672 lines). 11 card types: player, staff, badge (3 parts), kit, skill upgrade, super skill upgrade, scout, injury improvement, practice, cash, ad logo. 4 pack levels: Bronze/Silver/Gold/Platinum mapping to Common/Rare/Epic/Legendary. Configurable drop rates per pack (PlayerChance, StaffChance, etc.). Progress tracking during opening.",
    "legacyFiles": [
      "Server/Data/BoosterPack.cs:1-2672"
    ],
    "gapAnalysis": "Both have complete pack systems. Legacy has more card types (11 vs ~5) and pack level tiers (Bronze-Platinum). FM2026 has cleaner SOL-based pricing.\n\nFM2026 MISSING:\n- Cash card type (direct currency reward)\n- Ad logo card type\n- Super skill upgrade variant\n- Pack level naming (Bronze/Silver/Gold/Platinum)\n\nNot a critical gap \u2014 different but both functional.",
    "codeSuggestions": "No critical fix needed. Consider adding cash cards as pack contents for economy bootstrapping."
  },
  {
    "id": "gf-003-financial-economy",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Financial Economy / Revenue Model",
    "existsInFM2026": "no",
    "existsInLegacy": "no",
    "priority": "P0",
    "status": "open",
    "fm2026Details": "Club balance initialized to 100,000 in model.js but NEVER modified. No revenue streams (gate receipts, merchandise, sponsorship). No expenses (wages, transfers, stadium). Balance is purely cosmetic. fan_base=10, stadium_capacity=1000 \u2014 stored but unused.",
    "fm2026Files": [
      "api/model.js:334",
      "api/model.js:315-316"
    ],
    "legacyDetails": "TheBoardroom.cs (110 lines) defines the framework but ALL functions are commented out or empty: TakeGateReceipts(), PayAllWages(), PayWages(), TransferFeeReceived(), TransferFeePaid(), EndOfSeasonPrizeMoney(), CupPrizeMoney(). m_bankBalance field exists in Club.cs but AlterClubBankBalance() is commented out.",
    "legacyFiles": [
      "Server/ManagementLogic/TheBoardroom.cs:1-110",
      "Server/Data/Club.cs"
    ],
    "gapAnalysis": "NEITHER engine has a working financial economy. Both have the data structure (balance, fan_base, stadium_capacity) but zero functional logic. This is a CRITICAL gap for both.\n\nNeeded:\n- Gate receipt calculation (capacity * attendance * ticket price)\n- Weekly wage payments\n- Transfer fee flow\n- Prize money per league position\n- Sponsorship revenue\n- Merchandise income based on fan base",
    "codeSuggestions": "// New file: api/services/financeService.js\nfunction processWeeklyFinances(club) {\n  const income = calculateGateReceipts(club) + calculateSponsorship(club);\n  const expenses = calculateWages(club);\n  club.balance += income - expenses;\n}\n\nfunction calculateGateReceipts(club) {\n  const attendance = Math.min(club.stadium_capacity, club.fan_base * 0.8);\n  const ticketPrice = 25; // base price\n  return Math.round(attendance * ticketPrice);\n}\n\nfunction calculateWages(club) {\n  return club.players.reduce((sum, p) => sum + (p.wage || 0), 0);\n}"
  },
  {
    "id": "gf-004-transfer-market",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Transfer Market",
    "existsInFM2026": "partial",
    "existsInLegacy": "partial",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "All transfers via NFT marketplace (marketplaceService.js). sell() lists player with price, buy() with 5-minute lock to prevent sniping. Free cards cannot be sold. Ownership transfer updates club, previous_club, signed_at. No traditional transfer market, no AI bidding, no negotiation, no agent fees.",
    "fm2026Files": [
      "api/services/marketplaceService.js:67-187"
    ],
    "legacyDetails": "Offer.cs (31 lines) defines basic bid system: playerID, offerAmount, bidTeam, bidWhen, offerType (bid/enquiry), bidLength (loan). 5-day offer timeout in EmailManager. No auction system. No AI bidding logic visible. Basic offer/counter-offer only.",
    "legacyFiles": [
      "Server/Data/Offer.cs:1-31",
      "Server/ManagementLogic/EmailManager.cs"
    ],
    "gapAnalysis": "Both have partial transfer systems with different approaches:\n- FM2026: NFT marketplace (P2P, no AI involvement)\n- Legacy: Traditional offer system (but basic, no AI bidding)\n\nBOTH MISSING:\n- AI club bidding logic\n- Player valuation algorithm\n- Negotiation system\n- Release clauses\n- Loan system (Legacy has loan enquiry type, FM2026 has none)\n- Transfer windows\n- Agent fees",
    "codeSuggestions": "// Add player valuation to marketplaceService.js:\nfunction estimatePlayerValue(player) {\n  const ageMultiplier = player.age < 22 ? 1.3 : player.age > 30 ? 0.6 : 1.0;\n  const rarityMultiplier = { free: 0.1, regular: 0.5, rare: 1.0, epic: 2.0, legendary: 5.0 };\n  const baseValue = player.stars * 10000;\n  return Math.round(baseValue * ageMultiplier * (rarityMultiplier[player.rarity] || 1.0));\n}"
  },
  {
    "id": "gf-005-nft-operations",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "NFT / Blockchain Integration",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "Solana blockchain (devnet) via nftService.js. Metaplex Token Metadata standard. Candy Machine v2 for pack sales. issueNFTCard(), transferNFT(), deleteNFTById() (burns). Helius RPC. Metadata at server.football.vpltd.com. Full minting for all card types. DISABLED: Constants.NFTEnabled = false.",
    "fm2026Files": [
      "api/services/nftService.js:75-308",
      "api/constants.js:27"
    ],
    "legacyDetails": "UltraIO blockchain via NFTMarketplaceController.cs (425 lines) and UltraIOAPIController.cs. RegisterToken() mints NFTs. TokenMeta tracks tokenId, factoryId, contentType (player/staff/item/pack). RestorePurchases() for blockchain recovery. DISABLED: Extensions.EnabledNFTLogic flag.",
    "legacyFiles": [
      "Server/Controllers/NFTMarketplaceController.cs:1-425",
      "Server/Controllers/UltraIOAPIController.cs"
    ],
    "gapAnalysis": "Both have complete NFT systems, both disabled by feature flags. Different blockchains:\n- FM2026: Solana + Metaplex\n- Legacy: UltraIO\n\nNo functional gap \u2014 both are feature-complete but turned off. Parity.",
    "codeSuggestions": "No fix needed. Both systems work when enabled. Consider making NFT optional per-deployment rather than global flag."
  },
  {
    "id": "gf-006-league-system",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "League System / Divisions",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "competitionsService.js: createLeague(), beginNewSeason(), processLeagueRanks(). League types: Rookie, General (multiple divisions), Premier, Cup (stub), Golden (stub). 16 clubs per league. 38-week seasons (76 in-game days). Top 20% promoted from General. Round-robin scheduling (home & away). Division history tracking. Auto-creates new General leagues as needed.",
    "fm2026Files": [
      "api/services/competitionsService.js:63-267"
    ],
    "legacyDetails": "LeagueManager.cs (339 lines) + FixtureListManager.cs (44,936 lines!). 8 divisions, 16 teams each. 30 match weeks per season. League table: wins/draws/losses/GF/GA/points/GD. Promotion/relegation + play-offs (rounds 31+). 10-year historical records per club. Weekend=league, Midweek=cup scheduling.",
    "legacyFiles": [
      "Server/ManagementLogic/LeagueManager.cs:1-339",
      "Server/ManagementLogic/FixtureListManager.cs"
    ],
    "gapAnalysis": "Both have complete league systems. Key differences:\n- FM2026: 38 weeks, dynamic league creation, multiple league types\n- Legacy: 30 weeks, fixed 8 divisions, play-off system\n\nFM2026 MISSING:\n- Play-off system for promotion (Legacy has rounds 31+)\n- Fixed division hierarchy (8 tiers)\n- 10-year historical records (FM2026 tracks but less granularly)\n- Weekend/midweek scheduling split\n\nFM2026 BETTER:\n- Dynamic league creation (scales with player count)\n- Multiple league types (Rookie for onboarding)\n- Longer seasons (38 vs 30 weeks)",
    "codeSuggestions": "Consider adding play-off system:\n// In competitionsService.js after processLeagueRanks():\nfunction createPlayoffs(league, positions) {\n  // Teams in positions 3-6 enter play-offs\n  const playoffTeams = positions.slice(2, 6);\n  // Semi-final: 3rd vs 6th, 4th vs 5th\n  // Final: winners play for last promotion spot\n}"
  },
  {
    "id": "gf-007-cup-competitions",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Cup Competitions",
    "existsInFM2026": "no",
    "existsInLegacy": "yes",
    "priority": "P0",
    "status": "open",
    "fm2026Details": "checkForStartCup() exists in matchesService.js (line 314) but is EMPTY. LeagueType.Cup defined in model.js but unused. No knockout tournament logic, no cup draw system, no cup scheduling.",
    "fm2026Files": [
      "api/services/matchesService.js:314",
      "api/model.js:142"
    ],
    "legacyDetails": "CupManager.cs (439 lines). 10 configurable rounds. Knockout format with seeding by division. Two-leg tie support. Extra time and penalties configurable per round. DomesticCupDraw() for automatic draws. Prize money per round (winnings/losings). Cup honors tracking (winners/runners-up).",
    "legacyFiles": [
      "Server/ManagementLogic/CupManager.cs:1-439"
    ],
    "gapAnalysis": "CRITICAL GAP. FM2026 has zero cup competition functionality \u2014 only a stub function. Legacy has a complete knockout cup system with configurable rounds, seeding, two-leg ties, and prize money.\n\nThis significantly reduces game variety and engagement. League-only gameplay becomes repetitive.",
    "codeSuggestions": "// New: api/services/cupService.js\nfunction createCup(world, name, rounds) {\n  const cup = { id: uuid(), name, rounds, currentRound: 0, fixtures: [], honors: [] };\n  return cup;\n}\n\nfunction drawRound(cup, teams) {\n  // Seed by division rank, random within seed groups\n  const shuffled = teams.sort(() => Math.random() - 0.5);\n  const fixtures = [];\n  for (let i = 0; i < shuffled.length; i += 2) {\n    fixtures.push({ home: shuffled[i], away: shuffled[i+1], round: cup.currentRound });\n  }\n  cup.fixtures.push(...fixtures);\n  return fixtures;\n}\n\nfunction advanceCup(cup, results) {\n  const winners = results.map(r => r.homeGoals > r.awayGoals ? r.home : r.away);\n  cup.currentRound++;\n  if (winners.length === 1) { cup.honors.push({ winner: winners[0], season: currentSeason }); return; }\n  return drawRound(cup, winners);\n}"
  },
  {
    "id": "gf-008-scout-system",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Scout System",
    "existsInFM2026": "no",
    "existsInLegacy": "no",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "BoosterType.Scout defined in model.js. Scout cards can be generated in packs. No scouting logic implemented \u2014 no player discovery, no scouting reports, no youth scouting.",
    "fm2026Files": [
      "api/model.js:164"
    ],
    "legacyDetails": "Scout card type exists in BoosterPack.cs. CreateScoutCard() method generates scout cards. ScoutChance field in ShopPackInfo. But NO scouting logic found \u2014 cards exist as items with no gameplay effect.",
    "legacyFiles": [
      "Server/Data/BoosterPack.cs"
    ],
    "gapAnalysis": "NEITHER engine has functional scouting. Both generate scout cards as collectible items but neither uses them for player discovery or reporting.\n\nNeeded:\n- Scout report generation (view hidden stats of players)\n- Youth talent discovery\n- Transfer target identification\n- Scout quality affects report accuracy",
    "codeSuggestions": "// New: api/services/scoutService.js\nfunction scoutPlayer(scoutCard, targetPlayer) {\n  const accuracy = scoutCard.attributes.ability / 100;\n  const report = {};\n  for (const [stat, value] of Object.entries(targetPlayer.attributes)) {\n    const noise = Math.round((1 - accuracy) * 10 * (Math.random() - 0.5));\n    report[stat] = Math.max(0, Math.min(100, value + noise));\n  }\n  return { playerId: targetPlayer.id, report, accuracy, date: new Date() };\n}"
  },
  {
    "id": "gf-009-pvp-system",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "PvP System / Multiplayer",
    "existsInFM2026": "partial",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "Match queue via MatchesRunner. MatchType.Pvp defined and distinguishable. Match results saved. No matchmaking logic, no lobby system, no PvP scheduling/invitations, no ranking/ELO system.",
    "fm2026Files": [
      "api/services/matchesService.js:59-65",
      "api/model.js:125"
    ],
    "legacyDetails": "PvpMatchesController.cs (1,800+ lines). Full implementation: InviteToMatch(), JoinQuickPlayLobby() with matchmaking (10-second intervals). PvpMatchLevel tiers with entry fees/rewards. Match history (last 20-100). GetUsersRanking() with points calculation. Cross-world PvP. Payment integration. States: Created/InProgress/Finished/Canceled.",
    "legacyFiles": [
      "Server/Controllers/PvpMatchesController.cs:1-1800"
    ],
    "gapAnalysis": "MAJOR GAP. FM2026 can run PvP matches but has no player-facing infrastructure. Legacy has a complete PvP system with:\n- Matchmaking lobby with automatic pairing\n- Invitation system\n- Tiered match levels with entry fees\n- Ranking/points system\n- Match history\n- Cross-world play",
    "codeSuggestions": "// New: api/services/pvpService.js\nconst lobby = new Map(); // userId -> { joinedAt, rating }\n\nfunction joinLobby(userId, rating) {\n  lobby.set(userId, { joinedAt: Date.now(), rating });\n}\n\nfunction matchmake() {\n  const players = [...lobby.entries()].sort((a, b) => a[1].rating - b[1].rating);\n  const matches = [];\n  for (let i = 0; i + 1 < players.length; i += 2) {\n    if (Math.abs(players[i][1].rating - players[i+1][1].rating) < 200) {\n      matches.push({ home: players[i][0], away: players[i+1][0] });\n      lobby.delete(players[i][0]);\n      lobby.delete(players[i+1][0]);\n    }\n  }\n  return matches;\n}"
  },
  {
    "id": "gf-010-tutorial",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Tutorial / Onboarding",
    "existsInFM2026": "no",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "Welcome email system only (Constants.WelcomeEmailKey). No tutorial missions, no guided onboarding, no achievement tracking for progression.",
    "fm2026Files": [
      "api/services/newsService.js",
      "api/constants.js:20"
    ],
    "legacyDetails": "TutorialManager.cs (200+ lines). Step-by-step tutorial definitions (TutorialData). Multiple tutorial sequences. Progress tracking (finishedTutorials cached locally). Forward/back navigation. UI element highlighting (SetHighlightForElement()). Skip option. Analytics tracking for completion.",
    "legacyFiles": [
      "Client/Core/TutorialManager.cs"
    ],
    "gapAnalysis": "MAJOR GAP. FM2026 has only a welcome email. Legacy has a full interactive tutorial system with step-by-step guidance, UI highlighting, progress tracking, and skip option.\n\nCritical for player retention \u2014 new users need guidance through squad management, tactics, packs, etc.",
    "codeSuggestions": "// Tutorial could be client-side (Unity) rather than server-side.\n// Server needs: track tutorial completion per user\n// In usersService.js or new tutorialService.js:\nfunction completeTutorial(userId, tutorialId) {\n  const user = await getUser(userId);\n  if (!user.completedTutorials) user.completedTutorials = [];\n  if (!user.completedTutorials.includes(tutorialId)) {\n    user.completedTutorials.push(tutorialId);\n    await saveUser(user);\n  }\n}"
  },
  {
    "id": "gf-011-player-upgrades",
    "date": "2026-02-13T12:00:00Z",
    "category": "gameFeature",
    "feature": "Player Upgrades / Stat Boosts",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "FIXED (13 Feb). upgradeInternal() shared method with rolePriorityStats mapping: 10 player roles \u00d7 3 priority stats (e.g. Striker: shooting+control+dribbling). Priority pool shuffled first in weighted list. Stars/star_percent recalculated after every upgrade. Rarity recalculated \u2014 if changed, NFT metadata updated on-chain. Sacrifice mechanic: 30% of stat difference transferable. Rarity-scaled multipliers: Regular 5%, Rare 10%, Epic 15%, Legendary 25%.",
    "fm2026Files": [
      "api/services/upgradesService.js:12-191"
    ],
    "legacyDetails": "UpgradeCardInfo.cs (56 lines). UpgradeStaff type for 8 staff attributes. UpgradePlayerFatigue for fitness. Applied via card consumption. Training.cs (49 lines) handles individual training (10 types) and team training (9 types). Training bonuses stored on Club and affect match engine performance.",
    "legacyFiles": [
      "Server/Data/UpgradeCardInfo.cs:1-56",
      "Server/Data/Training.cs:1-49"
    ],
    "gapAnalysis": "CRITICAL BUG makes FM2026 upgrades harmful \u2014 random stat selection means upgrades often boost irrelevant stats. Legacy's card-based upgrades are simpler but correctly targeted.\n\nFM2026 MISSING:\n- Role-relevant stat targeting\n- Stars recalculation post-upgrade\n- Player fatigue upgrade card type\n\nFM2026 BETTER:\n- Rarity-scaled multipliers (5-25%)\n- Sacrifice/combine system (Legacy lacks)",
    "codeSuggestions": "// Fix BUG-001 in upgradesService.js upgradePlayer():\n// Replace random stat selection with role-relevant selection:\nconst roleStats = getRoleRelevantStats(player.role);\n// e.g. Striker: ['shooting', 'finishing', 'heading', 'pace', 'dribbling']\nconst statsToBoost = roleStats.slice(0, boostCount);\n// Instead of: stats.sort(() => random).slice(0, boostCount)"
  },
  {
    "id": "gf-012-coach-trainer",
    "date": "2026-02-13T12:00:00Z",
    "category": "gameFeature",
    "feature": "Coach / Trainer System",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "FIXED (13 Feb). BUG-003/004/006 all resolved. Trainer abilityScore() changed from max-of-all to average-of-3 role-specific stats (Coach: ability+keeping+technicality/3, Physio: footwork+physicality+sprinting/3). RarityStatsBonus system applied to trainer generation with role-based ranges. Role-priority stat mapping for upgrades (Coach: ability+keeping+technicality, Physio: footwork+physicality+sprinting). Stars/star_percent recalculated after upgrade.",
    "fm2026Files": [
      "api/services/squadService.js:250-275",
      "api/services/trainingService.js"
    ],
    "legacyDetails": "Staff.cs (250+ lines) + CreateStaffData() in StatCreator.cs. Coach and Physio roles. 8 attributes (ability, attacking, defending, distribution, footwork, keeping, physicality, sprinting, technicality). Same rarity system as players. 2 training specializations randomly assigned per coach.",
    "legacyFiles": [
      "Server/Data/Staff.cs:1-250",
      "Server/ManagementLogic/StatCreator.cs"
    ],
    "gapAnalysis": "Both have similar coach/trainer systems. Same bugs in FM2026 (rarity-blind generation, random upgrade stats).\n\nFM2026 MISSING:\n- Training specialization assignment (Legacy randomly picks 2)\n- Rarity-scaled stats at generation\n\nOtherwise equivalent functionality.",
    "codeSuggestions": "Fix BUG-006 same as BUG-005: apply rarity multipliers to trainer stat generation.\nFix BUG-003/004: use role-relevant stats for coach upgrades."
  },
  {
    "id": "gf-013-training-system",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Training System",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "trainingService.js: processDailyTraining() via cron. Individual training (7 categories: Attacking, Defending, Technicality, Physicality, Distribution, Sprinting, Footwork). Team training (8 set-piece drills: Corners, FKs, Penalties, Throw-ins, Crossing, Transitions, Back Four, Back Five). Trainer impact calculated. Fitness/injury recovery. Effectiveness based on trainer-to-player ratio. Training history tracked. Practice matches via boosters.",
    "fm2026Files": [
      "api/services/trainingService.js:43-160"
    ],
    "legacyDetails": "Training.cs (49 lines). Individual training (10 types: leftside, rightside, technical, physical, keeping, defending, passing, sprinting, shooting). Team training (9 types: corners, freekicks, penalties, throw_ins, crossing, transitions, backthree, backfour, backfive). Training bonuses stored on Club and affect match engine directly.",
    "legacyFiles": [
      "Server/Data/Training.cs:1-49"
    ],
    "gapAnalysis": "FM2026 is MORE COMPLETE here: automatic daily processing, trainer effectiveness calculation, fitness recovery integration, practice match system, training history.\n\nFM2026 has 7 individual + 8 team = 15 types.\nLegacy has 10 individual + 9 team = 19 types.\n\nFM2026 MISSING: leftside/rightside training, keeping-specific training, shooting-specific training (has broader categories instead).\nFM2026 BETTER: automatic cron-based, trainer quality matters, practice matches.",
    "codeSuggestions": "No critical fix needed. FM2026 training is well-implemented.",
    "exceedsLegacy": true
  },
  {
    "id": "gf-014-squad-management",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Squad Management",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "squadService.js: formInitialSquad(), SquadSettings model. 11-player starting XI with position mapping. 4 default formations (4-4-2, 4-3-3, 4-3-1-2, 3-4-3). Captain selection. Custom vs factory tactics. Substitution system via match engine.",
    "fm2026Files": [
      "api/services/squadService.js:383-393",
      "api/services/matchesService.js:285-302"
    ],
    "legacyDetails": "Club.cs (963 lines). m_individualList for squad (18 players). Match shirts 1-18 numbering. 4 tactical banks (TACTICS_NO=4). Captain designation. Set piece takers: penalty, free kick, right/left corner. Substitution queue with injury time.",
    "legacyFiles": [
      "Server/Data/Club.cs:1-963"
    ],
    "gapAnalysis": "Both fully functional. FM2026 MISSING:\n- Set piece taker designation (penalty, FK, corner takers)\n- 18-man match day squad limit\n- Shirt numbering system\n\nFM2026 BETTER:\n- More default formations\n- Custom tactic creation",
    "codeSuggestions": "// Add set piece taker designation to SquadSettings:\nsettings.penaltyTaker = playerId;\nsettings.freeKickTaker = playerId;\nsettings.cornerTakerLeft = playerId;\nsettings.cornerTakerRight = playerId;"
  },
  {
    "id": "gf-015-season-management",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Season / Calendar Management",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "timeService.js: performNewDay() via cron (00:00 and 12:00 UTC). 38-week seasons. Automatic season end with promotion/relegation and stats reset. Dynamic fixture generation. Daily training processing. League history snapshots. Force-next-day endpoint (/service/nextDay).",
    "fm2026Files": [
      "api/services/timeService.js:72-227"
    ],
    "legacyDetails": "GameWorld.cs (4,425 lines). GameWeekDateFormat: day (0=weekend, 1=midweek), week (1-30, 31+ playoffs), season (year). AdvanceAGameDay() with configurable interval. Weekend=league, midweek=cup. Season end: promotion/relegation, prize money, records.",
    "legacyFiles": [
      "Server/ManagementLogic/GameWorld.cs:1-4425"
    ],
    "gapAnalysis": "Both complete. Key differences:\n- FM2026: real-time cron (twice daily), 38 weeks\n- Legacy: configurable interval, 30 weeks + playoffs, weekend/midweek split\n\nFM2026 MISSING:\n- Weekend vs midweek distinction\n- Playoff weeks\n- Configurable advance interval\n\nFM2026 BETTER:\n- Real-time progression (cron)\n- Longer seasons\n- Force-advance endpoint for testing",
    "codeSuggestions": "No critical fix needed.",
    "exceedsLegacy": true
  },
  {
    "id": "gf-016-achievements-rewards",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Achievements / Rewards System",
    "existsInFM2026": "partial",
    "existsInLegacy": "partial",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "rewardWithCardsPack() in cardsService.js can award free packs. No achievement tracking, no milestones, no daily rewards, no season rewards. Used only for testing/admin.",
    "fm2026Files": [
      "api/services/cardsService.js:364-391"
    ],
    "legacyDetails": "GiveNFTPackReward() in GameWorld.cs. Match rewards: Winner (2002), Runner-up (2001), Big winner (2003), Loser (2000) packs. Cup final rewards. AddToReputation() (50 pts for cup win). No daily rewards, no achievement tracking, no milestone system.",
    "legacyFiles": [
      "Server/ManagementLogic/GameWorld.cs"
    ],
    "gapAnalysis": "Both are minimal. Legacy has match result rewards (winner/loser packs) and reputation system. FM2026 has pack reward infrastructure but no triggers.\n\nBOTH MISSING:\n- Achievement tracking system\n- Daily login rewards\n- Season-end prizes based on league position\n- Milestone rewards (first win, 100 goals, etc.)\n- Man of the match rewards",
    "codeSuggestions": "// Add match rewards to matchesService.js after match completion:\nfunction awardMatchRewards(match, result) {\n  const winnerId = result.homeGoals > result.awayGoals ? match.homeClub : match.awayClub;\n  const loserId = result.homeGoals > result.awayGoals ? match.awayClub : match.homeClub;\n  if (winnerId) rewardWithCardsPack(winnerId, 2002); // winner pack\n  if (loserId) rewardWithCardsPack(loserId, 2000); // consolation pack\n}"
  },
  {
    "id": "gf-017-club-management",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Club Management / Customization",
    "existsInFM2026": "partial",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "clubService.js: createClub(), updateClub(). Name, nickname, stadium editable. 3-layer badge (background/midground/foreground). Home/away kits (shirt/shorts/socks/boots). Balance, fan_base, stadium_capacity stored but unused. Division history tracked. Win/loss/draw stats. Random club naming.",
    "fm2026Files": [
      "api/services/clubService.js:53-91"
    ],
    "legacyDetails": "Club.cs (963 lines). Same customization: name, nickname, stadium, 3-part badge (NFT-based), home/away kits (NFT-based), DNA strings for visual identity. Stadium capacity, fan base. 10-year records (biggest win/loss, record signing, record gate). WDL by home/away.",
    "legacyFiles": [
      "Server/Data/Club.cs:1-963"
    ],
    "gapAnalysis": "Similar feature set. Both cosmetic-only \u2014 no stadium upgrades, no facilities.\n\nFM2026 MISSING:\n- Record tracking (biggest win, record signing, etc.)\n- Home/away WDL split\n- DNA visual identity strings\n- 10-year history depth\n\nNEITHER HAS:\n- Stadium upgrades\n- Training facilities\n- Youth academy buildings\n- Reputation system (both store fan_base but don't use it)",
    "codeSuggestions": "// Add records tracking to eventController or matchesService:\nfunction updateClubRecords(club, matchResult) {\n  const goalDiff = matchResult.goalsFor - matchResult.goalsAgainst;\n  if (goalDiff > (club.records?.biggestWin || 0)) club.records.biggestWin = goalDiff;\n  if (goalDiff < (club.records?.biggestLoss || 0)) club.records.biggestLoss = goalDiff;\n}"
  },
  {
    "id": "gf-018-youth-academy",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Youth Academy",
    "existsInFM2026": "no",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "No youth academy service, no youth player generation, no youth development system. Scout booster exists but unused.",
    "fm2026Files": [],
    "legacyDetails": "No youth academy implementation. UltraIOAPIController.cs has a comment referencing 'Youth development' but no code. Zero matches for youth academy in codebase.",
    "legacyFiles": [],
    "gapAnalysis": "NEITHER engine has a youth academy. This is a common feature in football management games but both codebases lack it entirely.\n\nWould need:\n- Youth intake events (seasonal)\n- Youth player generation (lower stats, higher potential)\n- Youth development training\n- Youth promotion to first team",
    "codeSuggestions": "// Future: api/services/youthService.js\n// Youth intake: once per season, generate 3-5 young players (age 16-17)\n// Youth development: daily training improves stats faster than senior players\n// Promotion: move from youth squad to first team squad"
  },
  {
    "id": "gf-019-player-contracts",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Player Contracts / Wages",
    "existsInFM2026": "no",
    "existsInLegacy": "partial",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "wage field exists in model.js (line 410 for players, line 996 for trainers). signed_at tracked. No contract length, no expiry dates, no negotiation, no wage payment system, no renewal logic.",
    "fm2026Files": [
      "api/model.js:410",
      "api/model.js:418",
      "api/model.js:996"
    ],
    "legacyDetails": "Individual.cs (1,750 lines). m_wage (weekly int), m_signedYear (short), m_previousClub (string). Wages tracked but PayWages() is commented out in TheBoardroom.cs. No contract length, no expiry, no renewal, no release clauses.",
    "legacyFiles": [
      "Server/Data/Individual.cs:1-1750",
      "Server/ManagementLogic/TheBoardroom.cs"
    ],
    "gapAnalysis": "Both have wage data but neither processes it. Legacy is slightly ahead (has signed year tracking, previous club).\n\nBOTH MISSING:\n- Contract length/expiry\n- Contract negotiation\n- Wage payment deduction from balance\n- Contract renewal flow\n- Release clauses\n- Free agent status on expiry",
    "codeSuggestions": "// Add contract model to model.js:\n// player.contractEnd = seasonNumber + contractLength;\n// In timeService.js checkSeasons():\nfunction checkContractExpiry(players, currentSeason) {\n  for (const p of players) {\n    if (p.contractEnd && p.contractEnd <= currentSeason) {\n      p.contractStatus = 'FREE_AGENT';\n      // Notify club via email\n    }\n  }\n}"
  },
  {
    "id": "gf-020-sponsorship",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Sponsorship / Revenue Streams",
    "existsInFM2026": "no",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "No sponsorship service, no revenue generation, no sponsor deals.",
    "fm2026Files": [],
    "legacyDetails": "Only 'sponsor' reference found in StringManager.cs (localization). No sponsorship system, no deals, no contracts.",
    "legacyFiles": [],
    "gapAnalysis": "NEITHER engine has sponsorship. Would be part of the financial economy system.\n\nWould need: sponsor tiers, contract duration, revenue per match, sponsor logo placement.",
    "codeSuggestions": "// Part of broader financeService.js:\nfunction calculateSponsorship(club) {\n  const divisionBonus = [5000, 4000, 3000, 2000, 1500, 1000, 750, 500];\n  return divisionBonus[club.division] || 500;\n}"
  },
  {
    "id": "gf-021-user-accounts",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "User Accounts / Authentication",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "usersController.js + usersService.js. JWT authentication (token-based). Registration creates user + club + initial squad. User profile with user_id, public_key (for NFT). Session management via keepAlive. Secure data flag (currently false).",
    "fm2026Files": [
      "api/controllers/usersController.js",
      "api/services/usersService.js"
    ],
    "legacyDetails": "PlayersController.cs (500 lines) + UserManager.cs. Email/password OR UltraIO OAuth (JWT). SignUp() with club/world selection. SignIn() with session management. Password reset. Multi-world support. Character configuration visual customization. Currency geo-detection (GBP/EUR/USD). Manual vs UltraIO account types.",
    "legacyFiles": [
      "Server/Controllers/PlayersController.cs:1-500",
      "Server/Data/UserManager.cs"
    ],
    "gapAnalysis": "Both functional. Legacy has more features:\n- Password reset (FM2026 missing)\n- Multi-world support\n- Character visual customization\n- Currency geo-detection\n- OAuth integration (UltraIO)\n\nFM2026 MISSING:\n- Password reset endpoint\n- Multi-world support\n- Character customization\n- Currency localization",
    "codeSuggestions": "// Add password reset to usersController.js:\nrouter.post('/reset-password', async (req, res) => {\n  const { email } = req.body;\n  const user = await findUserByEmail(email);\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  const token = generateResetToken();\n  await sendResetEmail(email, token);\n  res.json({ success: true });\n});"
  },
  {
    "id": "gf-022-news-email",
    "date": "2026-02-13T12:00:00Z",
    "category": "gameFeature",
    "feature": "News / Email Inbox System",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P3",
    "status": "resolved",
    "fm2026Details": "UPDATED (13 Feb). newsService.js: Email inbox per club. News feed (general/global). Email types: General, Club, League, Cup. 12 EmailSubType values: Unknown, Welcome, Injury, TransferPlayer, TransferTrainer, ContractExpiredPlayer, ContractExpiredTrainer, UpgradeTrainer, UpgradePlayer, PackReward, PvPRequest, PvPResponse. Read/unread tracking. Email deletion. Author tracking.",
    "fm2026Files": [
      "api/services/newsService.js"
    ],
    "legacyDetails": "EmailManager.cs (37,895 lines!). Comprehensive email system. Transfer offers via email. Match notifications. PvP invitations. News updates. Media.cs generates 40+ story types: position changes, match results (close/big/comfortable win), cup stories, play-off stories.",
    "legacyFiles": [
      "Server/ManagementLogic/EmailManager.cs",
      "Server/ManagementLogic/Media.cs"
    ],
    "gapAnalysis": "Legacy is significantly more comprehensive (37,895 lines vs basic service). FM2026 MISSING:\n- Transfer offer emails\n- Match result notifications\n- Media stories (40+ types)\n- Position change notifications\n- Cup/playoff stories\n- PvP invitation emails",
    "codeSuggestions": "// Add match result email generation:\nfunction generateMatchResultEmail(club, result) {\n  const won = result.goalsFor > result.goalsAgainst;\n  const diff = Math.abs(result.goalsFor - result.goalsAgainst);\n  let type = won ? (diff >= 3 ? 'big_win' : 'win') : (diff >= 3 ? 'big_loss' : 'loss');\n  return { type: 'match_result', subject: `${result.goalsFor}-${result.goalsAgainst} vs ${result.opponent}`, body: type };\n}"
  },
  {
    "id": "gf-023-leaderboards",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Leaderboards / Top Players",
    "existsInFM2026": "yes",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "getTopPlayers(type) in squadService.js (lines 113-221). Leaderboard types: Goals, Assists, Clean Sheets, Man of the Match, Bad Boy (cards), Form, Quickest (speed). Best by position (10 positions). Leadership (composite score). Comprehensive with 17+ leaderboard categories.",
    "fm2026Files": [
      "api/services/squadService.js:113-221"
    ],
    "legacyDetails": "Basic league table system in LeagueManager.cs. Player stats aggregated in Team.cs. No dedicated leaderboard service visible. Stats tracked per player but no ranking/sorting API found.",
    "legacyFiles": [
      "Server/ManagementLogic/LeagueManager.cs"
    ],
    "gapAnalysis": "FM2026 is MORE COMPLETE with dedicated leaderboard service covering 17+ categories. Legacy tracks stats but lacks a leaderboard API.\n\nFM2026 BETTER:\n- 17+ leaderboard types\n- Position-specific rankings\n- Composite scores (Leadership)\n- Form tracking",
    "codeSuggestions": "No fix needed. FM2026 leaderboards are comprehensive.",
    "exceedsLegacy": true
  },
  {
    "id": "gf-024-search",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Search System",
    "existsInFM2026": "yes",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "searchService.js: Pattern-based search with type filtering (players, trainers, clubs, etc.). Simple pattern matching.",
    "fm2026Files": [
      "api/services/searchService.js"
    ],
    "legacyDetails": "No dedicated search service found. Player/club lookup via direct database queries in controllers.",
    "legacyFiles": [],
    "gapAnalysis": "FM2026 has a dedicated search service (basic). Legacy uses direct DB queries. Neither has advanced search (filters by stat range, age, position, etc.).\n\nBOTH MISSING:\n- Advanced filters (stat range, age, position, rarity)\n- Transfer target search\n- Similar player search",
    "codeSuggestions": "// Enhance searchService.js with filters:\nfunction advancedSearch(filters) {\n  let query = players;\n  if (filters.role) query = query.filter(p => p.role === filters.role);\n  if (filters.minAge) query = query.filter(p => p.age >= filters.minAge);\n  if (filters.rarity) query = query.filter(p => p.rarity === filters.rarity);\n  if (filters.minStat) query = query.filter(p => p.stars >= filters.minStat);\n  return query.sort((a, b) => b.stars - a.stars);\n}"
  },
  {
    "id": "gf-025-analytics",
    "date": "2026-02-10T16:58:27Z",
    "category": "gameFeature",
    "feature": "Analytics / Player Statistics",
    "existsInFM2026": "no",
    "existsInLegacy": "partial",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "analyticsController.js defines playerDetails() and clubDetails() endpoints but they are EMPTY \u2014 no implementation.",
    "fm2026Files": [
      "api/controllers/analyticsController.js"
    ],
    "legacyDetails": "Per-player stats tracked in Team.cs: passesCompleted, passesMade, touches, crosses, assists, shotsMade, shotsOnTarget, goals, fouled, foulsMade, offside, headersWon, red, yellow, tacklesMade, tacklesWon, goalsConceded, saves. Aggregated per season.",
    "legacyFiles": [
      "Server/Data/Club.cs",
      "Server/ManagementLogic/GameWorld.cs"
    ],
    "gapAnalysis": "FM2026 has analytics routes but zero implementation. Legacy tracks 18+ per-player stats across seasons. FM2026's match engine DOES track stats (in eventController) but there's no API to serve historical analytics to the client.\n\nNeed: aggregate match stats into season/career totals, serve via analytics endpoints.",
    "codeSuggestions": "// Implement analyticsController.js:\nasync function playerDetails(req, res) {\n  const player = await getPlayer(req.params.id);\n  const matches = await getPlayerMatchHistory(player.id);\n  const career = aggregateStats(matches);\n  res.json({ player, seasonStats: career.currentSeason, careerStats: career.total });\n}"
  },
  {
    "id": "cmp-039-formation-discipline",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Formation Position Discipline",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "exceedsLegacy": true,
    "fm2026Details": "[RESOLVED 11 Feb] Comprehensive formation discipline system now implemented. Defensive line: calculateDefensiveLine() finds deepest CB/LB/RB/WB. Formation anchoring: 95% stickiness for players >40m from ball, blend 10-40m. Tactical squeeze out-of-possession: Z-compression 0.85-0.92, X-compression 0.80-0.90. Hard depth constraints: CB min -35m, FB/WB min -28m. Holdshape enforcement: caps movement to 5m from formation pos. Retrieval urgency: clamp((dist-5)/15, 0, 1), suppresses sway during retrieval. Gap finding for ST/W in attacking half. Asymmetric midfielder support. Tactical throttle: 0.5s recalculation, 0.9s transition cache.",
    "fm2026Files": [
      "supportController.js:107-364",
      "aiOffBall.js:46-190",
      "tacticsController.js:19-38",
      "movementController.js:88",
      "playerAIController.js:404"
    ],
    "legacyDetails": "Grid look-up system: 30-cell BallGrid (6x5) with pre-calculated positions per defender per ball location. Dual position sets (in-possession vs out-of-possession) \u2014 defenders snap to defensive grid on transition. CalcLastMan() tracks deepest defender; no defender can drift behind the line. Training-based synchronization (m_training_back4) controls line cohesion. Out-of-possession compression: 0.60-0.70 (strong). RunSlide array caps defender forward runs: {0.1, 0.2, 0.35, 0.55, 0.75, 1.0} \u2014 when ball is deep, defenders get only 10% run distance. holdshape flag fully enforced \u2014 disables all squeeze/spread. Continuous re-targeting every brain cycle (10-500ms based on intelligence). Offside clamping via intelligence/agility stats.",
    "legacyFiles": [
      "Tactics.cs:100-208",
      "Player.cs:2115-2338",
      "PlayerActions.cs:63-200",
      "Team.cs:1756-1790",
      "Team.cs:2690-2720",
      "PlayerActions.cs:3283"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] All 6 weaknesses addressed. FM2026 NOW EXCEEDS LEGACY: (1) Defensive line cohesion via calculateDefensiveLine(). (2) Compression strengthened. (3) Anchoring with distance-based stickiness. (4) Defenders excluded from attacking runs. (5) Holdshape fully enforced (5m radius). (6) Hard depth constraints (CB -35m, FB -28m). Additionally: retrieval urgency system, tactical throttling (0.5s), transition cache (0.9s), gap run finding for attackers. Legacy's 6x5 grid is more rigid but FM2026's dynamic system is more adaptive.",
    "codeSuggestions": "Six fixes needed:\n1. Add CalcLastMan() equivalent \u2014 track deepest defender, prevent any defender going past the line.\n2. Increase compression to 0.60-0.70 to match Legacy squeeze strength.\n3. Raise ANCHOR_SPRING_STRENGTH from 0.12 to 0.20-0.25 and reduce ball-follow from 15% to 5% for defenders.\n4. Exclude defenders (CB/LB/RB) from attacking run eligibility in aiOffBall.js top-3 ranking.\n5. Enforce holdshape flag in supportController.js \u2014 when set, lock defender to 5m radius of startingPos.\n6. Add hard depth constraints: CB max -35m, LB/RB max -28m, with role-aware position clamping."
  },
  {
    "id": "cmp-007-shooting-goalkeeping",
    "date": "2026-02-11T12:00:00Z",
    "category": "matchEngine",
    "feature": "Shooting & Goalkeeping (Full Pipeline)",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P0",
    "status": "open",
    "resolvedDate": "2026-02-11",
    "reopenedDate": "2026-02-14",
    "reopenReason": "Producing 17-32 scorelines. GK parry rate 95% creates pinball loop. Height check at 1.1m blocks saves on mid/high shots. Shot multiplier stacking (8x inside box) overwhelms threshold gates.",
    "fm2026Details": "[REOPENED 14 Feb — unrealistic scorelines 17-32] SHOT DECISION: computeShotIntent() — range cap 18+(power/5)m, distance/angle/pressure scoring, GK-aware aiming (targets larger gap left/right of keeper), role bonus (strikers 1.08x), threshold 0.55 close / 0.70 far. HOWEVER: close-range multipliers stack to 8x (see cmp-048), making thresholds irrelevant inside box.\n\nSHOT EXECUTION: ballActionController.js — weak foot penalty (1+(1-foot/100)^1.5*1.2), power 0.8+(power/100)*0.4, cap 32*(0.9+power/100*0.2) m/s. Accuracy noise: BASE_ERROR_MIN=5.5deg to BASE_ERROR_MAX=18.5deg, but clamped to |y|<=4.5m (posts at 3.66m) — shots rarely miss wide (see cmp-051).\n\nGK REACTION: aiKeeper.js — reaction delay 0.10-0.45s based on agility/intelligence/confidence. Visibility delay +50ms per blocker.\n\nSAVE MECHANICS: keeperAction.js — CRITICAL ISSUES: (1) _checkBallPickup requires ball.height<=1.1m — shots above 1.1m bypass save system entirely (see cmp-049). (2) Catch probability: finalCatchProb=max(0.05, catchChance-speedPenalty-heightPenalty). For avg keeper vs 25m/s shot: catchChance=0.34, speedPenalty=0.60 → finalCatchProb=0.05 (5% catch). 95% of saves are PARRIES that drop ball back into danger zone creating shot-parry-shot-goal loops (see cmp-050).\n\nGOAL DETECTION: ball.x past ±52.5 AND |ball.y|<=3.66 AND height<=2.44. 5s debounce.",
    "fm2026Files": [
      "aiShot.js:15-258",
      "ballActionController.js:23-199",
      "aiKeeper.js:186-217",
      "keeperAction.js:81-292",
      "matchFlowController.js:190-219",
      "eventController.js:56-89"
    ],
    "legacyDetails": "SHOT DECISION: State-machine driven \u2014 player enters Shooting() state via tactical AI. MaxDist: 18+(PowerStat/5), modified by flags (fromdistance+8, shootonsight+2). No GK awareness \u2014 shoots at goal center. No free kick or penalty strategy.\n\nSHOT EXECUTION: Power=25000+(75*ShootingStat). Volley boost +50 if height>0.1m. Accuracy penalty: (100-AccuracyStat)*5 with 4x random deviation (X-axis 2x more scatter than Z). Height varies by ball position: ground shots 1500-3000, volleys \u00b15000-7500. Keeper jink (chip): halves power, Y=7000.\n\nGK REACTION: KeeperActions.cs \u2014 ball trajectory predicted via NewTimeBallWillBeClosest(). Brain delay: 200ms+(distance*10ms). 12 discrete dive types: 3 heights (Low/Mid/High) x 2 directions x 2 distances (Close/Far). Dive distance: 2m+(ShotStoppingStat/120)*1.67m. Rush distance: 1.5m+(FlairStat/100)*1m.\n\nSAVE MECHANICS: Animation-driven timing \u2014 StrikeStamp determines catch window (150-578ms). If StrikeStamp<GameTime: must parry, else catch. Parry direction: HandlingStat controls predictability. ParryBall(): speed reduced by ShotStoppingStat/20, random redirect on low HandlingStat. Miss chance: random(0,100)>ShotStoppingStat.\n\nGOAL DETECTION: Ball.x past GOALLINE+HALF_BALL_SIZE, within POST_DISTANCE, below BAR_HEIGHT. Post/bar collision via Collisions.cs with deflection angles.",
    "legacyFiles": [
      "PlayerAI.cs:629-878",
      "PlayerActions.cs:2112-2177",
      "PlayerActions.cs:3398-3476",
      "Player.cs:2574-2586",
      "KeeperActions.cs:83-189",
      "KeeperActions.cs:1870-2740",
      "Ball.cs:634-742",
      "Ball.cs:1912-1970",
      "GameState.cs:1103-1161"
    ],
    "gapAnalysis": "[REOPENED 14 Feb] Pipeline EXISTS but is severely unbalanced, producing 17-32 scorelines. Root causes: (1) Shot multiplier stacking creates 8x boost inside box — thresholds irrelevant. (2) GK catch rate ~5% for normal shots — 95% become parries that stay in danger zone. (3) GK _checkBallPickup height gate at 1.1m — mid/high shots bypass save system. (4) Shot accuracy clamped to |y|<=4.5m — shots rarely miss wide. (5) No pass-preference gate — players shoot when passing to better-placed teammate would be smarter. See detailed breakdowns in cmp-048 through cmp-052. Legacy produces realistic 1-3 goal matches through: 5x shot inaccuracy multiplier, generous catch system, trajectory-predicted positioning, Vision-based pass-over-shoot decisions, and action-type-specific cooldowns.",
    "codeSuggestions": "URGENT P0 FIXES (all must be applied together to achieve realistic scorelines):\n\n1. REDUCE SHOT MULTIPLIERS (aiShot.js:155-166):\n// FROM: if (distToGoal < 16.0) finalScore *= 2.0; if (distToGoal < 10.0) finalScore *= 2.0;\n// TO: if (distToGoal < 16.0) finalScore *= 1.15; if (distToGoal < 10.0) finalScore *= 1.25;\n// AND REMOVE duplicate boost in playerAIController.js:355-359\n\n2. FIX GK CATCH RATE (keeperAction.js:228-235):\n// Reduce speed penalty: const speedPenalty = Math.min(0.3, (ballSpeed - 12) / 40);\n// This changes catch rate from 5% to ~25-40% for average shots\n\n3. FIX GK HEIGHT COVERAGE (gameEngine.js:266):\n// FROM: ball.height <= 1.1  TO: ball.height <= 2.6\n\n4. WIDEN SHOT ACCURACY (aiConstants.js):\n// BASE_ERROR_MIN: 8.0 (was 5.5), BASE_ERROR_MAX: 28.0 (was 18.5)\n// ACTUAL_TARGET_CLAMP_Y: 8.0 (was 4.5)\n\n5. RAISE THRESHOLDS (aiConstants.js):\n// THRESHOLD_CLOSE: 0.72 (was 0.55), THRESHOLD_DISTANT: 0.82 (was 0.70)\n\n6. ADD VISION-BASED PASS PREFERENCE (playerAIController.js):\n// if (bestTeammateShootScore > shotScore * 1.2 && player.vision > 40) passToTeammate();",
    "exceedsLegacy": false
  },
  {
    "id": "cmp-034-captaincy",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Captaincy / Leadership System",
    "existsInFM2026": "yes",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] Full captaincy system: squad_captain persisted in DB, flows through API to match engine. Captain provides 5% stat boost (captainBonus=1.05) to all teammates within 25m (LEADERSHIP_RADIUS). Boost removed if captain off pitch/ejected. Leadership modifier derived from leadership attribute (or intelligence+aggression+resilience average), range 0.755x-1.25x. Affects shot/pass/dribble scores and pressing intensity. Updated every 10 ticks.",
    "fm2026Files": [
      "playerEngine.js:376-418",
      "playerAIController.js:88-112",
      "utilities.js:254-255",
      "matchMain.js:142-143"
    ],
    "legacyDetails": "No explicit captaincy in match engine. Captain is designated in squad but has no in-match stat effect. No proximity-based leadership boost.",
    "legacyFiles": [
      "Team.cs",
      "Player.cs"
    ],
    "gapAnalysis": "FM2026 EXCEEDS Legacy. Legacy has no in-match captaincy mechanic. FM2026 has full proximity-based leadership system with attribute-derived modifier affecting all AI decisions.",
    "codeSuggestions": "No fix needed \u2014 FM2026 exceeds Legacy here."
  },
  {
    "id": "cmp-035-defensive-wall",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Defensive Wall (Free Kicks)",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "fm2026Details": "[NEW 10 Feb] Wall setup: 9.15m from ball along ball-to-goal vector. Size 2-5 players based on distance/angle (5 if <20m, 4 if <25m, 3 if <30m, reduced by 2 if wide). Selects nearest non-GK defenders. Assigns subState='WALL' with target positions and facing angles. Perpendicular spacing 0.6m.",
    "fm2026Files": [
      "matchFlowController.js:862-928",
      "playerAIController.js:50-67"
    ],
    "legacyDetails": "Wall: 9.15m distance, angle-based rotation with perpendicular spread. Stamped debounce prevents re-entry.",
    "legacyFiles": [
      "GameState.cs:1196-1260"
    ],
    "gapAnalysis": "Both engines now have defensive walls. FM2026's implementation is slightly more detailed with dynamic sizing based on distance and angle.",
    "codeSuggestions": "No fix needed \u2014 feature is complete."
  },
  {
    "id": "cmp-036-conditional-tactics",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Conditional Tactical Instructions",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] Full conditional instruction system. Time triggers: Min15/30/45/60/75/MinAny. State triggers: GoalUp1/2, GoalDown1/2, OpPlayerDown, OurPlayerDown, Regardless, AllSquare. Actions: ChangeFormation, Substitution, ChangeCorner, ChangePassing, ChangePossession, ChangePressing, ChangeTempo, ChangeSqueeze. Instructions are one-shot (removed after execution). Checked every 1200 ticks (1 min).",
    "fm2026Files": [
      "tacticsController.js:124-209"
    ],
    "legacyDetails": "Basic conditional instructions: formation changes on score/time triggers. Less granular \u2014 fewer trigger types and fewer action types.",
    "legacyFiles": [
      "Team.cs"
    ],
    "gapAnalysis": "FM2026 EXCEEDS Legacy. More trigger types (8 vs ~4), more action types (8 vs ~3), one-shot removal prevents repeated firing.",
    "codeSuggestions": "No fix needed \u2014 FM2026 exceeds Legacy here."
  },
  {
    "id": "cmp-037-referee-system",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Referee / Officials System",
    "existsInFM2026": "partial",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "fm2026Details": "[NEW 10 Feb] Referee blindness: sight attribute (default 85/100). Minor fouls (severity < 0.8) can be missed based on random roll (miss chance = 1.0 - sight/100). REFEREE_MISS event emitted when foul missed. No linesman, no 4th official, no visual referee entity.",
    "fm2026Files": [
      "gameEngine.js:459-475"
    ],
    "legacyDetails": "3 officials: referee + 2 linesmen. Referee visibility-based calls (can miss fouls he doesn't see). Linesman offside detection with positioning. 4th official for substitutions. All officials are visual entities with movement.",
    "legacyFiles": [
      "OfficialLogic.cs:1-916"
    ],
    "gapAnalysis": "FM2026 has referee blindness (20% of legacy system). Still missing: linesman for offside, 4th official for subs, visual referee entity with positioning. Not critical for headless server simulation but reduces realism.",
    "codeSuggestions": "Low priority for headless engine. If needed, add linesman offside check as a post-hoc verification rather than a separate entity."
  },
  {
    "id": "cmp-038-ai-audit",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "AI Audit / Debug System",
    "existsInFM2026": "yes",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] AIAudit system records every AI decision during a match: tick, playerID, teamIndex, action type, human-readable reason, confidence/score, detailed metadata (candidates, distances). Records saved to _ai.json file. Deterministic comparison via SHA-256 hash of match results for reproducibility checks.",
    "fm2026Files": [
      "core/ai/AIAudit.js",
      "matchMain.js:62",
      "tools/saveMatchResult.js:130-132"
    ],
    "legacyDetails": "No AI audit system. No per-decision logging. No deterministic comparison tooling.",
    "legacyFiles": [],
    "gapAnalysis": "FM2026 EXCEEDS Legacy. Professional-grade debugging tool that Legacy never had. Enables systematic AI tuning and pathological decision identification.",
    "codeSuggestions": "No fix needed \u2014 this is a new capability."
  },
  {
    "id": "cmp-040-substitutions",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Substitution System",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] substitutionController.js (320 lines). Full auto-sub AI: injury subs (injury>25), fatigue subs (stamina<60 after 45min), tactical subs (after 65min). Staggered walk-on/off animation (WALKING_OFF \u2192 WALKING_ON \u2192 Complete). +30s extra time per sub. Max 5 subs, deduplication, GK-aware. forceInjurySubstitution() for critical injuries. Runs check every ~60 sim seconds.",
    "fm2026Files": [
      "substitutionController.js:1-320"
    ],
    "legacyDetails": "Manual substitution requests only via UI. No auto-sub AI, no injury-triggered subs, no fatigue management. Sub count tracked but no tactical automation. GK substitution handled as special case.",
    "legacyFiles": [
      "Team.cs",
      "GameState.cs"
    ],
    "gapAnalysis": "FM2026 EXCEEDS Legacy significantly. Full auto-sub AI with three priority tiers (injury \u2192 fatigue \u2192 tactical), staggered animation, extra time accumulation, and critical injury handling. Legacy only supports manual user-requested subs.",
    "codeSuggestions": "No fix needed \u2014 FM2026 is superior here."
  },
  {
    "id": "cmp-041-injury-mechanics",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Injury from Challenges",
    "existsInFM2026": "yes",
    "existsInLegacy": "partial",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] challengeController.js. Critical failure: fatigue-based muscle tear \u2014 (stamina/staminaMax)*100 vs random roll (0-110). Injury on contact: physique=(strength+staminaMax)*0.4, riskFactor=(100-physique)+20, baseHazard=0.2%+proneness(0-10%). Micro-damage accumulation: 2-5 points per challenge. Foul intensity multiplier 1.5x. Forces immediate injury substitution if severe.",
    "fm2026Files": [
      "challengeController.js:92-129",
      "challengeController.js:362-417"
    ],
    "legacyDetails": "Injury is tracked as a simple flag/timer. No dynamic injury calculation from tackle intensity. Injury proneness stat exists but isn't applied during challenge resolution. No micro-damage accumulation.",
    "legacyFiles": [
      "Player.cs",
      "PlayerActions.cs"
    ],
    "gapAnalysis": "FM2026 EXCEEDS Legacy. Dynamic injury system linked to fatigue, challenge intensity, physique, and proneness. Legacy only has static injury flags. The fatigue \u2192 muscle tear mechanic is particularly realistic.",
    "codeSuggestions": "No fix needed \u2014 FM2026 is superior here."
  },
  {
    "id": "cmp-042-foul-severity",
    "date": "2026-02-10T19:11:39Z",
    "category": "matchEngine",
    "feature": "Foul Detection & Severity",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "open",
    "exceedsLegacy": false,
    "fm2026Details": "[UPDATED 10 Feb] checkForceFoul(): base rate 5% + (aggression/400) - (tackling/300). From-behind tackle: 2.5x multiplier. Tactical flags: stayonfeet=40% base, noprisoners=220%. Severity: 0-40% chance. Cards: yellow at 0.7+, red at 0.96+. Box fortress bonus: +20% tackle win in box, +25% for GK. OOF impact events for atmosphere.",
    "fm2026Files": [
      "challengeController.js:131-163",
      "challengeController.js:288-357",
      "challengeController.js:465-475"
    ],
    "legacyDetails": "6 foul types: standard, violent, professional, handball, verbal, simulation. Each type has different card probability. Referee visibility affects detection (100-point threshold). Flair-based simulation/diving. Official positioning affects calls. More granular foul classification but simpler probability model.",
    "legacyFiles": [
      "OfficialLogic.cs",
      "PlayerActions.cs"
    ],
    "gapAnalysis": "DIFFERENT STRENGTHS:\n\nFM2026 BETTER AT: Stat-driven probability (aggression, tackling), tactical flag influence, from-behind multiplier, box fortress bonus, injury linking.\n\nLEGACY BETTER AT: 6 foul types vs FM2026's generic foul, referee visibility affecting calls, simulation/diving mechanic, professional foul classification.\n\nFM2026 has deeper probability model. Legacy has deeper classification. Both need elements from the other.",
    "codeSuggestions": "Add foul type classification to FM2026:\n1. Professional foul \u2014 last man + deliberate = auto red\n2. Violent conduct \u2014 high aggression + noprisoners = straight red\n3. Simulation \u2014 flair-based diving attempt\n4. Handball \u2014 ball-to-hand detection in box"
  },
  {
    "id": "gf-026-match-replay",
    "date": "2026-02-10T19:11:39Z",
    "category": "gameFeature",
    "feature": "Match Replay Viewer",
    "existsInFM2026": "yes",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] Full 2D match replay viewer in Unity UI Toolkit. Tick-based playback with interpolated positions. Controls: Play/Pause, Forward/Back, Speed (0.5x/1x/2x/5x), Progress slider. Match intro overlay with team names/league/stadium. Status overlays (Kick Off, Half Time, Full Time). Highlight log: GOAL, CARD_YELLOW, CARD_RED, PENALTY, SUBSTITUTION \u2014 clickable to jump to time. Ball + player colored markers, GK highlighted yellow. Delta compression handling. 1,232 lines.",
    "fm2026Files": [
      "Assets/Scripts/UI/MatchReplayScreen.cs"
    ],
    "legacyDetails": "No web/mobile match replay viewer. Legacy had full 3D Unity client-side rendering during match, but no post-match replay system.",
    "legacyFiles": [],
    "gapAnalysis": "FM2026 EXCEEDS Legacy. Full post-match replay system that Legacy never had. Critical for a server-side simulation game where the client doesn't run the match live.",
    "codeSuggestions": "No fix needed \u2014 major new feature."
  },
  {
    "id": "gf-027-practice-match",
    "date": "2026-02-10T19:11:39Z",
    "category": "gameFeature",
    "feature": "Practice Match System",
    "existsInFM2026": "yes",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "resolved",
    "exceedsLegacy": true,
    "fm2026Details": "[NEW 10 Feb] Practice match system: uses Practice booster card, finds nearest scheduled match, queues simulation. Results saved as JSON files (not DB). Allows players to preview tactics before real matches.",
    "fm2026Files": [
      "api/services/matchesService.js",
      "api/db/repository/matchesRepository.js"
    ],
    "legacyDetails": "No practice match system. No way to preview tactics before a real match.",
    "legacyFiles": [],
    "gapAnalysis": "FM2026 EXCEEDS Legacy. Entirely new feature that enhances tactical planning.",
    "codeSuggestions": "No fix needed \u2014 new feature."
  },
  {
    "id": "cmp-043-goal-pause-timing",
    "date": "2026-02-11T12:00:00Z",
    "feature": "Goal Pause / Dead Ball Timing",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[RESOLVED 11 Feb] GOAL_PAUSE = 5.0 seconds (was 2). Context-aware: winning team +2.0s (celebration/time-wasting), losing team -1.5s (min 2.0s, hurried restart). Scorer enters CELEBRATING action state for pause duration. +6s injury time per goal. Respawn all players to basic positions during celebration.",
    "fm2026Files": [
      "matchFlowController.js:9",
      "matchFlowController.js:414-416",
      "matchFlowController.js:170-187"
    ],
    "legacyDetails": "Multi-phase dead ball system. After goal: goalAwarded (200 ticks = 0.27s) -> goal celebration (1000 ticks = 1.33s) -> kickOff delay (context-aware: scores_equal/tempo not slow = 1000 ticks, losing team = 100 ticks for hurried restart, winning team = 2000 ticks for time-wasting) -> kickOffBlown (750 ticks = 1.0s) -> inPlay. Total dead time per goal: 2.95-5.3 seconds depending on context. Added time: +6s injury time per goal (GoalAddedTime=6). Keeper goal kick delay: 1500-3000 ticks (2-4s) depending on time-wasting flag.",
    "legacyFiles": [
      "GameState.cs:1118",
      "GameState.cs:1529",
      "GameState.cs:1615-1620",
      "GameState.cs:1661",
      "GameState.cs:GoalAddedTime"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] Goal pause now 5.0s base with context-aware +-2s (winning/losing). Injury time +6s per goal. Celebration action state. Now comparable to Legacy's 3.9-5.3s multi-phase system. FM2026 effective range: 3.5-7.0s vs Legacy 3.9-5.3s.",
    "codeSuggestions": "// P0 FIX: In matchFlowController.js:\n// 1. Increase GOAL_PAUSE from 2 to 5:\nconst GOAL_PAUSE = 5;\n\n// 2. Add context-aware delay in handleBallGoal():\nlet pauseDuration = 5.0; // Base\nconst scoringTeam = matchState.teams[scoringTeamIdx];\nconst concedingTeam = matchState.teams[concededTeamIdx];\nif (scoringTeam.goals > concedingTeam.goals) {\n  pauseDuration += 2.0; // Winning team wastes time\n} else if (scoringTeam.goals < concedingTeam.goals) {\n  pauseDuration -= 1.5; // Losing team hurries\n}\nmatchState.phaseUntil = now + pauseDuration;\n\n// 3. Add injury time tracking:\nmatchState.injuryTime = (matchState.injuryTime || 0) + 6;"
  },
  {
    "id": "cmp-044-shot-thresholds",
    "date": "2026-02-14T12:00:00Z",
    "feature": "Shot Decision Thresholds",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P0",
    "status": "open",
    "resolvedDate": "2026-02-11",
    "reopenedDate": "2026-02-14",
    "reopenReason": "Thresholds at 0.55/0.70 are negated by 8x close-range multiplier stacking (see cmp-048). A base score of 0.07 becomes 0.58 inside 10m, clearing the 0.55 threshold. Must be raised alongside multiplier reduction.",
    "fm2026Details": "[REOPENED 14 Feb] Thresholds at 0.55/0.70 are INSUFFICIENT because close-range multipliers (cmp-048) create 4x-8x boosts that overwhelm them. A mediocre base score of 0.15 becomes 1.24 after stacking. 6-gate filter exists but the close-range finisher boost (inside box 2x, point blank 4x cumulative) plus the playerAIController distance boost (~2x) make gates irrelevant when players are anywhere near the box. Must raise thresholds AND reduce multipliers simultaneously.",
    "fm2026Files": [
      "aiConstants.js:9-10",
      "aiShot.js:37-56",
      "aiShot.js:110-136"
    ],
    "legacyDetails": "6+ layered shot gates in AIShooting(). Base maxDist: 18 + (PowerStat/5) = 18-38 units. Modified by: shooting flags (fromdistance +8, shootonsight +2, shootonclear -4), opponent pressure (heat/2 reduction OR halved if clear ahead), facing angle (reduces effective distance if facing away from goal), weak foot penalty ((200-WeakFootStat)/100 increases effective distance), vision check (maxDist/4 if failed). Final gate: shotDist < maxDist. Most possessions end in passes because the combined gates make shooting the EXCEPTION, not the rule. The dribble vs pass vs shoot priority system in Dribbling() further filters: shooting only wins when pass score is low AND player is best-placed near goal.",
    "legacyFiles": [
      "PlayerAI.cs:629-878",
      "PlayerActions.cs:2977-3017"
    ],
    "gapAnalysis": "[REOPENED 14 Feb] 6-gate filter exists but is OVERWHELMED by close-range multiplier stacking (cmp-048). The 0.55 close threshold is trivially cleared by any player inside the box thanks to cumulative 4x-8x score boosts. Legacy's system works because there are NO close-range multipliers — instead, the base maxDist formula (18+PowerStat/5) combined with opponent pressure reduction and Vision-based pass preference naturally limits shots to genuinely good opportunities. FM2026 needs both higher thresholds (0.72/0.82) AND drastically reduced multipliers to match Legacy's shot frequency of ~10-15 per team per match.",
    "codeSuggestions": "// P0 FIX: In aiConstants.js, raise thresholds:\nTHRESHOLD_CLOSE: 0.55,   // was 0.34 \u2014 requires genuinely good chance\nTHRESHOLD_DISTANT: 0.70,  // was 0.48 \u2014 long shots need excellent position\n\n// P1 FIX: In aiShot.js computeShotScore(), add facing angle gate:\nconst goalAngle = Math.atan2(goalCenter.y - player.pos.y, goalX - player.pos.x);\nconst playerFacing = player.facing || 0;\nconst facingDiff = Math.abs(goalAngle - playerFacing);\nif (facingDiff > Math.PI * 0.6) return 0; // facing away from goal = no shot\nconst facingPenalty = Math.max(0.4, 1.0 - facingDiff / Math.PI);\ndistScore *= facingPenalty;\n\n// P1 FIX: Add pressure reducing range (not just score):\nlet effectiveMaxRange = maxRange;\nopponents.forEach(opp => {\n  if (!opp.pos) return;\n  const d = distance(player.pos, opp.pos);\n  if (d < 3.0) effectiveMaxRange *= 0.5; // halve range under heavy pressure\n  else if (d < 5.0) effectiveMaxRange *= 0.75;\n});\nif (distToGoal > effectiveMaxRange) return 0;"
  },
  {
    "id": "cmp-045-decision-cooldowns",
    "date": "2026-02-10T23:37:43Z",
    "feature": "Player Decision Interval / Action Cooldowns",
    "existsInFM2026": "partial",
    "existsInLegacy": "yes",
    "priority": "P0",
    "status": "open",
    "fm2026Details": "Decision interval: base 0.15 + (1-vision/100)*0.25 = 0.15-0.40s. Variance 0.1 + (1-composure/100)*0.15. Minimum 0.25s. Post-action cooldowns: pass 0.5s, shot 0.5s, throw-in 0.5s (all identical, all short). No per-action-type differentiation. No dribble decision lock. Total decisions per player per match: ~8,300-21,600. With 20 outfield players: ~166,000-432,000 decisions per match.",
    "fm2026Files": [
      "playerStateController.js:115-123",
      "playerEngine.js:81",
      "playerEngine.js:117",
      "playerEngine.js:129"
    ],
    "legacyDetails": "BrainStamp system with WIDE variation by action type. Standing: 5 * (150-IntelligenceStat) = 250-750 ticks (0.33-1.0s). In motion: 500 + 5*(130-IntelligenceStat) = 650-1150 ticks (0.87-1.53s). Post-shot: StrikeStamp + 225-600 ticks depending on angle. Dribble decision lock (m_dribbleChoiceStamp): 1000 ticks (1.33s) \u2014 once dribbling, can't reconsider for 1.33s. NoTouchStamp after ball touch: 100-960 ticks (0.13-1.28s) depending on action. Keeper distribution: 1200-3000 ticks (1.6-4.0s). Total decisions per player per match: ~4,000-8,000.",
    "legacyFiles": [
      "PlayerActions.cs:170-177",
      "PlayerActions.cs:384",
      "PlayerAI.cs:1561",
      "Ball.cs:671",
      "KeeperActions.cs:229-291"
    ],
    "gapAnalysis": "CRITICAL GAP \u2014 compounds the shot threshold problem. FM2026 players decide 2-4x faster than Legacy players, AND the post-action cooldowns are identical (0.5s) regardless of action type. Legacy has action-type-specific cooldowns that naturally pace the game:\n\nLegacy cooldowns that FM2026 lacks:\n- Dribble decision lock (1.33s) \u2014 prevents rapid dribble\u2192shoot cycling\n- NoTouchStamp (0.13-1.28s) \u2014 prevents same player acting on ball instantly\n- Keeper holding time (1.6-4.0s) \u2014 significant dead time per save\n- In-play vs out-of-play decision speed (Legacy doubles cooldown during live play)\n- Shot-specific extended lock (up to 0.8s beyond base)\n\nCombined with 108,000 ticks/match at 20Hz, this creates ~5-10x more action opportunities than Legacy.",
    "codeSuggestions": "// P0 FIX: In playerEngine.js handleShotIntent(), increase shot cooldown:\nplayer.nextDecisionTime = this.match.timeSeconds + 1.5; // was 0.5\n\n// P1 FIX: In playerStateController.js, raise minimum decision interval:\nreturn Math.max(0.50, base + randomOffset); // was 0.25\n\n// P1 FIX: Add action-type-specific cooldowns in playerEngine.js:\n// After pass:\nplayer.nextDecisionTime = this.match.timeSeconds + 0.8; // was 0.5\n// After shot:\nplayer.nextDecisionTime = this.match.timeSeconds + 1.5; // was 0.5\n// After dribble decision:\nplayer.nextDecisionTime = this.match.timeSeconds + 1.2; // NEW - dribble lock\n\n// P1 FIX: Add NoTouchStamp equivalent in ballEngine or gameEngine:\n// After any ball touch:\nplayer.noTouchUntil = matchState.timeSeconds + 0.15;\n// After keeper catch:\nplayer.noTouchUntil = matchState.timeSeconds + 2.0;\n// After goal kick:\nplayer.noTouchUntil = matchState.timeSeconds + 0.6;"
  },
  {
    "id": "cmp-046-possession-transition",
    "date": "2026-02-11T12:00:00Z",
    "feature": "Possession Transition Delay / Formation Inertia",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[RESOLVED 11 Feb] Tactical cache transition lag implemented: team.tacticalCacheUntil = timeSeconds + 0.9 after possession change. Formation throttle: recalculates every 0.5s (was every tick). Players cache tactical target during freeze period. Combined with formation anchoring (95% stickiness for distant players), counter-attacks now require natural build-up time.",
    "fm2026Files": [
      "playerEngine.js:206-236",
      "supportController.js"
    ],
    "legacyDetails": "Explicit possession transition delay. When ball possession changes team: m_cacheStamp = GameTime + 700 (reduced by training_transitions * 7). This freezes the gaining team's tactical position cache for ~700 ticks (0.93s). Formation shape only recalculates every ~510 ticks (0.68s) via Team.cs freq variable (also reduced by training bonuses). Predicted ball position for tactical shape uses 1000-tick lookahead. Combined effect: after turnover, the gaining team operates on STALE positions for ~1 second while the shape catches up.",
    "legacyFiles": [
      "Ball.cs:110",
      "Team.cs:1758-1774"
    ],
    "gapAnalysis": "[RESOLVED 11 Feb] FM2026 now has 0.9s tactical cache freeze (Legacy: 0.93s) + 0.5s formation throttle (Legacy: 0.68s). Effectively equivalent to Legacy's transition system. Possession cycles should normalize.",
    "codeSuggestions": "// P1 FIX: Add transition delay to gameEngine.js or supportController.js:\n\n// When possession changes team, freeze tactical cache:\nif (newPossessionTeamIdx !== previousPossessionTeamIdx) {\n  const team = matchState.teams[newPossessionTeamIdx];\n  team.tacticalCacheUntil = matchState.timeSeconds + 0.9; // ~700 Legacy ticks\n  // During freeze, players use LAST known positions instead of recalculating\n}\n\n// P1 FIX: Add formation recalculation throttle:\n// In supportController.js getTacticalTarget():\nif (team.lastTacticalUpdate && (now - team.lastTacticalUpdate) < 0.5) {\n  return player.cachedTacticalTarget; // Use cached position\n}\nteam.lastTacticalUpdate = now;\n// ... recalculate fresh position ..."
  },
  {
    "id": "cmp-047-duplicate-call-bugs",
    "date": "2026-02-11T12:00:00Z",
    "feature": "Match Flow Duplicate Call Bugs",
    "existsInFM2026": "no",
    "existsInLegacy": "no",
    "priority": "P2",
    "status": "resolved",
    "resolvedDate": "2026-02-11",
    "fm2026Details": "[RESOLVED 11 Feb] Both duplicate calls removed. handleBallOut() now called once (line 245). queueRestart() now called once. No longer double-processing ball-out events or double-queuing restarts.",
    "fm2026Files": [
      "matchFlowController.js:241-242",
      "matchFlowController.js:490-496"
    ],
    "legacyDetails": "No equivalent bugs found. Legacy uses single calls for all state transitions with GameStateStamp-based debouncing that prevents double-processing.",
    "legacyFiles": [
      "GameState.cs"
    ],
    "gapAnalysis": "BUG (not a feature gap). The duplicate handleBallOut call means every ball-out-of-bounds event is processed twice. The duplicate queueRestart means every throw-in restart is queued twice. While the second call likely overwrites the first, this is wasteful and risky:\n- Events may be emitted twice (BALL_OUT event at line 476)\n- Restart state could be corrupted if timing changes between calls\n- Ball position reset happens twice\n- Taker selection runs twice\n\nThese should be simple deletions of the duplicate lines.",
    "codeSuggestions": "// P0 FIX: In matchFlowController.js\n// Line 241-242: Remove duplicate handleBallOut call\n// BEFORE:\n//   this.handleBallOut(matchState, { side });\n//   this.handleBallOut(matchState, { side });\n// AFTER:\n//   this.handleBallOut(matchState, { side });\n\n// Lines 490-496: Remove duplicate queueRestart call\n// BEFORE:\n//   this.queueRestart(matchState, { type, teamIdx, spot, ... });\n//   this.queueRestart(matchState, { type, teamIdx, spot, ... });\n// AFTER:\n//   this.queueRestart(matchState, { type, teamIdx, spot, ... });"
  },
  {
    "id": "cmp-048-shot-multiplier-stacking",
    "date": "2026-02-14T12:00:00Z",
    "category": "matchEngine",
    "feature": "Shot Score Multiplier Stacking (Close Range)",
    "existsInFM2026": "yes",
    "existsInLegacy": "no",
    "priority": "P0",
    "status": "open",
    "fm2026Details": "CRITICAL SCORING BUG. Two independent systems multiply shot scores for close-range players, stacking multiplicatively:\n\nSystem 1 — aiShot.js:155-166:\n  if (isAttacker && distToGoal < 25) finalScore *= 1.08  // ATTACKER_BONUS\n  if (distToGoal < 16.0) finalScore *= 2.0              // inside box\n  if (distToGoal < 10.0) finalScore *= 2.0              // point blank (cumulative 4x)\n  Combined at <10m for attacker: 4.32x\n\nSystem 2 — playerAIController.js:355-359:\n  if (distToGoal < 25) {\n    const shootBoost = 1.0 + Math.pow(1.0 - (distToGoal / 25), 1.5) * 1.5;\n    shotScore *= shootBoost;  // At 5m: 2.07x. At 10m: ~1.7x\n  }\n\nCOMBINED at 5m from goal: 4.32 * 2.07 = ~8.9x base score.\nA mediocre base score of 0.07 becomes 0.62, clearing the 0.55 close threshold.\nResult: Every player inside the box shoots on virtually every decision cycle (~1s).",
    "fm2026Files": [
      "aiShot.js:155-166",
      "playerAIController.js:355-359",
      "aiConstants.js:9-10"
    ],
    "legacyDetails": "Legacy has NO close-range shot multipliers. The shot decision uses a simple distance gate: if (shotDist < maxDist) shoot. MaxDist is 18+(PowerStat/5) = 18-38 yards, reduced by opponent pressure, angle, weak foot. There is no bonus for being close — in fact, the Vision stat check makes high-intelligence players LESS likely to shoot when a teammate is better placed. The decision chain (Cross > Shoot > Pass > Dribble) naturally limits shooting to genuine opportunities.",
    "legacyFiles": [
      "PlayerAI.cs:629-878"
    ],
    "gapAnalysis": "ROOT CAUSE #1 of unrealistic scorelines. The double-multiplier system was likely intended to make close-range chances feel more dangerous, but the multiplicative stacking creates an exponential boost that overwhelms all other shot filters. Legacy achieves realistic close-range finishing WITHOUT multipliers — the distance gate alone (closer = more likely to be within maxDist) naturally makes close shots more frequent. The 8x multiplier is roughly equivalent to giving every player inside the box a shooting stat of 200+ on a 0-100 scale.",
    "codeSuggestions": "P0 FIX — Choose ONE of these approaches:\n\nOption A (Recommended): Remove playerAIController boost entirely, reduce aiShot boosts:\n// aiShot.js:155-166 — reduce from 4x to 1.4x:\nif (isAttacker && distToGoal < 25) finalScore *= 1.05; // was 1.08\nif (distToGoal < 16.0) finalScore *= 1.15; // was 2.0\nif (distToGoal < 10.0) finalScore *= 1.20; // was 2.0 (cumulative ~1.44x)\n// playerAIController.js:355-359 — DELETE the shootBoost block entirely\n\nOption B: Keep one system, remove the other:\n// Keep aiShot.js boosts but make them linear: finalScore += 0.10 (flat bonus, not multiplicative)\n// DELETE playerAIController.js:355-359 entirely\n\nOption C: Single mild multiplier matching Legacy's implicit close-range advantage:\n// Replace both systems with: if (distToGoal < 20) finalScore *= 1.0 + (1.0 - distToGoal/20) * 0.3;\n// Max boost at 0m: 1.3x. At 10m: 1.15x. At 20m: 1.0x."
  },
  {
    "id": "cmp-049-gk-height-coverage",
    "date": "2026-02-14T12:00:00Z",
    "category": "matchEngine",
    "feature": "Goalkeeper Save Height Limit",
    "existsInFM2026": "partial",
    "existsInLegacy": "yes",
    "priority": "P0",
    "status": "open",
    "fm2026Details": "CRITICAL BUG. The GK save attempt is triggered from gameEngine.js _checkBallPickup() which requires ball.height <= 1.1m (line 266). The goal crossbar is at 2.44m. This means shots between 1.1m and 2.44m height COMPLETELY BYPASS the goalkeeper save system — the ball flies into the net with no save attempt possible.\n\nShot loft values in ballActionController.js range from 2.5-4.5, meaning many shots travel at 1.5-2.5m height through the danger zone. A significant percentage of on-target shots are simply unsaveable by design.\n\nThe keeperAction.js save logic itself handles heights up to 2.6m (catch threshold) and can punch/tip above 1.8m — but this code is NEVER REACHED for shots above 1.1m because the triggering function filters them out.",
    "fm2026Files": [
      "gameEngine.js:265-266",
      "gameEngine.js:349-371",
      "keeperAction.js:196-206"
    ],
    "legacyDetails": "Legacy GK handles shots at ALL heights within the goal frame. Dive categorisation: Low take (<0.75 yd / ~0.69m), Mid take (<1.5 yd / ~1.37m), High take (<2.1 yd / ~1.92m), Tipping (>2.1 yd). The keeper's ShallWeRushTheBall() function uses ball trajectory prediction to determine save type with no height pre-filter — if the ball is heading toward the goal, the keeper reacts regardless of height.",
    "legacyFiles": [
      "KeeperActions.cs:1870-1920",
      "KeeperActions.cs:1805-1869"
    ],
    "gapAnalysis": "CRITICAL — the 1.1m height check means roughly 30-50% of on-target shots are physically impossible for the GK to save. This is the second biggest contributor to unrealistic scorelines. The fix is trivial — raise the height threshold to cover the full goal frame.",
    "codeSuggestions": "P0 FIX (trivial one-line change):\n// gameEngine.js line 266:\n// FROM: if (ball.height <= 1.1)\n// TO: if (ball.height <= 2.6)\n// 2.6m covers the full crossbar (2.44m) plus margin for GK reach above bar.\n// The keeperAction.js save logic already handles heights up to 2.6m internally."
  },
  {
    "id": "cmp-050-gk-parry-pinball",
    "date": "2026-02-14T12:00:00Z",
    "category": "matchEngine",
    "feature": "Goalkeeper Parry Rate / Second Chance Loop",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P0",
    "status": "open",
    "fm2026Details": "CRITICAL BALANCE ISSUE. The catch probability formula in keeperAction.js produces a ~5% catch rate for average shots:\n  catchChance = (handling/100) * psychMod * 0.8\n  For avg keeper (handling=50, confidence=70): psychMod=0.85, catchChance=0.34\n  speedPenalty = min(0.6, (ballSpeed - 12) / 20)\n  For 25m/s shot: speedPenalty = 0.60 (clamped)\n  heightPenalty ~= 0.1 for mid-height\n  finalCatchProb = max(0.05, 0.34 - 0.60 - 0.10) = max(0.05, -0.36) = 0.05 (5%)\n\nThe remaining 95% of saves become parries. Parries deflect the ball laterally with random bias, typically 2-5m from the goal. With decision cooldowns at ~1s (cmp-045) and 8x shot multipliers inside the box (cmp-048), another attacker immediately picks up the parried ball and shoots again. This creates a SHOT → PARRY → SHOT → PARRY → GOAL feedback loop that can cycle 3-5 times per attack, making goals virtually inevitable once the ball enters the box.\n\nGK recovery time after parry: 0.6-1.8s — during which another shot is already incoming.",
    "fm2026Files": [
      "keeperAction.js:218-240",
      "keeperAction.js:196-206"
    ],
    "legacyDetails": "Legacy GK catch system is timing-based, not probability-based. If StrikeStamp > GameTime (keeper reacted in time), the keeper CATCHES the ball — attack ends. If StrikeStamp < GameTime (too late), the keeper PARRIES. Parry quality: speed reduced by ShotStoppingStat/20, with random redirect on low HandlingStat. Miss chance: random(0,100) > ShotStoppingStat — so a keeper with 80 ShotStopping misses 20% of parry attempts.\n\nCritically, Legacy's parry is a LAST RESORT when the keeper is too late, not the DEFAULT outcome. Most saves in Legacy are catches that cleanly end the attack.",
    "legacyFiles": [
      "KeeperActions.cs:1870-1920",
      "KeeperActions.cs:2100-2200"
    ],
    "gapAnalysis": "The fundamental design difference: Legacy uses a timing-based catch/parry system where catches are the norm and parries happen when the GK is late. FM2026 uses a probability-based system where the speed penalty on catch probability is so severe that parries are the norm (95%) and catches are rare (5%). This single difference is responsible for the 'pinball effect' that doubles or triples the number of goals per attack. Combined with fast decision cooldowns and close-range shot multipliers, it creates an inescapable scoring loop.",
    "codeSuggestions": "P0 FIX — Multiple options (apply at least one):\n\nOption A (Recommended): Reduce speed penalty on catches:\n// keeperAction.js — change speed penalty calculation:\n// FROM: const speedPenalty = Math.min(0.6, (ballSpeed - 12) / 20);\n// TO: const speedPenalty = Math.min(0.3, (ballSpeed - 15) / 40);\n// This raises catch rate from 5% to ~25-35% for average shots\n\nOption B: Add timing-based catch (like Legacy):\n// If GK reacted before shot was taken (positioned correctly), always catch:\nconst reactionMargin = gk.reactionStartTime - shotTime;\nif (reactionMargin > 0.2) return 'CATCH'; // well-positioned = clean save\n\nOption C: Add parry-clear mechanic:\n// After parry, deflect ball AWAY from goal (10-15m) rather than laterally (2-5m):\nconst clearDirection = normalizeVector(ballPos - goalCenter);\nparryVelocity = clearDirection * 12; // push ball out of danger zone\n\nOption D: Add post-parry immunity window:\n// After a parry, suppress all shot decisions for 2s:\nteam.shotSuppressedUntil = matchState.timeSeconds + 2.0;"
  },
  {
    "id": "cmp-051-shot-accuracy-clamping",
    "date": "2026-02-14T12:00:00Z",
    "category": "matchEngine",
    "feature": "Shot Accuracy / Inaccuracy System",
    "existsInFM2026": "yes",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "Shot accuracy is too generous. aiConstants.js defines:\n  BASE_ERROR_MIN: 5.5 degrees (best player)\n  BASE_ERROR_MAX: 18.5 degrees (worst player)\n  ACCURACY_SCALE_BEST: 0.75 (reduces error for high-skill)\n  ACCURACY_SCALE_WORST: 1.25 (increases for low-skill)\n  ACTUAL_TARGET_CLAMP_Y: 4.5m (lateral clamp on shot target)\n\nEffective error range: 4.1deg (elite) to 23.1deg (amateur). But the ACTUAL_TARGET_CLAMP_Y of 4.5m means even wildly inaccurate shots are clamped to within 0.84m of the goalpost (posts at 3.66m). Shots literally cannot miss wide by more than ~1m. At close range, this makes almost every shot on-frame.",
    "fm2026Files": [
      "aiConstants.js:12-16",
      "aiShot.js:185-220"
    ],
    "legacyDetails": "Legacy shot inaccuracy is 5x WORSE than pass inaccuracy — the ShootingInaccuracyEffect() function uses skill*5 multiplier (Player.cs:2574-2586). For a player with AccuracyStat=50: inaccuracy factor = 250 (vs 50 for passes). Z-axis (lateral) spread uses diff.z/500 while X-axis uses diff.x/1000 — lateral deviation is 2x worse. Combined: shots genuinely miss wide, over the bar, and into the stands. No artificial clamping — a bad shot goes wherever physics takes it.\n\nShot height is also skill-gated: wild shots (low shooting stat) use range 80-100+inaccuracy% of bar height, frequently going over. High-shooting players get low-driven shots at 50-100+inaccuracy% of HALF bar height.",
    "legacyFiles": [
      "Player.cs:2574-2586",
      "Player.cs:2556-2570",
      "PlayerAI.cs:3035-3100"
    ],
    "gapAnalysis": "FM2026's shot accuracy system creates an artificial 'funnel' that keeps shots near the goal frame. The 4.5m lateral clamp combined with narrow error angles means poor shooters still hit near-target. Legacy's approach of applying a 5x inaccuracy multiplier with no clamping produces realistic shot distributions where many shots go wide or over, matching real football where ~50-65% of shots miss the target entirely. FM2026 likely has >80% of shots on target.",
    "codeSuggestions": "P1 FIX: Widen error ranges and remove/relax clamping:\n// aiConstants.js:\n// FROM:\n//   BASE_ERROR_MIN: 5.5, BASE_ERROR_MAX: 18.5, ACTUAL_TARGET_CLAMP_Y: 4.5\n// TO:\n//   BASE_ERROR_MIN: 8.0, BASE_ERROR_MAX: 30.0, ACTUAL_TARGET_CLAMP_Y: 8.0\n\n// Additionally, add a 'shot inaccuracy multiplier' like Legacy's 5x:\n// In aiShot.js shot execution, multiply error by 3-5x compared to pass error:\n// const shotErrorMultiplier = 4.0; // shots are much less accurate than passes\n// errorAngle *= shotErrorMultiplier;\n\n// Add height inaccuracy for low-skill players:\n// if (shootingStat < 50) targetHeight *= 1.0 + (50 - shootingStat) / 50; // tends to go over bar"
  },
  {
    "id": "cmp-052-pass-vs-shoot-gate",
    "date": "2026-02-14T12:00:00Z",
    "category": "matchEngine",
    "feature": "Pass-vs-Shoot Intelligence (Vision Gate)",
    "existsInFM2026": "no",
    "existsInLegacy": "yes",
    "priority": "P1",
    "status": "open",
    "fm2026Details": "FM2026 has NO mechanism for a player to prefer passing to a better-placed teammate over shooting themselves. The shot score competes directly against pass score via the AI controller, but the massive close-range multipliers (cmp-048) mean shooting almost always wins when a player is in the box. There is no Vision-stat check that suppresses shooting when a teammate has a better angle/position.",
    "fm2026Files": [
      "playerAIController.js:340-380",
      "aiShot.js:100-170"
    ],
    "legacyDetails": "Legacy has an explicit Vision-based pass preference gate in AIShooting() (PlayerAI.cs:743):\n  if (GM.GetRandom(0, 100) < VisionStat && fangle < 0.5f)\n    if (!bestplaced) maxDist /= 4;\n\nThis means: if a player passes their Vision stat roll AND is NOT the best-placed player to score, their effective shooting range is QUARTERED. A player with Vision=80 will pass to a better-placed teammate 80% of the time instead of shooting. This creates realistic build-up play and team-goal sequences where the scorer is the player with the best angle, not just whoever gets the ball first.\n\nAdditionally, the decision chain priority (Cross > Shoot > Pass > Dribble) means crossing to a teammate is always considered before shooting.",
    "legacyFiles": [
      "PlayerAI.cs:740-750",
      "PlayerActions.cs:2889-2920"
    ],
    "gapAnalysis": "This is a significant AI intelligence gap. In real football, intelligent players look for the better pass rather than shooting from a poor angle. Legacy's Vision gate creates realistic team play — assists, through-balls, cutbacks. FM2026's lack of this gate, combined with the 8x close-range multiplier, means every player in the box becomes a selfish striker who shoots regardless of whether a teammate has an open goal 5m away.",
    "codeSuggestions": "P1 FIX: Add Vision-based pass preference in playerAIController.js:\n// Before comparing shotScore vs passScore:\nconst bestTeammate = findBestPlacedTeammate(player, teammates, goalPos);\nif (bestTeammate && bestTeammate.shotScore > player.shotScore * 0.8) {\n  // Vision roll: high vision = more likely to pass\n  const visionRoll = rng.nextFloat() * 100;\n  if (visionRoll < player.attributes.vision) {\n    // Suppress shot, boost pass to that teammate\n    shotScore *= 0.25; // quarter the shot score (like Legacy's maxDist/4)\n  }\n}\n\n// Also consider adding cross-first priority:\n// if (crossScore > 0 && distToGoal < 30 && angleToGoal > 0.4) {\n//   return cross; // prefer crossing from wide areas\n// }"
  }
];
