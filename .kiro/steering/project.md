# Project Steering

## Mode
Ini adalah **prototype fungsional** — frontend terkoneksi ke API backend (.NET 8 + SQLite).

## Stack

### Frontend (web/)
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7
- Axios untuk HTTP client

### Backend (api/)
- .NET 8 Minimal API
- Entity Framework Core + SQLite
- Swagger/OpenAPI (development)
- Port: `http://localhost:5100`

## Arsitektur

```
┌─────────────────┐         ┌─────────────────────────┐
│   Frontend      │  HTTP   │   Backend (.NET 8)      │
│   React + Vite  │ ──────► │   Minimal API           │
│   :5173         │         │   :5100                 │
└─────────────────┘         │                         │
                            │   EF Core + SQLite      │
                            │   sipintar_beltim.db    │
                            └─────────────────────────┘
```

## Struktur Frontend

```
src/
├── pages/              # Halaman per modul
├── layout/             # AppLayout, Sidebar, Header
├── context/            # Auth, Sidebar, Theme
├── services/           # API client per modul (axios)
├── types/              # TypeScript interfaces
├── components/         # UI components reusable
├── data/               # Static reference data (jika ada)
└── lib/
    └── api.ts          # Axios instance + interceptor
```

## Struktur Backend

```
api/
├── Models/             # Entity classes
├── Data/               # AppDbContext
├── Migrations/         # EF Core migrations
├── Endpoints/          # Endpoint groups (opsional, bisa di Program.cs)
├── Properties/         # launchSettings.json
├── appsettings.json    # Connection string
└── Program.cs          # Entry point + endpoint registration
```

## Konvensi API

### Base URL
Frontend menggunakan env variable:
- Development: `VITE_API_URL=http://localhost:5100`

### Response Format
Semua endpoint mengembalikan format konsisten:
```json
{
  "success": true,
  "data": { ... },
  "message": "optional message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalCount": 48
}
```

### Endpoint Naming Convention
- `GET    /api/{resource}`          → List (paginated, query params: search, page, pageSize)
- `GET    /api/{resource}/{id}`     → Get by ID
- `POST   /api/{resource}`          → Create
- `PUT    /api/{resource}/{id}`     → Update
- `DELETE /api/{resource}/{id}`     → Delete

### Query Parameters untuk List
```
?search=keyword&page=1&pageSize=10&sortBy=createdAt&sortDir=desc
```

## Modul & Endpoint Mapping

### 1. Auth
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| Login | `/api/auth/login` | POST |
| Logout | `/api/auth/logout` | POST |
| Profile | `/api/auth/me` | GET |

### 2. Users
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/users` | GET |
| Detail | `/api/users/{id}` | GET |
| Create | `/api/users` | POST |
| Update | `/api/users/{id}` | PUT |
| Delete | `/api/users/{id}` | DELETE |
| Toggle Status | `/api/users/{id}/toggle-status` | PATCH |
| Reset Password | `/api/users/{id}/reset-password` | POST |

### 3. Roles
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/roles` | GET |
| Detail (+ permissions) | `/api/roles/{id}` | GET |
| Create | `/api/roles` | POST |
| Update | `/api/roles/{id}` | PUT |
| Delete | `/api/roles/{id}` | DELETE |
| Default Permissions | `/api/roles/default-permissions` | GET |

