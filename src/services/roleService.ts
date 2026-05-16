// Role Service - mockup mode, static data
import type { Role, RoleDetail, RolePermission, RoleMenuPermission } from '../types/role';
import type { PaginatedResponse } from '../types';

// Helper untuk membuat menu permission
function menu(
  menuId: string,
  menuName: string,
  menuDescription: string,
  idx: number,
  permissions: { view?: boolean; create?: boolean; update?: boolean; delete?: boolean } = {},
  child: RoleMenuPermission[] = []
): RoleMenuPermission {
  return {
    menuId,
    menuName,
    menuDescription,
    canView: permissions.view ?? false,
    canCreate: permissions.create ?? false,
    canUpdate: permissions.update ?? false,
    canDelete: permissions.delete ?? false,
    hasAccess: (permissions.view || permissions.create || permissions.update || permissions.delete) ?? false,
    idx,
    child,
  };
}

// Default permission structure — semua modul & menu yang ada di aplikasi
const defaultPermissions: RolePermission[] = [
  {
    modulId: 'mod-admin',
    modulName: 'Administrasi',
    modulDescription: 'Manajemen pengguna, role, dan audit trail',
    idx: 1,
    menus: [
      menu('menu-dashboard', 'Dashboard', 'Halaman utama dashboard', 1),
      menu('menu-roles', 'Role Management', 'Kelola role dan permission', 2),
      menu('menu-users', 'User Management', 'Kelola pengguna sistem', 3),
      menu('menu-audit', 'Audit Trail', 'Riwayat aktivitas sistem', 4),
    ],
  },
  {
    modulId: 'mod-master',
    modulName: 'Master Data',
    modulDescription: 'Data referensi utama aplikasi',
    idx: 2,
    menus: [
      menu('menu-aspek', 'Aspek', 'Data aspek konflik', 1),
      menu('menu-jenis-konflik', 'Jenis Konflik', 'Klasifikasi jenis konflik', 2),
      menu('menu-instansi', 'Instansi', 'Data instansi terkait', 3),
      menu('menu-wilayah', 'Wilayah', 'Data wilayah administratif', 4),
    ],
  },
  {
    modulId: 'mod-risiko',
    modulName: 'Matriks Risiko',
    modulDescription: 'Konfigurasi level dan matriks risiko',
    idx: 3,
    menus: [
      menu('menu-kemungkinan', 'Level Kemungkinan', 'Level kemungkinan risiko', 1),
      menu('menu-dampak', 'Level Dampak', 'Level dampak risiko', 2),
      menu('menu-level-risiko', 'Level Risiko', 'Definisi level risiko', 3),
      menu('menu-matriks', 'Matriks Risiko', 'Konfigurasi matriks risiko', 4),
    ],
  },
  {
    modulId: 'mod-kewaspadaan',
    modulName: 'Kewaspadaan Dini',
    modulDescription: 'Form dan monitoring kewaspadaan dini',
    idx: 4,
    menus: [
      menu('menu-kewaspadaan-form', 'Form Kewaspadaan Dini', 'Input data kewaspadaan dini', 1),
      menu('menu-ews-dashboard', 'EWS Dashboard', 'Dashboard early warning system', 2),
    ],
  },
  {
    modulId: 'mod-potensi',
    modulName: 'Potensi Konflik',
    modulDescription: 'Pencatatan dan monitoring potensi konflik',
    idx: 5,
    menus: [
      menu('menu-potensi-form', 'Form Potensi Konflik', 'Input data potensi konflik', 1),
      menu('menu-ews-potensi', 'EWS Potensi Konflik', 'Dashboard EWS potensi konflik', 2),
    ],
  },
  {
    modulId: 'mod-peristiwa',
    modulName: 'Peristiwa Konflik',
    modulDescription: 'Pencatatan dan monitoring peristiwa konflik',
    idx: 6,
    menus: [
      menu('menu-peristiwa-form', 'Form Peristiwa Konflik', 'Input data peristiwa konflik', 1),
      menu('menu-ews-peristiwa', 'EWS Peristiwa Konflik', 'Dashboard EWS peristiwa konflik', 2),
    ],
  },
  {
    modulId: 'mod-wna-tka',
    modulName: 'WNA & TKA',
    modulDescription: 'Monitoring warga negara asing dan tenaga kerja asing',
    idx: 7,
    menus: [
      menu('menu-wna', 'Warga Negara Asing', 'Data WNA', 1, {}, [
        menu('menu-wna-form', 'Form WNA', 'Input data WNA', 1),
        menu('menu-ews-wna', 'EWS WNA', 'Dashboard EWS WNA', 2),
      ]),
      menu('menu-tka', 'Tenaga Kerja Asing', 'Data TKA', 2, {}, [
        menu('menu-tka-form', 'Form TKA', 'Input data TKA', 1),
        menu('menu-ews-tka', 'EWS TKA', 'Dashboard EWS TKA', 2),
      ]),
    ],
  },
  {
    modulId: 'mod-tindak-lanjut',
    modulName: 'Tindak Lanjut',
    modulDescription: 'Tindak lanjut dan keputusan',
    idx: 8,
    menus: [
      menu('menu-tindak-lanjut', 'Tindak Lanjut & Keputusan', 'Kelola tindak lanjut', 1),
    ],
  },
  {
    modulId: 'mod-laporan',
    modulName: 'Laporan & Pengaturan',
    modulDescription: 'Laporan periodik dan pengaturan sistem',
    idx: 9,
    menus: [
      menu('menu-laporan', 'Laporan Periodik', 'Generate laporan periodik', 1),
      menu('menu-notifikasi', 'Notifikasi', 'Pengaturan notifikasi', 2),
      menu('menu-general-setting', 'General Setting', 'Pengaturan umum aplikasi', 3),
    ],
  },
];

