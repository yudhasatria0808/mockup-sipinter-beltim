# Project Steering

## Mode
Ini adalah **mockup / prototype** — tidak ada koneksi ke API backend.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7

## Struktur Utama

```
src/
├── pages/
│   ├── admin/          # Halaman-halaman utama aplikasi
│   │   ├── Dashboard.tsx
│   │   ├── roles/
│   │   ├── users/
│   │   └── audit-trail/
│   ├── AuthPages/      # SignIn, SignUp
│   └── OtherPage/      # 404, dll
├── layout/
│   ├── AppLayout.tsx   # Layout utama (sidebar + header + outlet)
│   ├── AppSidebar.tsx  # Sidebar statis dengan nav items
│   └── AppHeader.tsx   # Header dengan theme toggle & user dropdown
├── context/
│   ├── AuthContext.tsx  # Mock user statis, tidak ada API
│   ├── SidebarContext.tsx
│   └── ThemeContext.tsx
├── services/           # Stub kosong, tidak ada API call
├── types/admin/        # TypeScript types untuk admin
└── components/         # UI components reusable
```

## Routing
- `/signin` → halaman login (mockup, langsung redirect ke `/dashboard`)
- `/` → redirect ke `/dashboard`
- `/dashboard` → halaman utama dalam AppLayout
- `/roles`, `/users`, `/audit-trail` → halaman admin dalam AppLayout

## Aturan Pengembangan

### Tidak Ada API
Semua service di `src/services/` adalah stub kosong. Jangan tambahkan fetch/axios call.
Gunakan data statis atau mock data langsung di komponen/halaman.

### Tidak Ada Auth Guard
Tidak ada `ProtectedRoute` atau permission check. Semua halaman bisa diakses langsung.
`AuthContext` hanya menyediakan mock user statis.

### Menambah Halaman Baru
1. Buat file di `src/pages/`
2. Tambahkan route di `src/App.tsx` dalam `<Route element={<AppLayout />}>`
3. Tambahkan nav item di `src/layout/AppSidebar.tsx` dalam array `navGroups`

### Menambah Menu Sidebar
Edit `navGroups` di `src/layout/AppSidebar.tsx`:
```tsx
{ label: "Nama Menu", path: "/path-nya" }
```

### Mock User
Edit objek `mockUser` di `src/context/AuthContext.tsx` untuk mengubah nama/role yang tampil.
