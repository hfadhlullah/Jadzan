# Product Requirements Document (PRD)

| Metadata      | Details |
| :---          | :--- |
| **Product**   | Jadzan |
| **Version**   | 1.0.0 (MVP) |
| **Timeline**  | 3 Days (Target MVP) |
| **Status**    | Draft |
| **Team**      | @rzr (Lead) |

---

## 1. Overview
Jadzan is a digital signage solution designed specifically for Mosques to display prayer times, Iqomah countdowns, and community information. It consists of an Android TV application (display client) and a web-based Admin Panel (management). The system prioritizes accuracy, offline resilience, and "Mosque-specific" logic (e.g., silencing content during prayer).

## 2. Objectives
### Business Goals
*   **Establish a "Set & Forget" Solution**: Mosques should not need daily manual intervention.
*   **Support Sideloading**: Distribute via direct APK download (bypassing Play Store/Google dependencies) to allow use on cheap/custom Android TV boxes.
*   **Hardware Agnostic**: Run on any Android TV device (Stick, Box, TV).

### User Goals
*   **Clarity**: Worshippers immediately know the *exact* prayer time and how long until Iqomah.
*   **Reliability**: The adzan clock must work even if the internet goes down.
*   **Flexibility**: Admins can target specific screens (e.g., "Women's Area") with relevant announcements.

## 3. Success Metrics
| Metric | Target | Measurement |
| :--- | :--- | :--- |
| **Uptime** | 24/7 | App auto-restarts on boot; no crashes observed over 48h. |
| **Update Speed** | < 1 min | Time from Admin save to TV update (when online). |
| **Install Speed** | < 5 mins | Time to install APK + Pair device. |
| **Offline Sync** | 100% | Prayer times for the next 30 days are cached locally. |

## 4. Scope
### ✅ In-Scope (MVP)
*   **Android TV App**:
    *   Auto-start on boot.
    *   Fetch/Cache Prayer Times (Aladhan API).
    *   Display Current Time & Next Prayer Countdown.
    *   Iqomah Countdown (configurable duration).
    *   Device Pairing (Code display).
    *   Offline Mode (Cache valid for X days).
    *   Media Carousel (Image/Video).
    *   News Ticker (Text).
*   **Web Admin Panel**:
    *   Admin Login (Email/Pass).
    *   Mosque Profile (Location/Coords).
    *   Device Management (Add/Remove Screens).
    *   Content Management (Upload Media, Edit Ticker).
    *   Configuration (Iqomah durations per prayer).
*   **Distribution**:
    *   Direct APK Build & Download Link.

### ❌ Out-of-Scope (v1)
*   Play Store Publishing.
*   Multi-Mosque SaaS (Tenant isolation is ensuring, but billing is out).
*   Live Streaming Integration.
*   Hardware procurement.

## 5. User Roles
| Role | Responsibility |
| :--- | :--- |
| **Super Admin** | System owner (can manage all Mosques if needed). |
| **Mosque Admin** | Manages their specific Mosque's settings, content, and devices. |
| **Display (TV)** | Unattended "Kiosk" role; authenticated via device code. |

## 6. User Flows
### 6.1 Device Pairing (First Run)
1.  **TV**: Installing APK & Opening App.
2.  **TV**: Checks for local token. If none, generates a 6-digit `PAIRING_CODE` (e.g., "XJ9-22").
3.  **TV**: Displays: "Visit [URL] and enter code: XJ9-22".
4.  **Admin**: Logs into Web Dashboard.
5.  **Admin**: Navigates to "Screens" -> "Add Screen".
6.  **Admin**: Enters "XJ9-22" and names it (e.g., "Main Hall").
7.  **Backend**: Links Device ID to Mosque ID.
8.  **TV**: Receives success socket/poll -> Downloads config -> Shows Dashboard.

### 6.2 Content Update (Offline Logic)
1.  **Admin**: Uploads a new poster for "Eid Charity".
2.  **Backend**: Stores file; updates `manifest.json` for that Mosque/Screen.
3.  **TV**: Polls `manifest.json` (every 1 min).
4.  **TV**: Detects change -> Downloads new poster -> Caches to disk.
5.  **TV**: Updates carousel.
6.  *Network Cut*: TV continues cycling cached media and calculating prayer times locally.

### 6.3 Prayer & Iqomah Cycle
1.  **Normal State**: Show Clock, Next Adzan Time (e.g., 15:30), Media Carousel, Ticker.
2.  **Pre-Adzan (T-5 min)**: Show "Approaching Asr" warning. Hide Media.
3.  **Adzan Time (T=0)**: Play Adzan Audio (optional) / Show "Adzan Now".
4.  **Iqomah Countdown**: Show countdown timer (e.g., 10:00 -> 00:00).
5.  **Prayer Time**: Screen goes blank/dim or shows static "Please Straighten Rows".
6.  **Post-Prayer**: Return to Normal State after X mins.

## 7. Data Requirements
### 7.1 Entities
*   **Mosque**: `id`, `name`, `lat`, `long`, `timezone`.
*   **Screen**: `id`, `mosque_id`, `name`, `pairing_code`, `token`, `orientation`.
*   **Media**: `id`, `mosque_id`, `type` (image/video), `url`, `duration`, `valid_screens` (array).
*   **Config**: `iqomah_delays` (json: {fajr: 20, dhuhr: 10...}).

## 8. Open Questions
| Question | Status |
| :--- | :--- |
| Prayer Calculation Method? | Use Standard (Kemenag/MWL) defaults based on location. |
| Adzan Audio? | Include default beep/audio? Yes, basic file included. |

## 9. Assumptions
*   TVs will effectively be "Kiosks" (users won't exit the app).
*   Admins have a basic smartphone/laptop to access the dashboard.
