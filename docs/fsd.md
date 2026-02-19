# System Architecture & Global FSD (Detailed)

| Metadata      | Details |
| :---          | :--- |
| **System**    | Jadzan Core Architecture |
| **Version**   | 1.0.0 (Global FSD) |
| **Status**    | Approved |

---

## 1. System Overview

Jadzan operates as a **Cloud-connected Distributed System**.
1.  **Central Node (Web Admin)**: Configures global settings (Mosque location, prayer calculation method) and content.
2.  **Edge Node (Android TV)**: Retrieves configuration, calculates prayer times locally (for resilience), and displays content.

### Offline Strategy
*   **Source of Truth**: Supabase (Cloud Database).
*   **Execution Runtime**: Local Device (TV).
*   **Sync Mechanism**: 
    1.  **Boot**: TV fetches full configuration + media URLs.
    2.  **Realtime**: TV subscribes to `screens` table changes via Supabase Realtime.
    3.  **Fallback**: If offline, TV loads last known state from AsyncStorage.

## 2. Data Dictionary (Schema)

### 2.1 Core Entities

#### `mosques`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Mosque identifier. |
| `name` | Text | Display name (e.g., "Masjid Al-Falah"). |
| `latitude` | Float | For prayer calculation. |
| `longitude` | Float | For prayer calculation. |
| `timezone` | Text | IANA format (e.g., "Asia/Jakarta"). |
| `calculation_method` | Text | Enum (KEMENAG, MWL, ISNA, etc.). |
| `iqomah_delays` | JSON | `{fajr: 20, dhuhr: 10, asr: 10, maghrib: 10, isha: 10}` (minutes). |
| `created_at` | Timestamptz | Record creation. |

#### `screens`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Screen identifier. |
| `mosque_id` | UUID (FK) | Reference to `mosques.id`. |
| `name` | Text | Screen label (e.g., "Women's Area"). |
| `pairing_code` | Text | 6-char code (e.g., "XJ9-22") for initial setup. |
| `token` | Text | Use for persistent device auth (if needed beyond pairing). |
| `status` | Text | Enum (ACTIVE, OFFLINE, PENDING). |
| `orientation` | Text | Enum (LANDSCAPE, PORTRAIT). Default: LANDSCAPE. |

#### `media`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Media identifier. |
| `mosque_id` | UUID (FK) | Reference to `mosques.id`. |
| `type` | Text | Enum (IMAGE, VIDEO). |
| `url` | Text | Public URL to storage bucket. |
| `label` | Text | Admin-friendly name (e.g., "Eid Poster"). |
| `duration` | Integer | Display duration in seconds (default: 10). |
| `target_screens` | UUID[] | Array of `screens.id`. NULL = All Screens. |
| `is_active` | Boolean | Whether to show in rotation. |

#### `announcements` (Ticker)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Ticker identifier. |
| `mosque_id` | UUID (FK) | Reference to `mosques.id`. |
| `text` | Text | Content (e.g., "Meeting Tonight"). |
| `is_active` | Boolean | Whether to show in ticker. |

## 3. Global Rules & Logic

### 3.1 Prayer Time Calculation
*   **Logic**: 
    1.  TV app fetches `mosque.latitude`, `mosque.longitude`, `mosque.calculation_method`, `mosque.timezone`.
    2.  Uses `adhan-js` library locally to generate times for the current day.
    3.  **Adjustment**: Apply `iqomah_delays` to calculate `Iqomah Time`.

### 3.2 Display States (Finite State Machine)
*   **IDLE**: Standard rotation (Clock + Next Prayer Info + Media Carousel + Ticker).
*   **PRE_ADZAN**: (T - 5 mins) Stop Media. Show Warning "Approaching [Prayer]".
*   **ADZAN**: (T = 0) Play Sound (optional). Show "ADZAN [Prayer]".
*   **IQOMAH_COUNTDOWN**: (T + X mins) Show Countdown "Iqomah in MM:SS".
*   **PRAYER_ACTIVE**: (T + Iqomah Time) Turn Screen Dark / Static Message "Please Straighten Rows".
*   **POST_PRAYER**: (T + PRAYER_DURATION) Return to **IDLE**.

### 3.3 Security & Auth
*   **Admins**: Standard JWT Auth via Supabase (Email/Pass).
*   **Screens**: 
    *   Row Level Security (RLS) ensures `screen` can only query data where `mosque_id` matches its assigned mosque.
    *   Media updates are protected; Public URLs are read-only for authenticated devices.

## 4. API Endpoints (Conceptual)

### 4.1 Admin Actions
*   `POST /api/mosque/setup`: Create initial mosque profile.
*   `POST /api/screens/pair`: Admin inputs code -> Links `screen` row to `mosque_id`.
*   `GET /api/media`: List all media for mosque.
*   `POST /api/media/upload`: Handle file upload to storage.

### 4.2 TV Actions
*   `GET /api/config`: Fetch full Mosque config (Lat/Long/Delays/Media/Ticker).
*   `GET /api/sync`: Lightweight "check for updates" (or Realtime subscription).