### 4. Audit Trail
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/audit-trail` | GET |
| Table Names | `/api/audit-trail/tables` | GET |

### 5. Master Data — Aspek
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| CRUD | `/api/aspek` | GET, POST |
| By ID | `/api/aspek/{id}` | GET, PUT, DELETE |

### 6. Master Data — Jenis Konflik
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| CRUD | `/api/jenis-konflik` | GET, POST |
| By ID | `/api/jenis-konflik/{id}` | GET, PUT, DELETE |

### 7. Master Data — Instansi
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| CRUD | `/api/instansi` | GET, POST |
| By ID | `/api/instansi/{id}` | GET, PUT, DELETE |

### 8. Master Data — Wilayah
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List (hierarchical) | `/api/wilayah` | GET |
| By ID | `/api/wilayah/{id}` | GET, PUT, DELETE |
| Create | `/api/wilayah` | POST |
| By Parent | `/api/wilayah/by-parent/{parentId}` | GET |

### 9. Matriks Risiko
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| Level Kemungkinan CRUD | `/api/risiko/kemungkinan` | GET, POST |
| Level Kemungkinan By ID | `/api/risiko/kemungkinan/{id}` | GET, PUT, DELETE |
| Level Dampak CRUD | `/api/risiko/dampak` | GET, POST |
| Level Dampak By ID | `/api/risiko/dampak/{id}` | GET, PUT, DELETE |
| Level Risiko CRUD | `/api/risiko/level` | GET, POST |
| Level Risiko By ID | `/api/risiko/level/{id}` | GET, PUT, DELETE |
| Matriks (computed) | `/api/risiko/matriks` | GET |

### 10. Kewaspadaan Dini
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/kewaspadaan` | GET |
| Detail | `/api/kewaspadaan/{id}` | GET |
| Create | `/api/kewaspadaan` | POST |
| Update | `/api/kewaspadaan/{id}` | PUT |
| Delete | `/api/kewaspadaan/{id}` | DELETE |
| Approve/Reject | `/api/kewaspadaan/{id}/approval` | PATCH |
| EWS Data | `/api/kewaspadaan/ews` | GET |

### 11. Potensi Konflik
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/potensi-konflik` | GET |
| Detail | `/api/potensi-konflik/{id}` | GET |
| Create | `/api/potensi-konflik` | POST |
| Update | `/api/potensi-konflik/{id}` | PUT |
| Delete | `/api/potensi-konflik/{id}` | DELETE |
| Approve/Reject | `/api/potensi-konflik/{id}/approval` | PATCH |
| EWS Data | `/api/potensi-konflik/ews` | GET |

### 12. Peristiwa Konflik
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/peristiwa-konflik` | GET |
| Detail | `/api/peristiwa-konflik/{id}` | GET |
| Create | `/api/peristiwa-konflik` | POST |
| Update | `/api/peristiwa-konflik/{id}` | PUT |
| Delete | `/api/peristiwa-konflik/{id}` | DELETE |
| Approve/Reject | `/api/peristiwa-konflik/{id}/approval` | PATCH |
| EWS Data | `/api/peristiwa-konflik/ews` | GET |

### 13. WNA (Warga Negara Asing)
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/wna` | GET |
| Detail | `/api/wna/{id}` | GET |
| Create | `/api/wna` | POST |
| Update | `/api/wna/{id}` | PUT |
| Delete | `/api/wna/{id}` | DELETE |
| Approve/Reject | `/api/wna/{id}/approval` | PATCH |
| EWS Data | `/api/wna/ews` | GET |

### 14. TKA (Tenaga Kerja Asing)
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/tka` | GET |
| Detail | `/api/tka/{id}` | GET |
| Create | `/api/tka` | POST |
| Update | `/api/tka/{id}` | PUT |
| Delete | `/api/tka/{id}` | DELETE |
| Approve/Reject | `/api/tka/{id}/approval` | PATCH |
| EWS Data | `/api/tka/ews` | GET |

### 15. Tindak Lanjut
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/tindak-lanjut` | GET |
| Create | `/api/tindak-lanjut` | POST |
| Update Status | `/api/tindak-lanjut/{id}/status` | PATCH |

### 16. Notifikasi
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/notifikasi` | GET |
| Mark Read | `/api/notifikasi/{id}/read` | PATCH |
| Count Unread | `/api/notifikasi/unread-count` | GET |

### 17. General Setting
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| List | `/api/settings` | GET |
| Update | `/api/settings/{id}` | PUT |

