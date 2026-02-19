# Feature List (Jadzan)

| Feature | Type | Status | Priority |
| :--- | :--- | :--- | :--- |
| **[FOUNDATION] Project Scaffold** | Setup | [x] | P0 (Blocker) |
| **[CORE] Mosque Configuration** | Admin Feature | [x] | P0 |
| **[CORE] TV Pairing Flow** | Mobile Feature | [x] | P0 |
| **[CORE] Prayer Engine (TV)** | Mobile Feature | [x] | P0 |
| **[CORE] Content Manager** | Admin Feature | [x] | P1 |
| **[CORE] Offline Mode** | Mobile Feature | [x] | P1 |

---

## Detailed Breakdown

### [FOUNDATION] Project Scaffold
*   Init Next.js 14 (Admin).
*   Init Expo (TV).
*   Init Supabase (Schema Migration, Types).
*   Basic Auth flows (NextAuth / Supabase Auth).

### [CORE] Mosque Configuration
*   Interactive Map or Coords Input.
*   Timezone selector.
*   Iqomah Delay settings per prayer.
*   Calculation Method (Kemenag, MWL, etc.).

### [CORE] TV Pairing Flow
*   TV: Generate 6-digit code, display on screen.
*   Admin: "Add Screen" form, input code.
*   Backend: Validate code, link `screen_id` to `mosque_id`.
*   TV: Receive success, persist `screen_id`.

### [CORE] Prayer Engine (TV)
*   Integrate `adhan-js`.
*   Calculate 5 daily times based on Mosque Coords.
*   Implement State Machine (Idle -> Adzan -> Iqomah -> Prayer).
*   Audio playback trigger (optional).

### [CORE] Content Manager
*   Admin: Upload Image/Video to storage.
*   Admin: Assign to all screens or specific screens.
*   Admin: Update Ticker text.
*   TV: Download new media, cache to filesystem.

### [CORE] Offline Mode
*   TV: Persist last known Config & Media URLs.
*   TV: Graceful fallback if `fetch` fails (use cached data).
*   TV: Retry logic (Expontential Backoff).
