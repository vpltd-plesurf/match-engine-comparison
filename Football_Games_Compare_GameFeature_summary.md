# Game Features Summary — FM2026 vs Legacy (Non-Engine)

**Updated: 3 March 2026** | **Score: 86%** (+1% — upgrade engine rewrite, client polish)

## What Changed (3 March 2026 — 7 commits, 66 files)

**Upgrade Engine Rewrite (gf-011):**
- upgradesService.js completely reworked: weighted stat selection pool (3x role-priority, 2x catch-up below 40, 0.2x resistance above 90), stat count by rarity (Regular 1-2 through Legendary 4-5), sacrifice bonus pool (rarity multiplier * 0.8 + abilityScore fraction), diminishing returns formula pow(1-current/max, 0.7)
- Stat pool initialization order fix (prevents incorrect bounds)
- PlayerUpgradeResultPopup — animated stat counters (3s lerp), rarity transition animation, "Upgrade Again" loop button
- UpgradePlayerScreen — ID-based player lookup (reference equality fix), pre-snap for "upgrade again", tactic-evict hook

**Cards/Packs:**
- Pack 4 (free test pack, ~100 cards) and Pack 1000 (hidden free rare starter) added
- generateBoosters.mjs — new admin CLI for booster issuance (--clubId/--playerId/--type/--rarity/--amount)
- BoosterCardPopup (792 lines, new) — unified heal/practice mode picker with rarity-bucketed display

**Match Replay Polish:**
- Ball height physics simulation (size scaling + shadow fading)
- Ball owner pulsating ring (sin-based 10Hz pulse)
- Player facing direction indicator line
- Goal celebration overlay (cubic ease-in/out slide animation, 3s hold)
- Match highlights log (filterable by GOAL/CARD/PENALTY/SUB, click-to-seek)
- Match intro overlay (team names, badges, stadium, 5s auto-dismiss)
- Commentary fix and owner ball ID fix

**Bug Fixes:**
- BUG-012 FIXED: Player sacrifice now correctly calls deletePlayer() (was deleteTrainer())

## What Changed (26 Feb 2026 — addendum, 3 additional commits)

3 commits (25-26 Feb), 86 files, 5,332 insertions. Client-side polish and new UI features:

**Upgrade System (gf-011):**
- PlayerUpgradeResultPopup (225 lines) — animated stat comparison popup showing before/after values with growth indicators

**Communication (gf-022):**
- InjuryMessageFormatter (85 lines) — extracts player IDs from injury email messages
- NewsPlayerInjuryItem (183 lines) — injury news display with 3D player portraits
- MailScreen (+214 lines) — injury emails with portrait grids, inline 3D model rendering

**Squad Management (gf-014):**
- TacticsScreen (+113 lines) — smart role-swap logic (auto-switches positions), rarity gradient refinements
- UpgradePlayerScreen (+101 lines) — sacrifice guards, stat snapshot for comparison

## What Changed (26 Feb 2026 — initial, 14 commits)

14 commits with significant client-side improvements. 10 C# files changed, 3 UXML layouts, 44 asset files (including 16 new rarity-specific booster images).

**Match Replay (MAJOR OVERHAUL — 1,681 lines):**
- Match intro overlay (team badges, league name, 5s auto-dismiss)
- Live scoreboard (team abbreviations, score, clock, extra time "+N")
- Half time / Full time / Goal overlays with cubic ease-in/out animations
- Highlights log (goals/cards/penalties/subs with click-to-seek)
- Speed control (1x-15x with ± buttons)
- Ball shadow with height interpolation
- GK highlight (yellow dot), team ID normalization fix
- Delta-tick normalization (prevents position jumping)
- Practice match routing fix (returns to TacticsScreen)

**Squad Management:**
- Rarity gradient element (procedural per-row colour wash)
- Rarity-coloured dropdown items (25% opacity background)
- In-squad icon on player cards (shown when assigned to formation)
- INF status column (injury/fitness with severity styling)
- Foot preference display (L/R%)
- CON status bar (colour-coded by fitness threshold)
- SHP value (average of stamina+resilience+ability)
- Morale icon, nationality flags

**Cards/Boosters:**
- 16 rarity-specific booster images (Practice/Heal/Scout/Skill × 4 rarities)
- Rarity background frame on booster cards
- Static card background texture cache

**Upgrade Screen:**
- Squad player sacrifice guard ("Squad players can't be sacrificed")
- Free rarity upgrade guard
- Skill-type booster filtering
- NFT-on-sale exclusion
- Rarity filter toggles + skill filter dropdown

**Training:**
- StartPracticeMatch + CheckPracticeMatchStatus APIs in GameService
- Practice tab on TacticsScreen linking to PracticeCardsPopup

## What Changed (24 Feb 2026)

22 commits pulled (18-24 Feb) but all were match engine changes. No game feature additions.

## What Changed (23 Feb 2026)

