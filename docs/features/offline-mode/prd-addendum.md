# PRD Addendum — Offline Mode

| Metadata | Details |
| :--- | :--- |
| **Feature** | Offline Mode |
| **Parent Epic** | CORE |
| **Status** | Ready for Development |
| **Stories** | JADZ-027, JADZ-028, JADZ-029, JADZ-030, JADZ-031 |

---

## 1. Feature Overview

Offline Mode ensures the TV App degrades gracefully when the Mosque's internet connection is lost. Since the display runs 24/7 and internet reliability in Mosques can be poor, the TV must continue to show accurate prayer times, cached media, and ticker announcements without any network access — for an indefinite period.

---

## 2. User Stories

| ID | Story | Acceptance Criteria (Given-When-Then) |
| :--- | :--- | :--- |
| US-01 | As a worshipper, I still see correct prayer times when the internet is down so the display never goes blank. | **Given** the TV loses internet, **When** the app is running, **Then** prayer times continue displaying from local cache with no interruption. |
| US-02 | As a worshipper, I still see the media carousel when offline so Zone B is never empty. | **Given** the TV loses internet after syncing media, **When** the carousel runs, **Then** locally cached images/videos continue rotating. |
| US-03 | As a Mosque staff member, I can see a subtle badge showing "Offline" so I know to check the router. | **Given** the TV has no network, **When** I look at the screen, **Then** a small "Offline" badge is visible in a non-intrusive corner. |
| US-04 | As a TV App, when internet is restored, I automatically re-sync any changes from the Admin without manual restart. | **Given** the TV was offline during Admin content changes, **When** internet is restored, **Then** new content syncs and carousel updates within 60 seconds. |

---

## 3. Offline Data Architecture

```
AsyncStorage Keys (Persisted on every successful sync):
  ├── @jadzan/mosque_config    → { name, lat, long, timezone, calculation_method, iqomah_delays }
  ├── @jadzan/screen_id        → "uuid-string"
  ├── @jadzan/media_manifest   → [ { id, url, localUri, duration, type } ]
  └── @jadzan/announcements    → [ { id, text } ]

FileSystem Cache (expo-file-system):
  └── documentDirectory/media/{media_id}.{ext}  → Downloaded media files
```

### Offline Priority Order (on boot):
1. Load `screen_id` from AsyncStorage.
2. Try fetching fresh config from Supabase.
3. **If offline** → Load `mosque_config` from AsyncStorage.
4. Load `media_manifest` from AsyncStorage → serve from FileSystem.
5. Load `announcements` from AsyncStorage.
6. Start prayer engine with cached config.

---

## 4. ERD Delta

None. No new DB tables required. All offline state is managed in device-local AsyncStorage + FileSystem.

---

## 5. Integration Notes

- **Prayer Times**: `adhan-js` is a pure calculation library — works 100% offline. No caching needed for prayer times themselves, only for the config (lat/long/method).
- **Reconnection**: Use `@react-native-community/netinfo` to detect network restoration and trigger a sync.
- **Exponential Backoff**: Failed API calls retry at 5s → 10s → 30s → 60s intervals (max). Reset on success.
- **"First Boot Offline"**: If the device has never successfully synced (empty AsyncStorage + offline), show "No configuration found. Please connect to the internet to activate this device." Full offline mode only works after at least one successful sync.
