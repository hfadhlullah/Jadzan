# PRD Addendum — Prayer Engine (TV)

| Metadata | Details |
| :--- | :--- |
| **Feature** | Prayer Engine (TV) |
| **Parent Epic** | CORE |
| **Status** | Ready for Development |
| **Stories** | JADZ-016, JADZ-017, JADZ-018, JADZ-019 |

---

## 1. Feature Overview

The Prayer Engine is the heart of the Jadzan TV App. It calculates the 5 daily prayer times locally using `adhan-js` based on the Mosque's coordinates and calculation method, then drives a Finite State Machine (FSM) that controls the entire display experience — from idle media rotation, to pre-Adzan warnings, to the Iqomah countdown.

---

## 2. User Stories

| ID | Story | Acceptance Criteria (Given-When-Then) |
| :--- | :--- | :--- |
| US-01 | As a worshipper, I can see the current time and all 5 prayer times on the TV at all times so I know when the next prayer is. | **Given** the TV is in Idle state, **When** I look at the screen, **Then** I see a sidebar showing the current time and all 5 prayer times with the next prayer highlighted. |
| US-02 | As a worshipper, I see a clear "Approaching Asr" warning 5 minutes before Adzan so I can prepare. | **Given** it is T-5 mins before Asr, **When** the timer ticks, **Then** the display transitions to PRE_ADZAN state — media hides, warning message appears. |
| US-03 | As a worshipper, I see a large Iqomah countdown in MM:SS format after Adzan so I know exactly when Jama'ah starts. | **Given** Adzan time has arrived, **When** the Admin-configured delay starts, **Then** a full-screen digital countdown timer is shown in large numerals. |
| US-04 | As a worshipper, I see a calm "Prayer Time — Please Straighten Rows" screen during Jama'ah so there is no distraction. | **Given** the Iqomah countdown reaches 00:00, **When** the timer fires, **Then** the screen transitions to PRAYER_ACTIVE state — dark screen with Arabic message. |

---

## 3. Display State Machine

```
[IDLE] ──(T-5 min)──► [PRE_ADZAN] ──(T=0)──► [ADZAN] ──(+delay)──► [IQOMAH] ──(00:00)──► [PRAYER_ACTIVE]
  ▲                                                                                                │
  └──────────────────────────────── (T + est. prayer duration ~15min) ────────────────────────────┘
```

| State | Trigger | Duration | Display |
| :--- | :--- | :--- | :--- |
| `IDLE` | Default | Until T-5 | Clock + Prayer Sidebar + Media + Ticker |
| `PRE_ADZAN` | T-5 mins | 5 mins | "Approaching [Prayer]" warning, no media |
| `ADZAN` | T=0 | 1 min | "Adzan [Prayer]" full overlay |
| `IQOMAH` | T + 1min | `iqomah_delays.[prayer]` mins | Countdown MM:SS |
| `PRAYER_ACTIVE` | IQOMAH = 00:00 | 15 mins (fixed) | Dark + "صفوا واعتدلوا" |

---

## 4. ERD Delta

None. This feature reads `mosques.latitude`, `mosques.longitude`, `mosques.timezone`, `mosques.calculation_method`, and `mosques.iqomah_delays` — all set in `JADZ-008/009`.

---

## 5. Integration Notes

*   **Library**: `adhan` (npm package `adhan` — same library as `adhan-js`).
*   **Refresh**: Times are recalculated daily at midnight (or on app boot).
*   **Midnight Rollover**: After Isha, the "next prayer" must resolve to the *next day's* Fajr.
*   **Offline**: `adhan` is a pure calculation library — it works fully offline without any API calls.
*   **Config sync**: When `mosques` config changes (Realtime), the Prayer Engine must recalculate times immediately.