No new commits. BUG-012/013 found.

## Feature Scores

| Feature | Score | Change | Notes |
|---------|-------|--------|-------|
| **Match System** | **97%** | — | Complete replay viewer with ball height, facing, celebrations, highlights |
| **Cards/Packs** | **98%** | **+1** | Pack 4/1000, generateBoosters CLI, BoosterCardPopup unified heal/practice |
| **Squad Management** | **91%** | — | Rarity gradients, in-squad icon, INF/CON/SHP, smart role-swap |
| **UI/Client** | **96%** | **+1** | Replay polish (ball height/facing/ring/celebrations), animated upgrade result, unified booster picker |
| Marketplace | 83% | — | |
| League System | 80% | — | |
| **Training** | **78%** | **+3** | Practice match APIs, practice tab, booster filtering |
| **Communication** | **79%** | **+4** | Injury emails with 3D portraits, InjuryMessageFormatter, NewsPlayerInjuryItem, MailScreen portrait grids | |
| Player Generation | 80% | — | |
| Economy/Finances | 15% | — | |
| PvP | 10% | — | |
| Scout System | 5% | — | |
| Tutorial | 5% | — | |
| Cup Competitions | 0% | — | |

## Critical Gaps (P0)

| Gap | Detail |
|-----|--------|
| ~~Player generation~~ | **FIXED** — RarityStatsBonus system |
| ~~Trainer generation~~ | **FIXED** — Same system |
| **Financial economy** | Club balance = 100k starting. No match day income, no wages, no sponsorship. **ONLY remaining P0.** |

## Major Gaps (P1)

| Gap | Detail |
|-----|--------|
| **Cup competitions** | `checkForStartCup()` is empty. `LeagueType.Cup` enum exists but unused. |
| **Scout system** | `BoosterType.Scout` exists. No discovery/scouting logic. |
| **PvP** | `MatchType.Pvp` exists. No matchmaking, no ranked, no challenges. |
| **Relegation** | Promotion (top 20%) works. No demotion logic. |
| **Transfer market** | Only via NFT marketplace. No in-game transfer window. |

## Known Bugs

| Bug | Severity | Detail | Status |
|-----|----------|--------|--------|
| BUG-001 | HIGH | Player upgrade boosts random stats | **FIXED** |
| BUG-002 | HIGH | Stars/star_percent not recalculated | **FIXED** |
| BUG-003 | HIGH | Coach upgrade invisible | **FIXED** |
| BUG-004 | MEDIUM | Coach upgrade random stats | **FIXED** |
| BUG-005 | CRITICAL | Player generation rarity-blind | **FIXED** |
| BUG-006 | CRITICAL | Trainer generation rarity-blind | **FIXED** |
| BUG-007 | HIGH | Practice booster not consumed | **FIXED** |
| BUG-008 | MEDIUM | Marketplace price hard-coded | **MOSTLY FIXED** (new SOL transfer flow uses pack.price; SOL price stub TODO) |
| BUG-009 | CRITICAL | Unrealistic scorelines (23-18, 32-26) | **SUBSTANTIALLY FIXED** — cmp-053 7/7 + further tuning (first touch, shot blocking, auto-dispossession) |
| BUG-010 | HIGH | NFT buy lock date arithmetic (`new Date() + Duration` = string concat, not date comparison) | **OPEN** |
| BUG-011 | MEDIUM | SOL price stub — `getSolPriceInUSD()` returns hardcoded 1.0, fetch dead | **OPEN** |
| BUG-012 | HIGH | Player sacrifice calls `deleteTrainer()` — wrong DB table, creates orphan record | **FIXED** (3 Mar) |
| BUG-013 | MEDIUM | `injury` stat rarity-scaled in `processRoleDefaultStats()` — Legendary starts 77–89 injury | **OPEN** |

## FM2026 Exceeds Legacy In

- **Training system** — Server-side daily processing with per-player assignment
- **Season management** — Automated round-robin scheduling + day cycling
- **Leaderboards** — 14 categories including per-position + leadership
- **Match replay** — Production-quality 2D replay viewer with intro overlay, live scoreboard, goal celebrations, highlights log with click-to-seek, 1-15x speed control, ball shadow, GK highlight
- **Practice matches** — Full UI flow with booster card consumption, practice APIs, routing
- **NFT/Blockchain** — Full Solana integration (legacy had none)
- **Marketplace** — On-chain P2P trading with lock-and-confirm + server-authoritative pricing
- **Rarity progression** — Dynamic rarity recalculation on upgrade with NFT metadata sync
- **Pack flexibility** — Free/non-NFT packs alongside NFT packs (including test and hidden packs)
- **Pack security** — Ownership verification before opening (anti-cheat)
- **Upgrade engine** — Weighted stat selection, diminishing returns, sacrifice bonus pool, animated result popup
- **Booster management** — Admin CLI tool (generateBoosters.mjs), unified heal/practice UI picker