// Buat deep copy permission dengan semua akses aktif (untuk Administrator)
function allPermissionsGranted(): RolePermission[] {
  return defaultPermissions.map(modul => ({
    ...modul,
    menus: modul.menus.map(m => ({
      ...m,
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      hasAccess: true,
      child: m.child.map(c => ({
        ...c,
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        hasAccess: true,
      })),
    })),
  }));
}

// Permission untuk Operator — akses terbatas
function operatorPermissions(): RolePermission[] {
  return defaultPermissions.map(modul => ({
    ...modul,
    menus: modul.menus.map(m => {
      const isOperatorMenu = [
        'menu-dashboard',
        'menu-kewaspadaan-form', 'menu-ews-dashboard',
        'menu-potensi-form', 'menu-ews-potensi',
        'menu-peristiwa-form', 'menu-ews-peristiwa',
        'menu-wna', 'menu-tka',
        'menu-tindak-lanjut',
      ].includes(m.menuId);
      return {
        ...m,
        canView: isOperatorMenu,
        canCreate: isOperatorMenu && !m.menuId.startsWith('menu-ews') && m.menuId !== 'menu-dashboard',
        canUpdate: isOperatorMenu && !m.menuId.startsWith('menu-ews') && m.menuId !== 'menu-dashboard',
        canDelete: false,
        hasAccess: isOperatorMenu,
        child: m.child.map(c => {
          const isChildAllowed = ['menu-wna-form', 'menu-tka-form', 'menu-ews-wna', 'menu-ews-tka'].includes(c.menuId);
          return {
            ...c,
            canView: isChildAllowed,
            canCreate: isChildAllowed && !c.menuId.startsWith('menu-ews'),
            canUpdate: isChildAllowed && !c.menuId.startsWith('menu-ews'),
            canDelete: false,
            hasAccess: isChildAllowed,
          };
        }),
      };
    }),
  }));
}

// Permission untuk Viewer — hanya view
function viewerPermissions(): RolePermission[] {
  return defaultPermissions.map(modul => ({
    ...modul,
    menus: modul.menus.map(m => {
      const isViewerMenu = [
        'menu-dashboard',
        'menu-ews-dashboard', 'menu-ews-potensi', 'menu-ews-peristiwa',
        'menu-tindak-lanjut', 'menu-laporan',
      ].includes(m.menuId);
      return {
        ...m,
        canView: isViewerMenu,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        hasAccess: isViewerMenu,
        child: m.child.map(c => {
          const isChildView = ['menu-ews-wna', 'menu-ews-tka'].includes(c.menuId);
          return {
            ...c,
            canView: isChildView,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
            hasAccess: isChildView,
          };
        }),
      };
    }),
  }));
}

const mockRoles: Role[] = [
  { id: '1', name: 'Administrator', description: 'Akses penuh ke seluruh modul dan fitur sistem', isProtected: true },
  { id: '2', name: 'Operator', description: 'Input data kewaspadaan, potensi konflik, peristiwa, WNA/TKA', isProtected: false },
  { id: '3', name: 'Viewer', description: 'Hanya dapat melihat dashboard dan laporan', isProtected: false },
];

const rolePermissionMap: Record<string, RolePermission[]> = {
  '1': allPermissionsGranted(),
  '2': operatorPermissions(),
  '3': viewerPermissions(),
};

export const roleService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }): Promise<PaginatedResponse<Role>> {
    const filtered = mockRoles.filter(r =>
      !req.generalSearch || r.name.toLowerCase().includes(req.generalSearch.toLowerCase())
    );
    return { data: filtered, currentPage: req.pageNumber, pageSize: req.pageSize, totalPages: 1, totalCount: filtered.length };
  },
  async getAll(): Promise<Role[]> { return mockRoles; },
  async getById(id: string): Promise<RoleDetail> {
    const role = mockRoles.find(r => r.id === id) ?? mockRoles[0];
    return { ...role, rolePermission: rolePermissionMap[role.id] ?? allPermissionsGranted() };
  },
  async getDefaultPermissions(): Promise<RolePermission[]> {
    // Return semua permission dalam keadaan unchecked (untuk form create role baru)
    return defaultPermissions.map(modul => ({
      ...modul,
      menus: modul.menus.map(m => ({
        ...m,
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        hasAccess: false,
        child: m.child.map(c => ({
          ...c,
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          hasAccess: false,
        })),
      })),
    }));
  },
  async create(_data: unknown): Promise<RoleDetail> { return { ...mockRoles[0], rolePermission: allPermissionsGranted() }; },
  async update(_id: string, _data: unknown): Promise<RoleDetail> { return { ...mockRoles[0], rolePermission: allPermissionsGranted() }; },
  async delete(_id: string): Promise<void> {},
};

export default roleService;
