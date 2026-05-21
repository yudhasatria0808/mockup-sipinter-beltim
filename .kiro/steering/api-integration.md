---
inclusion: auto
---

# API Integration Guide

Panduan untuk mengkonversi fitur dari mockup ke koneksi database via API.

## Axios Instance

File: `src/lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5100',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — tambah auth token jika ada
api.interceptors.request.use((config) => {
  const auth = sessionStorage.getItem('sipintar_auth');
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('sipintar_auth');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Service Migration Pattern

### Sebelum (Mock)
```typescript
export const aspekService = {
  async getPaginated(req) {
    const filtered = mockData.filter(...);
    return { data: filtered, currentPage: 1, ... };
  },
};
```

### Sesudah (Real API)
```typescript
import api from '../lib/api';

export const aspekService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }) {
    const { data } = await api.get('/api/aspek', {
      params: { search: req.generalSearch, page: req.pageNumber, pageSize: req.pageSize }
    });
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/api/aspek/${id}`);
    return data.data;
  },
  async create(payload: { nama: string; deskripsi?: string }) {
    const { data } = await api.post('/api/aspek', payload);
    return data.data;
  },
  async update(id: string, payload: { nama: string; deskripsi?: string }) {
    const { data } = await api.put(`/api/aspek/${id}`, payload);
    return data.data;
  },
  async delete(id: string) {
    await api.delete(`/api/aspek/${id}`);
  },
};
```

## Backend Entity Pattern

### Model
```csharp
namespace SipintarBeltim.Models;

public class Aspek
{
    public int Id { get; set; }
    public string Nama { get; set; } = string.Empty;
    public string? Deskripsi { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
```

### Endpoint Pattern (Minimal API)
```csharp
// GET paginated
app.MapGet("/api/aspek", async (AppDbContext db, string? search, int page = 1, int pageSize = 10) =>
{
    var query = db.Aspek.AsQueryable();
    if (!string.IsNullOrEmpty(search))
        query = query.Where(x => x.Nama.Contains(search));

    var totalCount = await query.CountAsync();
    var data = await query
        .OrderByDescending(x => x.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return Results.Ok(new {
        success = true,
        data,
        currentPage = page,
        pageSize,
        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        totalCount
    });
});

// GET by id
app.MapGet("/api/aspek/{id}", async (int id, AppDbContext db) =>
{
    var item = await db.Aspek.FindAsync(id);
    if (item is null) return Results.NotFound(new { success = false, message = "Not found" });
    return Results.Ok(new { success = true, data = item });
});

// POST
app.MapPost("/api/aspek", async (Aspek input, AppDbContext db) =>
{
    input.CreatedAt = DateTime.UtcNow;
    db.Aspek.Add(input);
    await db.SaveChangesAsync();
    return Results.Created($"/api/aspek/{input.Id}", new { success = true, data = input });
});

// PUT
app.MapPut("/api/aspek/{id}", async (int id, Aspek input, AppDbContext db) =>
{
    var item = await db.Aspek.FindAsync(id);
    if (item is null) return Results.NotFound(new { success = false, message = "Not found" });
    item.Nama = input.Nama;
    item.Deskripsi = input.Deskripsi;
    item.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, data = item });
});

// DELETE
app.MapDelete("/api/aspek/{id}", async (int id, AppDbContext db) =>
{
    var item = await db.Aspek.FindAsync(id);
    if (item is null) return Results.NotFound(new { success = false, message = "Not found" });
    db.Aspek.Remove(item);
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, message = "Deleted" });
});
```

## Approval Workflow Pattern

### Model dengan Approval
```csharp
public class KewaspadaanDini
{
    public int Id { get; set; }
    // ... field lainnya ...

    // Approval
    public string Status { get; set; } = "draft"; // draft, menunggu, disetujui, ditolak
    public string? CatatanApproval { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }

    // Meta
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### Approval Endpoint
```csharp
app.MapPatch("/api/kewaspadaan/{id}/approval", async (int id, ApprovalRequest input, AppDbContext db) =>
{
    var item = await db.KewaspadaanDini.FindAsync(id);
    if (item is null) return Results.NotFound(new { success = false, message = "Not found" });

    item.Status = input.Status; // "disetujui" atau "ditolak"
    item.CatatanApproval = input.Catatan;
    item.ApprovedBy = input.ApprovedBy;
    item.ApprovedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();

    return Results.Ok(new { success = true, data = item });
});

record ApprovalRequest(string Status, string? Catatan, string ApprovedBy);
```

## EWS (Early Warning System) Data Pattern

EWS endpoint mengembalikan data agregasi untuk dashboard:

```csharp
app.MapGet("/api/kewaspadaan/ews", async (AppDbContext db) =>
{
    var data = await db.KewaspadaanDini
        .Where(x => x.Status == "disetujui")
        .Select(x => new {
            x.Id, x.Periode, x.Aspek,
            x.Kabupaten, x.Kecamatan, x.Desa,
            x.TitikKoordinat, x.TingkatRisiko
        })
        .ToListAsync();

    return Results.Ok(new { success = true, data });
});
```

## Database Seeding

Gunakan mock data dari frontend sebagai referensi seed:
- Lihat `src/pages/*/mockData.ts` untuk contoh data
- Masukkan ke `OnModelCreating` di `AppDbContext` menggunakan `HasData()`

## Checklist Migrasi Per Modul

Untuk setiap modul yang dikonversi:

### Backend
- [ ] Buat Model di `api/Models/`
- [ ] Tambah DbSet di `AppDbContext`
- [ ] Buat migration (`dotnet ef migrations add ...`)
- [ ] Tambah endpoints (CRUD + custom)
- [ ] Seed data awal
- [ ] Test via Swagger

### Frontend
- [ ] Buat/update `src/lib/api.ts` (jika belum ada)
- [ ] Update service file di `src/services/` — ganti mock dengan axios
- [ ] Pastikan response match dengan types di `src/types/`
- [ ] Test dari UI — list, create, edit, delete
- [ ] Hapus mock data file yang tidak dipakai lagi