### 18. Dashboard
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| Summary Stats | `/api/dashboard/summary` | GET |
| Recent Activity | `/api/dashboard/recent` | GET |

### 19. Laporan Periodik
| Frontend | API Endpoint | Method |
|----------|-------------|--------|
| Generate | `/api/laporan/generate` | POST |
| Download | `/api/laporan/download/{id}` | GET |

## Aturan Pengembangan

### Frontend → API Migration Pattern

Saat mengkonversi halaman dari mockup ke API:

1. **Buat/update service file** di `src/services/` — ganti mock data dengan axios call
2. **Buat axios instance** di `src/lib/api.ts` dengan baseURL dari env
3. **Jangan ubah UI/komponen** — hanya ganti sumber data dari mock ke API
4. **Pertahankan type yang sama** — API response harus match dengan TypeScript types yang sudah ada
5. **Handle loading & error state** — sudah ada pattern di halaman existing

### Contoh Service Pattern (setelah migrasi)
```typescript
import api from '../lib/api';
import type { User, UserDetail } from '../types/user';
import type { PaginatedResponse } from '../types';

export const userService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }): Promise<PaginatedResponse<User>> {
    const { data } = await api.get('/api/users', { params: req });
    return data;
  },
  async getById(id: string): Promise<UserDetail> {
    const { data } = await api.get(`/api/users/${id}`);
    return data.data;
  },
  async create(payload: unknown): Promise<UserDetail> {
    const { data } = await api.post('/api/users', payload);
    return data.data;
  },
  // ...
};
```

### Backend — Menambah Entity Baru

1. Buat model di `api/Models/`
2. Tambahkan `DbSet<T>` di `AppDbContext`
3. Buat migration: `dotnet ef migrations add NamaFitur`
4. Tambahkan endpoints di `Program.cs` (atau file terpisah di `Endpoints/`)
5. Seed data jika perlu di `OnModelCreating`

### Auth (Prototype Sederhana)
Untuk prototype, auth cukup sederhana:
- Login: validasi username/password dari tabel Users, return user info + role
- Tidak perlu JWT token — cukup session-based atau simple token di header
- Frontend simpan auth state di sessionStorage (sudah ada pattern-nya)

### Approval Workflow
Modul yang punya approval (Kewaspadaan, Potensi, Peristiwa, WNA, TKA):
- Status: `draft` → `menunggu` → `disetujui` / `ditolak`
- Operator submit → status jadi `menunggu`
- Admin approve/reject via PATCH endpoint
- Simpan `approvedBy`, `approvedAt`, `catatanApproval`

### Prioritas Implementasi
Karena ini prototype, urutan implementasi yang disarankan:

1. **Auth** — login/logout supaya bisa akses
2. **Master Data** — Aspek, Jenis Konflik, Instansi, Wilayah (simple CRUD)
3. **Matriks Risiko** — Level Kemungkinan, Dampak, Risiko
4. **Users & Roles** — user management
5. **Kewaspadaan Dini** — form + approval + EWS
6. **Potensi Konflik** — form + approval + EWS
7. **Peristiwa Konflik** — form + approval + EWS
8. **WNA & TKA** — form + approval + EWS
9. **Tindak Lanjut** — keputusan pimpinan
10. **Dashboard, Notifikasi, Laporan** — aggregation

## Menjalankan Aplikasi

### Backend
```bash
cd api
dotnet run
# → http://localhost:5100
# → Swagger: http://localhost:5100/swagger
```

### Frontend
```bash
cd web
npm run dev
# → http://localhost:5173
```

## File Referensi Penting
- Types frontend: `src/types/` — semua interface yang harus di-match oleh API
- Mock data: `src/pages/*/mockData.ts` — contoh data untuk seed database
- Services: `src/services/` — yang perlu diubah dari mock ke real API call
- Auth context: `src/context/AuthContext.tsx` — perlu diubah ke real auth
