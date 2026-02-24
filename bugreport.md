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
**File:** `FM2026/Assets/Scripts/UI/Elements/CardItem.cs` line 138
**Date Found:** 10 February 2026
**Last Checked:** 16 February 2026

**Status: MOSTLY FIXED** — Pack **buying** now uses `pack.price` from server data (16 Feb overhaul replaced candy machine minting with direct SOL transfer). Card **selling** still hardcoded at 0.25 SOL.

**Description:**
Two separate price issues:

1. ~~**Pack buying:**~~ **FIXED** — `GameService.cs:250` now calls `TransferBalance(pack.price, ...)` using the server-defined price from `packs.json`. The old candy machine minting flow (which had its own pricing) has been completely replaced.

2. **Card selling (STILL BROKEN):** `CardItem.cs:138` still has:
```csharp
await _gameService.SellCard(_nftCard, 0.25); // TODO: move from here (need additional screen or ui to set price)
```
The backend `sell()` method accepts a `price` parameter correctly — this is purely a client UI issue. No price input UI exists.

**Impact:** Card selling has no price discovery. All cards listed at 0.25 SOL regardless of quality. Pack buying is now server-authoritative.

**Suggested Fix:** Add a price input popup/screen before listing cards for sale. Backend is ready.

---

## BUG-009: Unrealistic scorelines (17-32 goals per match)

**Severity:** CRITICAL
**Files:** Multiple match engine files
**Date Found:** 14 February 2026
**Date Fixed:** 16 February 2026

**Status: SUBSTANTIALLY FIXED** — Original 8 root causes addressed (16 Feb), then comprehensive cmp-053 7-area rebalancing applied (18-24 Feb):

**Phase 1 (16 Feb) — Emergency fixes:**

| # | Root Cause | Fix Applied |
|---|-----------|------------|
| 1 | Shot multiplier stacking (8x inside box) | Reduced to 1.44x; distance boost deleted |
| 2 | GK height gate (1.1m, crossbar at 2.44m) | Raised to 2.6m; save range 2m→8m |
| 3 | GK parry pinball (95% parry rate) | Speed penalty halved; catch radius +50%; trajectory prediction |
| 4 | Shot thresholds too low (0.55/0.70) | Raised to 0.72/0.82 |
| 5 | Shot accuracy too generous | 4x inaccuracy multiplier; base error doubled; clamp widened |
| 6 | No pass-vs-shoot intelligence | Vision-based teammate awareness; cross-first priority |
| 7 | Foul rate inflated (0.35 debug value) | Reverted to 0.05 |
| 8 | Decision cooldowns too fast (0.5s uniform) | Action-specific: pass 0.8s, shot 1.5s, dribble 1.2s |

**Phase 2 (18-24 Feb) — cmp-053 comprehensive rebalancing (7/7 areas):**

| # | Area | Change |
|---|------|--------|
| 1 | Decision cadence | Intelligence-based: 0.2s (intel 100) to 4.2s (intel 0). Final-third 0.75x accel. |
| 2 | Ball control time | 0.8-2.0s (was 0.2-0.8s). Even elite players take 1.0s. |
| 3 | Shooting difficulty | Thresholds 0.92/0.97 (was 0.72/0.82). INACCURACY_MULTIPLIER 16x (was 4x). Error 12-40 (was 8-28). Role multipliers reduced. |
| 4 | Shot refractory | 4s hard suppress (0.1x), 8s zone suppress (0.5x). Parry rebound suppressor: 2s after parry, ALL shots 0.2x. |
| 5 | GK effectiveness | Catch 4.5 (was 3.0), Parry 6.5 (was 4.5), Dive 7.5 (was 6.0). Reaction 100ms (was 30ms). |
| 6 | Ball physics | Air drag +60% (0.024), Ground decel +30% (8.5). Control lock 1.5s (was 0.6s). |
| 7 | Dead-ball time | FK/Corner 12s (was 8s/4s). TI/GK/KO 6s. Per-type setup delays. Celebration 8-12s. |

**Description:**
The match engine produced absurd scorelines (17-32 goals per match) due to 6 compounding issues that created a feedback loop: excessive shooting (8x multipliers inside box) → shots too accurate (tight clamping) → GK can't save (height gate + parry-only) → parry rebounds → immediate re-shot (fast cooldowns) → goal. Average real football match: 2-4 goals total.

