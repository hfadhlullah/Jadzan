# Jadzan
## Executive Summary

**A comprehensive digital signage solution for Mosques, delivering accurate prayer times, community news, and engaging media.**

---

## At a Glance

|                   |                                        |
| ----------------- | -------------------------------------- |
| **Product Type**  | Digital Signage / Mosque Management    |
| **Target Market** | Mosque Owners & Administrators         |
| **Platform**      | Android TV (Display) + Web (Admin)     |
| **Technology**    | Android, Web (TBD Stack), Prayer APIs  |
| **Status**        | Project Kickoff                        |
| **Business Model**| One-time Purchase (Sideloaded APK)     |

---

## What is Jadzan?

Jadzan is a dual-interface system designed to modernize Mosque communication. It consists of an **Android TV application** that serves as a dynamic information display for worshippers and a **Web-based Admin Panel** for Mosque staff to manage content remotely.

### The Problem We Solve

| Challenge | Impact |
| POOR_VISIBILITY | Worshippers often miss exact Adzan/Iqomah timings or get confused about how much time is left before prayer starts. |
| STATIC_INFO | Traditional notice boards are hard to update, leading to outdated event information or lack of awareness about Mosque activities. |
| ENGAGEMENT | Mosques struggle to communicate community news or fetch donations effectively without a dynamic visual medium. |
| GENERIC_TOOLS | Generic digital signage software lacks specific "Mosque Logic" (e.g., pausing content during prayer, specific countdowns). |

### Our Solution

A specialized display system that automatically fetches accurate prayer times based on location, manages the critical "Iqomah countdown" to synchronize the congregation, and utilizes idle time to display community media and news tickers.

```
[Admin Panel (Web)]  --->  [Backend/Database]  --->  [Android TV Display]
   - Set Location             - Store Settings          - Fetch Prayer Times
   - Upload Media             - Sync Content            - Show Countdown
   - Type News                                          - Rotate Media
```

---

## Core Capabilities

### 1️⃣ Smart Prayer Display
- **Auto-Location**: Fetches accurate Adzan times via API (e.g., Aladhan) based on Mosque coordinates.
- **Dynamic Backgrounds**: Context-aware wallpapers or themes alongside time display.
- **Approaching Alert**: Visual countdown when Adzan time is near to prepare the congregation.
- **Offline Resilience**: Caches prayer times and media locally; continues to function without internet.

### 2️⃣ Iqomah Management
- **Configurable Timer**: Set specific countdown durations between Adzan and Iqomah for each prayer.
- **Focus Mode**: Screen adapts (e.g., turns black or shows simple clock) during prayer to avoid distraction.

### 3️⃣ Community Information
- **Media Carousel**: Rotates uploaded posters, event announcements, or educational images (local upload).
- **News Ticker**: Scrolling bottom marquee for short text announcements (e.g., "Review of Quran after Maghrib").
- **Admin Control**: Web dashboard to update all content without touching the TV.

---

## Key Benefits

| Benefit | Description |
| ----------------- | ---------------------------------------------------- |
| **⏱️ Accuracy** | Automatically stays synced with astronomical prayer times. |
| **✅ Organization** | Reduces chaos by clearly showing when the congregation (Jama'ah) will start. |
| **📊 Engagement** | Increases attendance at events through prominent digital visibility. |
| **🔐 Ease of Use** | Simple web interface for admins; "set and forget" for the TV. |

---

## User Roles Supported

| Role | Primary Functions |
| ------------ | ----------------------------------- |
| **Mosque Owner / Admin** | Configures location, sets Iqomah timers, uploads media, updates news ticker via Web Dashboard. |
| **Worshipper (Jama'ah)** | Views prayer times, waits for Iqomah countdown, reads announcements while waiting. |

---

## Roadmap Considerations

### Current Scope (MVP)
- Android TV App (Client).
- Web Dashboard (Admin).
- Basic Auth for Admin.
- Prayer Time API Integration.
- Local Media Upload & Hosting.
- Text News Ticker.

### Future Enhancements
| Priority | Enhancement |
| -------- | ------------------------- |
| Medium | Multi-screen synchronization for large Mosques. |
| Low | Donation QR code integration with real-time tracking. |
| Low | Live stream integration for Friday sermons. |

---

## Document Information

|                        |                                |
| ---------------------- | ------------------------------ |
| **Version**            | 1.0.0                          |
| **Date**               | 2026-02-19                     |
| **Classification**     | Internal - Executive Summary   |
| **Full Specification** | See `docs/prd.md`              |
