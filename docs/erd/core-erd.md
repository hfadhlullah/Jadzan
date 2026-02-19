# Core ERD (Jadzan)

| Metadata      | Details |
| :---          | :--- |
| **System**    | Jadzan Database Schema |
| **Version**   | 1.0.0 (Global ERD) |
| **Status**    | Approved |

---

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ mosques : "administers"
    mosques ||--|{ screens : "contains"
    mosques ||--o{ media_content : "owns"
    screens ||--o{ targeted_media : "displays"
    mosques ||--o{ announcements : "owns"

    users {
        uuid id PK
        string email
        string full_name
        timestamp created_at
    }

    mosques {
        uuid id PK
        string name
        float latitude
        float longitude
        string timezone
        string calculation_method
        json iqomah_delays
        timestamp updated_at
    }

    screens {
        uuid id PK
        uuid mosque_id FK
        string name "e.g. Main Hall"
        string pairing_code
        string status "ACTIVE/OFFLINE"
        string orientation "LANDSCAPE"
        timestamp last_seen
        timestamp created_at
    }

    media_content {
        uuid id PK
        uuid mosque_id FK
        string type "IMAGE/VIDEO"
        string url
        string label
        int duration "seconds, default 10"
        boolean is_active
        timestamp created_at
    }

    targeted_media {
        uuid media_id FK
        uuid screen_id FK
    }

    announcements {
        uuid id PK
        uuid mosque_id FK
        string text
        boolean is_active
        timestamp created_at
    }
```

## Relationships

*   **1 User -> Many Mosques**: Allows a Super Admin or Mosque Manager to oversee multiple locations (e.g., Main Branch + Satellite).
*   **1 Mosque -> Many Screens**: A large mosque might have a Men's Hall, Women's Hall, and Lobby screen.
*   **1 Mosque -> Many Media**: Content is uploaded *to the Mosque's library*, then assigned to screens.
*   **Media <-> Screens**: A Many-to-Many relationship (via `targeted_media` junction table if needed, or array in `media_content` for simplicity). The diagram shows `targeted_media` for normalized flexibility.
