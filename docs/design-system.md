# Design System (Jadzan)

| Metadata      | Details |
| :---          | :--- |
| **System**    | Jadzan Visual Language |
| **Version**   | 1.0.0 |
| **Status**    | Approved |

---

## 1. Brand & Theme

The **Jadzan** visual identity blends **Traditional Islamic Aesthetics** with **Modern Digital Utility**. The core philosophy is **"Reverence through Clarity"** — information must be legible from a distance (10m+) while maintaining a sacred atmosphere.

### 1.1 Color Palette

#### Primary Colors
*   **Emerald Green**: `#059669` (Primary Action, Prayer Active).
*   **Gold / Amber**: `#D97706` (Accent, Iqomah Warning, Highlights).
*   **Midnight Blue**: `#1E293B` (Background Surface, Deep Contrast).

#### UI Colors (Dark Mode Default)
*   **Background**: `#0F172A` (Rich almost-black, better than pure #000).
*   **Surface**: `#1E293B` (Card backgrounds).
*   **Text Primary**: `#F8FAFC` (High legibility white).
*   **Text Secondary**: `#94A3B8` (Subtitles, less critical info).
*   **Border**: `#334155` (Subtle separation).

### 1.2 Typography

#### Font Stack
*   **Primary (Latin)**: `Inter` (Google Fonts) — Clean, modern, highly legible at distance.
*   **Secondary (Arabic)**: `Amiri` (Google Fonts) — Classic Naskh style for Quranic verses/Prayer Names.
*   **Monospace**: `JetBrains Mono` (Technological/Code elements if needed).

#### Scale (TV Optimized)
*   **Display XL**: `96px` (Current Time).
*   **Display L**: `64px` (Iqomah Countdown).
*   **Heading 1**: `48px` (Prayer Name).
*   **Body**: `24px` (News Ticker info).
*   **Caption**: `16px` (Metadata, Hijri Date).

---

## 2. Layout & Grid

### 2.1 TV Interface (Landscape 16:9)

The TV interface uses a **Split-Screen** layout to ensure critical prayer information is *always* visible, even while media plays.

*   **Zone A (Prayer Sidebar)**: 
    *   **Width**: 25% (Right-aligned or Left-aligned based on setting).
    *   **Content**: Digital Clock, 5 Prayer Times List (Highlight current/next), Hijri Date.
    *   **Behavior**: Always visible (sticky).

*   **Zone B (Media Stage)**: 
    *   **Width**: 75%.
    *   **Content**: Media Carousel (Images/Videos), Announcements.
    *   **Behavior**: Fades out during Adzan/Iqomah events to focus attention.

*   **Zone C (Ticker)**:
    *   **Height**: Fixed bottom bar (60px).
    *   **Content**: Scrolling text news.
    *   **Behavior**: Continuous loop.

### 2.2 Admin Interface (Web)
*   Standard Admin Dashboard using **Shadcn UI** components.
*   **Sidebar**: Navigation (Mosque, Screens, Media, Settings).
*   **Content Area**: Card-based layouts for forms/tables.

---

## 3. Core Components

### 3.1 Prayer Card (TV)
*   **State: Upcoming**: Dimmed background, secondary text color.
*   **State: Next**: Highlighted border (Gold), distinctive icon.
*   **State: Active**: Full Primary Color background (Emerald), white text.
*   **Content**:
    *   `Icon` (Sun/Moon phase).
    *   `Name` (English + Arabic subtext, e.g. "Maghrib / المغرب").
    *   `Time` (HH:mm).

### 3.2 Countdown Timer (TV)
*   **Style**: **Digital Clock** (MM:SS).
*   **Visual**: Large numerals, monospaced font for stability.
*   **Color Logic**:
    *   `> 5 min`: Green.
    *   `< 5 min`: Amber/Gold.
    *   `< 1 min`: Red (Urgency).

### 3.3 Media Carousel
*   **Container**: Aspect ratio preserving container.
*   **Transitions**: Smooth fade (500ms).
*   **Overlay**: Gradient overlay at bottom for text legibility if caption exists.

---

## 4. Iconography
*   **Library**: `Lucide React` (Matches Shadcn UI).
*   **Key Icons**:
    *   `Moon`: Isha/Fajr.
    *   `Sun`: Dhuhr/Asr.
    *   `Sunset`: Maghrib.
    *   `Volume2`: Adzan Active.
    *   `VolumeX`: Silent Mode (Prayer).
    *   `Wifi`: Online Status.
    *   `WifiOff`: Offline Warning.