**Impact:** Match results were meaningless. League standings were random noise. Phase 1 reduced to ~4-10 goals. Phase 2 targets realistic 2-4 goals. **Verification testing needed.**

**Previously remaining concerns (now addressed):**
- ~~Flat cooldowns removed intelligence differentiation~~ → **FIXED:** Intelligence-based 0.2-4.2s intervals restored
- ~~Risk of over-correction~~ → Mitigated by per-area calibration and refractory system (graduated suppression rather than blanket nerfs)
- 2.6m ball pickup still applies to ALL players, not just GK — field players may collect aerial balls (minor)

---

## BUG-010: NFT buy lock timing — Date arithmetic bug

**Severity:** MEDIUM
**File:** `FM2026/backend/server/src/api/services/marketplaceService.js` lines 153, 185, 208-209
**Date Found:** 16 February 2026

**Status: OPEN**

**Description:**
Three places in `marketplaceService.js` use `new Date() + Constants.NFTDefaultBuyLockDuration` to compute lock expiry times. In JavaScript, adding a Number to a Date object produces **string concatenation**, not date arithmetic:

```javascript
// What it does:
new Date() + 300000
// Result: "Sun Feb 16 2026 16:30:00 GMT+0000300000" (a string!)

// What it should do:
new Date(Date.now() + 300000)
// Result: Date object 5 minutes in the future
```

Affected locations:
- `cancelSell()` line 153 — lock check for cancel
- `buy()` line 185 — lock check for buy
- `buyConfirm()` lines 208-209 — lock check for confirm

**Impact:** The lock duration comparison always evaluates incorrectly, meaning the buy lock mechanism (intended to prevent race conditions during NFT purchases) does not work as designed. Items may be purchasable simultaneously by multiple users, or lock checks may fail unexpectedly.

**Suggested Fix:**
```javascript
// Replace all instances of:
new Date() + Constants.NFTDefaultBuyLockDuration
// With:
new Date(Date.now() + Constants.NFTDefaultBuyLockDuration)
```

---

## BUG-011: getSolPriceInUSD() is a dead stub

**Severity:** LOW
**File:** `FM2026/backend/server/src/api/services/marketplaceService.js` lines 256-261
**Date Found:** 16 February 2026

**Status: OPEN**

**Description:**
The `getSolPriceInUSD()` method is called during marketplace initialization but does nothing useful:
```javascript
async getSolPriceInUSD(){
    this.solPriceInUSD = 1.0;
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";
    // TODO: fetch
}
```
The CoinGecko URL is a dangling string literal (not fetched). `solPriceInUSD` is hardcoded to 1.0.

**Impact:** Any SOL-to-USD conversion assumes 1 SOL = 1 USD. Currently no features depend on this value, but it would be incorrect if used for display pricing.

**Suggested Fix:** Implement the fetch or remove the stub to avoid confusion.

---

## BUG-012: Sacrifice in upgradeInternal() calls deleteTrainer() even for player upgrades

**Severity:** HIGH
**File:** `FM2026/backend/server/src/api/services/upgradesService.js` lines 273-277
**Date Found:** 23 February 2026

**Status: OPEN**

**Description:**
`upgradeInternal()` is a shared function called by both `upgradePlayer()` and `upgradeTrainer()`. At the end of the function, when a sacrifice target exists, it always calls:
```javascript
if(targetToSacrifice){
    // TODO burn NFT
    await this.api.nftService.deleteNFTById(targetToSacrifice.nft_id);
    await this.squadService.deleteTrainer(targetToSacrifice);  // ← WRONG for player sacrifices
}
```
`squadService.deleteTrainer()` deletes from the `trainers` DB table. When `upgradePlayer()` passes a **player** as `targetToSacrifice`, this incorrectly attempts to delete the player from the `trainers` table. The `players` table record is never deleted.

**Impact:** When a player is sacrificed during another player's upgrade:
- The NFT is correctly deleted (`deleteNFTById` uses the `nft_id` which is table-agnostic)
- The player record is **NOT** deleted from the `players` table (wrong table targeted)
- The player becomes a DB orphan: exists in the squad but has no associated NFT
- The sacrificed player effectively disappears from the UI (no NFT) but may persist in DB queries

