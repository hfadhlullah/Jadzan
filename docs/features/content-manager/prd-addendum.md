# PRD Addendum — Content Manager

| Metadata | Details |
| :--- | :--- |
| **Feature** | Content Manager |
| **Parent Epic** | CORE |
| **Status** | Ready for Development |
| **Stories** | JADZ-020, JADZ-021, JADZ-022, JADZ-023, JADZ-024, JADZ-025, JADZ-026 |

---

## 1. Feature Overview

The Content Manager enables Mosque Admins to populate the TV display with rich content: uploaded media (images/videos) that rotate in the main stage, and text announcements that scroll along the bottom ticker. The TV App syncs and caches this content locally, ensuring it remains visible even during network outages.

---

## 2. User Stories

| ID | Story | Acceptance Criteria (Given-When-Then) |
| :--- | :--- | :--- |
| US-01 | As a Mosque Admin, I can upload images or videos to my Mosque's media library so they appear on the TV display. | **Given** I am on the Media page, **When** I upload a JPG file, **Then** it is stored in Supabase Storage and a `media_content` row is created. |
| US-02 | As a Mosque Admin, I can assign media to specific screens (or all screens) so I can target content per area. | **Given** I have uploaded media, **When** I assign it to "Women's Hall" only, **Then** only that screen shows the media. |
| US-03 | As a Mosque Admin, I can add/activate/deactivate ticker announcements so the text at the bottom stays relevant. | **Given** I am on the Announcements page, **When** I add "Pengajian malam Jumat jam 20:00" and activate it, **Then** it appears in the TV ticker. |
| US-04 | As a worshipper, I see a smooth rotating media carousel in the main area between prayer states. | **Given** the display is in IDLE state, **When** media carousel runs, **Then** images/videos rotate with smooth fade transitions per their configured duration. |
| US-05 | As a worshipper, I see a continuous scrolling news ticker at the bottom of the screen. | **Given** there are active announcements, **When** the TV is in IDLE state, **Then** all active ticker texts scroll continuously from right to left. |

---

## 3. ERD Delta

None. Uses existing tables from `JADZ-001`:
- `media_content` — stores media metadata + Supabase Storage URL.
- `targeted_media` — junction table linking media to specific screens.
- `announcements` — stores ticker text entries.

---

## 4. Content Flow

```
[Admin uploads image]
       │
       ├─ Upload file → Supabase Storage bucket: `media_uploads/{mosque_id}/{filename}`
       ├─ Get public URL
       └─ INSERT media_content { url, type, label, duration, is_active }
              │
              └─ (Optional) INSERT targeted_media { media_id, screen_id } per selected screens

[TV syncs content]
       │
       ├─ Fetch: SELECT * FROM media_content WHERE mosque_id = ? AND is_active = true
       ├─ For each media: download file to FileSystem cache if not already cached
       └─ Load carousel from local cache (not from URL directly)
```

---

## 5. Integration Notes

- **Storage Bucket**: `media_uploads` — public read, admin write (RLS enforced).
- **File Size Limit**: 50MB per file (MVP) [ASSUMPTION].
- **Supported Formats**: Images: JPG, PNG, WebP. Videos: MP4.
- **Cache Invalidation**: TV checks file URL hash; re-downloads only if URL changes.
- **Ticker**: No caching needed — text is lightweight, fetched fresh from DB.
- **IDLE-only**: Media Carousel and Ticker are hidden during PRE_ADZAN, ADZAN, IQOMAH, PRAYER_ACTIVE states.
