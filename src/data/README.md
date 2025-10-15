# Game Data

This folder contains the game's data definitions that can be easily managed and updated.

## Files

### `locations.ts`
Contains all game locations with their details:
- **philippines** (starting location)
- **singapore**
- **hongkong** 
- **dubai**
- **switzerland**
- **macau**

Each location includes:
- Name and description
- Connected locations (for travel)
- Location image (Unsplash)
- 3 witnesses with their details

**Images Updated:**
- Philippines: Rizal Park/Luneta, Manila
- Hong Kong: Corrected to actual Hong Kong skyline (was Sydney)
- Macau: Corrected to actual Macau casinos (was Japan)
- Switzerland: Swiss Alps/Zermatt (Matterhorn)

### `suspects.ts`
Contains suspect creation logic:
- `createSuspect()` generates a new suspect with a **random location** each game
- Prevents suspect from always being in Dubai
- Location is randomized from all cities except Philippines (starting point)

## How to Modify

### Add a New Location
1. Open `locations.ts`
2. Add new location key and object to `locations` export
3. Update `connections` arrays in other locations to link to new location
4. Find appropriate Unsplash image URL

### Change Suspect Details
1. Open `suspects.ts`
2. Modify the `createSuspect()` function
3. Update appearance, hobby, vehicle, or trait fields

### Add More Suspects
Expand the `createSuspect()` function to randomly select from multiple suspects.

## Notes
- Suspect location is generated **once per game** using `useMemo()` in the game component
- This ensures the location stays consistent throughout a single playthrough
- Reloading the game creates a new random location