**Confirmed by:**
- `squadRepository.js:469` — `deletePlayer()` targets the `players` table
- `squadRepository.js:473` — `deleteTrainer()` targets the `trainers` table
- `upgradesService.js:276` — only `deleteTrainer()` is called regardless of upgrade type

**Suggested Fix:** Move the sacrifice deletion out of `upgradeInternal()` into each caller:
- `upgradePlayer()` should call `squadService.deletePlayer(targetToSacrifice)`
- `upgradeTrainer()` should call `squadService.deleteTrainer(targetToSacrifice)`

---

## BUG-013: injury stat included in rarity-scaled generation — Legendary players start near-fully injured

**Severity:** MEDIUM
**File:** `FM2026/backend/server/src/api/model.js` — `Player.processRoleDefaultStats()` lines 693-745
**Date Found:** 23 February 2026

**Status: OPEN**

**Description:**
`processRoleDefaultStats(rarity)` generates all player stats using the `RarityStatsBonus` scaling table. The `statsToChange` dict (line 693) includes `injury: [8, 12]` — meaning the `injury` field is scaled by rarity along with football skill stats.

With `RarityStatsBonus`:
- Regular: `min = floor(8 × 1.0) + 1 = 9`, `max = floor(12 × 1.0) + 10 = 22`
- Epic: `min = floor(8 × 1.4) + 40 = 51`, `max = floor(12 × 1.4) + 50 = 66`
- Legendary: `min = floor(8 × 1.6) + 65 = 77`, `max = floor(12 × 1.6) + 70 = 89`

Evidence that `injury` is a current-injury accumulator (higher = more injured):
- `heal()` in `upgradesService.js:84` sets `targetToBoost.injury = 0` (recovering = zero injury)
- `heal()` records `upgradeDetails.stats["injury"] = -targetToBoost.injury` (negative delta = injury reduced)
- `matchesService.js:156` does `players[i].injury += injury` (injury accumulates over matches)

**Impact:** Legendary players are generated with 77–89 injury points, meaning they begin the game nearly fully injured despite being the highest-value tier. All `Legendary` and `Epic` cards are effectively unplayable at generation until healed. This contradicts the premium pricing of those tiers and undermines the card economy.

**Note:** `fitness` is also in `statsToChange` with [8, 12] range. For Regular rarity this gives initial fitness of 9–22/100. It is unclear whether this is intentional (low initial fitness as a gameplay mechanic) or also a bug. Legendary players would have fitness 77–89 which is reasonable if fitness is "higher = better" — only `injury` is clearly wrong.

**Suggested Fix:** Remove `injury` from `statsToChange` in `processRoleDefaultStats()` and initialise it to `0` separately after the rarity loop, ensuring all players start uninjured regardless of rarity.

---

## Security Notes (non-bug observations)

1. **JWT secret shared with client:** `Constants.JWTSignPassword` in `constants.js` is identical to the value in `GameService.cs:128`. The Unity client can forge JWT tokens. In production, the client should never know the signing secret.

2. **SecureData = false:** `constants.js` has `SecureData = false` with comment "Make sure its TRUE in production!" This flag likely controls encryption or validation. Should be verified before any production deployment.

3. **Solana devnet only:** NFT operations target devnet. No mainnet configuration exists.

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

## Reference: Pack Definitions (updated 16 Feb 2026)

| Pack ID | Rarity | Price (SOL) | Players | Trainers | Boosters | Kits | Badges | Notes |
|---------|--------|-------------|---------|----------|----------|------|--------|-------|
| 0 | Regular | 0.01 | 1 | 1 | 3 | 1 | 1 | |
| 1 | Rare | 0.05 | 2 | 2 | 2 | 2 | 1 | |
| 2 | Epic | 0.10 | 3 | 3 | 3 | 2 | 2 | |
| 3 | Legendary | 0.25 | 3 | 3 | 3 | 2 | 2 | |
| 4 | Legendary | 0.00 | 5 | 5 | 10 | 5 | 5 | Promo/admin pack (free, legendary contents) |
| 1000 | Free (hidden) | 0.00 | 3 | 3 | 3 | 2 | 2 | Reward pack — contents changed from legendary to **rare** (16 Feb) |
