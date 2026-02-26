# Game Features Summary — FM2026 vs Legacy (Non-Engine)

**Updated: 26 February 2026** | **Score: 85%** (+3% — major client-side update)

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
| **Match System** | **97%** | **+2** | Complete replay viewer: intro, scoreboard, celebrations, highlights, 1-15x speed |
| **Cards/Packs** | **97%** | **+2** | 16 rarity booster images, rarity frames, texture cache |
| **Squad Management** | **91%** | **+5** | Rarity gradients, in-squad icon, INF/CON/SHP columns, foot pref, flags + smart role-swap, rarity gradient refinements |
| **UI/Client** | **95%** | **+8** | Replay overhaul, search, manager avatar, practice routing + upgrade result popup (animated stat comparison), injury portrait display |
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
| BUG-012 | HIGH | Player sacrifice calls `deleteTrainer()` — wrong DB table, creates orphan record | **OPEN** |
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
- **Pack flexibility** — Free/non-NFT packs alongside NFT packs
- **Pack security** — Ownership verification before opening (anti-cheat)
