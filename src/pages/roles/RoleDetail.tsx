import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { CloseIcon, EditIcon, ChevronDownIcon } from "../../components/icons";
import roleService from "../../services/roleService";
import type { RoleDetail as RoleDetailType, RolePermission, RoleMenuPermission } from "../../types/role";

export default function RoleDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RoleDetailType | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await roleService.getById(id);
        setRole(data);
        // Expand all modules by default
        setExpandedModules(new Set(data.rolePermission.map((p) => p.modulId)));
      } catch (error) {
        console.error("Failed to load role:", error);
        alert("Gagal memuat data role");
        navigate("/roles");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const toggleModule = (modulId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(Array.from(prev));
      if (next.has(modulId)) {
        next.delete(modulId);
      } else {
        next.add(modulId);
      }
      return next;
    });
  };

  // Hitung jumlah permission aktif per modul
  const countActivePermissions = (modul: RolePermission): number => {
    let count = 0;
    modul.menus.forEach((menu) => {
      if (menu.canView) count++;
      if (menu.canCreate) count++;
      if (menu.canUpdate) count++;
      if (menu.canDelete) count++;
      menu.child.forEach((child) => {
        if (child.canView) count++;
        if (child.canCreate) count++;
        if (child.canUpdate) count++;
        if (child.canDelete) count++;
      });
    });
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (!role) return null;

  return (
    <>
      <PageMeta title={`Admin | Detail Role - ${role.name}`} description="Detail Role" />
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Detail Role
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Lihat informasi dan permission role
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/roles")} className="gap-1.5">
              <CloseIcon /> Kembali
            </Button>
            {!role.isProtected && (
              <Button size="sm" onClick={() => navigate(`/roles/edit/${id}`)} className="gap-1.5">
                <EditIcon /> Edit
              </Button>
            )}
          </div>
        </div>

        {/* Role Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Nama Role</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800 dark:text-white/90">{role.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deskripsi</p>
              <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{role.description || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <div className="mt-0.5">
                {role.isProtected ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
                    Protected
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                    Normal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
              Permission Matrix
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daftar akses yang dimiliki role ini
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {role.rolePermission.map((modul) => {
              const activeCount = countActivePermissions(modul);
              return (
                <div key={modul.modulId}>
                  {/* Module Header */}
                  <button
                    type="button"
                    onClick={() => toggleModule(modul.modulId)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {modul.modulName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {modul.modulDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeCount > 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                          {activeCount} aktif
                        </span>
                      )}
                      <span className={`transition-transform ${expandedModules.has(modul.modulId) ? "rotate-180" : ""}`}>
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </button>

                  {/* Module Content */}
                  {expandedModules.has(modul.modulId) && (
                    <div className="bg-gray-50/50 px-4 pb-3 dark:bg-white/[0.01]">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500 dark:text-gray-400">
                            <th className="py-2 text-left font-medium">Menu</th>
                            <th className="w-14 py-2 text-center font-medium">View</th>
                            <th className="w-14 py-2 text-center font-medium">Create</th>
                            <th className="w-14 py-2 text-center font-medium">Update</th>
                            <th className="w-14 py-2 text-center font-medium">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {modul.menus.map((menu) => (
                            <>
                              <PermissionViewRow key={menu.menuId} menu={menu} />
                              {menu.child.map((child) => (
                                <PermissionViewRow key={child.menuId} menu={child} isChild />
                              ))}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function PermissionViewRow({ menu, isChild = false }: { menu: RoleMenuPermission; isChild?: boolean }) {
  return (
    <tr>
      <td className={`py-1.5 text-xs text-gray-700 dark:text-gray-300 ${isChild ? "pl-4" : ""}`}>
        {isChild && <span className="mr-1.5 text-gray-400">└</span>}
        {menu.menuName}
      </td>
      <td className="py-1.5 text-center">
        <PermissionBadge active={menu.canView} />
      </td>
      <td className="py-1.5 text-center">
        <PermissionBadge active={menu.canCreate} />
      </td>
      <td className="py-1.5 text-center">
        <PermissionBadge active={menu.canUpdate} />
      </td>
      <td className="py-1.5 text-center">
        <PermissionBadge active={menu.canDelete} />
      </td>
    </tr>
  );
}

function PermissionBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
        <svg className="h-3 w-3 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
      <svg className="h-3 w-3 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}
