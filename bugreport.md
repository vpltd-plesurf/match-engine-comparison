# FM2026 Bug Report

Ongoing log of bugs, issues, and design flaws found in the FM2026 codebase.

---

## BUG-001: Player upgrade boosts random stats, not role-relevant ones

**Severity:** HIGH
**File:** `FM2026/backend/server/src/api/services/upgradesService.js` lines 142-149
**Date Found:** 9 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — `upgradeInternal()` now uses `rolePriorityStats` mapping (lines 137-148). Priority pool is placed first in weighted list, ensuring role-relevant stats are chosen preferentially. 10 roles defined with 2-3 priority stats each.

**Description:**
`upgradePlayer()` picks 2-3 stats at random from a pool of 24 stats. However, the player's displayed rating (`abilityScore()` / `roleScore()` in `model.js:915-948`) only uses 2-3 role-specific stats (e.g. Striker = shooting + control + dribbling). If the upgrade hits stats outside the role formula, the displayed score and stars don't improve despite real stat gains.

**Impact:** Players appear to not improve or even regress after upgrade. Misleading UX.

**Suggested Fix:** Weight stat selection toward role-relevant stats, or at minimum guarantee at least one role-relevant stat is included.

---

## BUG-002: Stars and star_percent not recalculated after player upgrade

**Severity:** HIGH
**File:** `FM2026/backend/server/src/api/services/upgradesService.js` line 182
**Related:** `FM2026/backend/server/src/api/model.js` — `Player.mapUpdateData()` (line 848), `Player.getStars()` (line 907), `Player.getStarPercent()` (line 911)
**Date Found:** 9 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — `upgradeInternal()` now calls `getStars()` and `getStarPercent()` after stat mutation (lines 261-271). Delta values are tracked and returned in `upgradeDetails.stats`.

**Description:**
After mutating stat values on the player object, `upgradePlayer()` calls `updatePlayer()` which persists via `mapUpdateData()`. Neither `stars` nor `star_percent` are included in `mapUpdateData()`, and `getStars()` / `getStarPercent()` are never called after the stat mutation. The response sent back to the client contains stale pre-upgrade star values alongside new post-upgrade raw stats.

**Impact:** Displayed % and rank appear to drop after a successful upgrade. Values only correct themselves on next full load from DB.

**Suggested Fix:** Call `getStars()` and `getStarPercent()` after stat mutation in `upgradePlayer()`, and either include them in `mapUpdateData()` or ensure the response object reflects the recalculated values.

---

## BUG-003: Coach upgrade produces no visible change

**Severity:** HIGH
**File:** `FM2026/backend/server/src/api/model.js` lines 1217-1232
**Related:** `FM2026/backend/server/src/api/services/upgradesService.js` lines 193-261, 263-282
**Date Found:** 9 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — Two fixes applied:
1. Trainer `abilityScore()` changed from max-of-all to average-of-3 role-specific stats (Coach: ability+keeping+technicality/3, Physio: footwork+physicality+sprinting/3) — model.js lines 1189-1197
2. Stars/star_percent now recalculated after trainer upgrade via shared `upgradeInternal()` — upgradesService.js lines 261-271

**Description:**
Two compounding issues:

1. **Coach `abilityScore()` uses max-of-all logic:** It returns the single highest stat value rather than an average or sum. Coach stats start at 10-30 range. With a Regular booster multiplier of 0.05, the boost is `100 * 0.05 = +5 points`. If the randomly chosen stats aren't the current max stat, the `abilityScore()` doesn't change at all.

2. **Same stars recalculation bug as BUG-002:** `upgradeTrainer()` at line 252 calls `updateTrainer()` without recalculating stars/star_percent.

**Impact:** Coach upgrades appear to do nothing. Even when stats do change, the display doesn't reflect it.

**Suggested Fix:**
- Recalculate stars/star_percent after trainer stat mutation (same fix as BUG-002)
- Consider whether max-of-all is the right scoring formula for coaches, or if it should be an average of relevant stats
- Consider higher base multipliers for trainer upgrades given their lower stat ranges

---

## BUG-004: Same random-stat-selection issue affects coach upgrades

**Severity:** MEDIUM
**File:** `FM2026/backend/server/src/api/services/upgradesService.js` lines 209-219
**Date Found:** 9 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — Trainer upgrade now uses `rolePriorityStats` mapping (Coach: ability+keeping+technicality, Physio: footwork+physicality+sprinting). Same shared `upgradeInternal()` as players — lines 174-177.

**Description:**
Same pattern as BUG-001 but for trainers. The upgrade randomly selects 2-3 stats from the full 9-stat pool. Combined with the max-of-all scoring in `abilityScore()`, this means upgrades frequently hit stats that have zero effect on the displayed score.

**Impact:** Wasted booster cards with no visible result.

---

## BUG-005: Player generation is rarity-blind

**Severity:** CRITICAL
**File:** `FM2026/backend/server/src/api/model.js` — `Player.processRoleDefaultStats()` (line 607)
**Related:** `FM2026/backend/server/src/api/services/cardsService.js` line 145
**Date Found:** 4 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — `processRoleDefaultStats(rarity)` now accepts rarity parameter and uses `RarityStatsBonus` table (model.js line 300-305). Stat ranges scaled by: Free (0.8× + 1), Regular (1.0× + 1-10), Rare (1.2× + 20-30), Epic (1.4× + 40-50), Legendary (1.6× + 65-70). Rarity is then recalculated from ability score via `getQualityFromScore()`.

**Description:**
When a player is created from a pack (via `createPlayer()`), the `rarity` parameter is stored on the player object but `processRoleDefaultStats()` ignores it entirely. A Legendary player gets the exact same stat ranges as a Regular player. The rarity is cosmetic only.

**Impact:** Pack tiers are meaningless for player quality. A 0.25 SOL Legendary pack produces statistically identical players to a 0.01 SOL Regular pack. Undermines the entire economy.

**Suggested Fix:** Scale stat generation ranges by rarity tier, e.g. Regular 40-60, Rare 50-70, Epic 60-80, Legendary 75-95.

---

## BUG-006: Trainer generation is also rarity-blind

**Severity:** CRITICAL
**File:** `FM2026/backend/server/src/api/model.js` — `Trainer.processRoleDefaultStats()` (line 1081)
**Date Found:** 9 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — Same `RarityStatsBonus` system applied to trainers. `Trainer.processRoleDefaultStats(rarity)` now scales stat ranges by rarity tier with role-based base ranges (Coach vs Physio vs NoRoles). Lines 1053-1117.

**Description:**
Same issue as BUG-005 but for trainers. Coach stats are generated in the 10-30 range regardless of rarity. A Legendary coach is no better than a Free one at creation.

**Impact:** Same economy undermining as BUG-005.

---

## BUG-007: Practice booster cards not consumed when used

**Severity:** HIGH
**File:** `FM2026/backend/server/src/api/services/matchesService.js` lines 323-334
**Date Found:** 10 February 2026
**Date Fixed:** 13 February 2026

**Status: FIXED** — `practiceMatch()` now validates booster type (`BoosterType.Practice`) and calls `useBooster()` after queueing the match. Lines 340-358.

**Description:**
When a practice match is started via `practiceMatch()`, the booster card validation and consumption are both commented out:
```javascript
//if (booster == null || booster.type != BoosterType.Practice)
//    return false;
...
//await this.api.cardsService.useBooster(club, booster);
```

**Impact:** Practice booster cards are never consumed. Players can run unlimited practice matches without spending any cards. Undermines the card economy.

**Suggested Fix:** Uncomment the validation and `useBooster()` call, or implement a proper card consumption flow.

---

## BUG-008: Marketplace sell price hard-coded at 0.25 SOL

**Severity:** MEDIUM
**File:** `FM2026/Assets/Scripts/UI/Elements/CardItem.cs` line 114
**Date Found:** 10 February 2026

**Description:**
When selling a card on the marketplace, the price is hard-coded:
```csharp
await _gameService.SellCard(_nftCard, 0.25); // TODO: move from here
```
There's no UI for the user to input their desired sell price. All cards are listed at exactly 0.25 SOL regardless of rarity or quality.

**Impact:** No price discovery. Legendary cards sell for the same price as Regular cards. A TODO comment indicates the developer is aware.

**Suggested Fix:** Add a price input popup before listing. Consider suggesting prices based on rarity tier.

---

## Reference: Key Constants

| Constant | Value | Location |
|----------|-------|----------|
| `StatMaxValue` | 100 | `constants.js:14` |
| Booster multiplier (Regular) | 0.05 (+5 pts) | `upgradesService.js:268` |
| Booster multiplier (Rare) | 0.10 (+10 pts) | `upgradesService.js:271` |
| Booster multiplier (Epic) | 0.15 (+15 pts) | `upgradesService.js:274` |
| Booster multiplier (Legendary) | 0.25 (+25 pts) | `upgradesService.js:277` |
| Stats upgraded per booster | 2-3 random | `upgradesService.js:147` |

## Reference: Rarity Tiers

`Free` → `Regular` → `Rare` → `Epic` → `Legendary`

## Reference: Pack Definitions

| Pack ID | Rarity | Price (SOL) | Players | Trainers | Boosters | Kits | Badges |
|---------|--------|-------------|---------|----------|----------|------|--------|
| 0 | Regular | 0.01 | 1 | 1 | 3 | 1 | 1 |
| 1 | Rare | 0.05 | 2 | 2 | 2 | 2 | 1 |
| 2 | Epic | 0.10 | 3 | 3 | 3 | 2 | 2 |
| 3 | Legendary | 0.25 | 3 | 3 | 3 | 2 | 2 |
| 1000 | Free (reward) | 0.00 | 3 | 3 | 3 | 2 | 2 |
