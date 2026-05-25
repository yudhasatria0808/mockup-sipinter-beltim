import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";
import { CheckIcon as SaveIcon, CloseIcon, ChevronDownIcon } from "../../components/icons";
import roleService from "../../services/roleService";
import type {
  RolePermission,
  RoleMenuPermission,
  RoleCreateRequest,
  RoleMenuPermissionRequest,
} from "../../types/role";

export default function RoleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (isEdit && id) {
          const role = await roleService.getById(id);
          setName(role.name);
          setDescription(role.description || "");
          setPermissions(role.rolePermission);
          // Expand all modules by default when editing
          setExpandedModules(new Set(role.rolePermission.map((p) => p.modulId)));
        } else {
          const defaultPerms = await roleService.getDefaultPermissions();
          setPermissions(defaultPerms);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        alert("Gagal memuat data");
        navigate("/roles");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit, navigate]);

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

  const updateMenuPermission = (
    modulId: string,
    menuId: string,
    field: keyof RoleMenuPermission,
    value: boolean,
    isChild: boolean = false,
    parentMenuId?: string
  ) => {
    setPermissions((prev) =>
      prev.map((modul) => {
        if (modul.modulId !== modulId) return modul;
        return {
          ...modul,
          menus: modul.menus.map((menu) => {
            if (isChild && parentMenuId) {
              if (menu.menuId !== parentMenuId) return menu;
              return {
                ...menu,
                child: menu.child.map((child) => {
                  if (child.menuId !== menuId) return child;
                  return { ...child, [field]: value };
                }),
              };
            }
            if (menu.menuId !== menuId) return menu;
            return { ...menu, [field]: value };
          }),
        };
      })
    );
  };

  const toggleAllPermissions = (
    modulId: string,
    menuId: string,
    checked: boolean,
    isChild: boolean = false,
    parentMenuId?: string
  ) => {
    setPermissions((prev) =>
      prev.map((modul) => {
        if (modul.modulId !== modulId) return modul;
        return {
          ...modul,
          menus: modul.menus.map((menu) => {
            if (isChild && parentMenuId) {
              if (menu.menuId !== parentMenuId) return menu;
              return {
                ...menu,
                child: menu.child.map((child) => {
                  if (child.menuId !== menuId) return child;
                  return {
                    ...child,
                    canView: checked,
                    canCreate: checked,
                    canUpdate: checked,
                    canDelete: checked,
                    canApprove: checked,
                  };
                }),
              };
            }
            if (menu.menuId !== menuId) return menu;
            return {
              ...menu,
              canView: checked,
              canCreate: checked,
              canUpdate: checked,
              canDelete: checked,
              canApprove: checked,
            };
          }),
        };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama role harus diisi");
      return;
    }

    setSaving(true);
    try {
      const menuPermissions: RoleMenuPermissionRequest[] = [];
      permissions.forEach((modul) => {
        modul.menus.forEach((menu) => {
          if (menu.canView || menu.canCreate || menu.canUpdate || menu.canDelete || menu.canApprove) {
            menuPermissions.push({
              menuId: menu.menuId,
              canView: menu.canView,
              canCreate: menu.canCreate,
              canUpdate: menu.canUpdate,
              canDelete: menu.canDelete,
              canApprove: menu.canApprove,
            });
          }
          menu.child.forEach((child) => {
            if (child.canView || child.canCreate || child.canUpdate || child.canDelete || child.canApprove) {
              menuPermissions.push({
                menuId: child.menuId,
                canView: child.canView,
                canCreate: child.canCreate,
                canUpdate: child.canUpdate,
                canDelete: child.canDelete,
                canApprove: child.canApprove,
              });
            }
          });
        });
      });

      const payload: RoleCreateRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        rolePermission: permissions.map((modul) => ({
          modulId: modul.modulId,
          menus: [
            ...modul.menus
              .filter((m) => m.canView || m.canCreate || m.canUpdate || m.canDelete || m.canApprove)
              .map((m) => ({
                menuId: m.menuId,
                canView: m.canView,
                canCreate: m.canCreate,
                canUpdate: m.canUpdate,
                canDelete: m.canDelete,
                canApprove: m.canApprove,
              })),
            ...modul.menus.flatMap((m) =>
              m.child
                .filter((c) => c.canView || c.canCreate || c.canUpdate || c.canDelete || c.canApprove)
                .map((c) => ({
                  menuId: c.menuId,
                  canView: c.canView,
                  canCreate: c.canCreate,
                  canUpdate: c.canUpdate,
                  canDelete: c.canDelete,
                  canApprove: c.canApprove,
                }))
            ),
          ],
        })),
      };

      if (isEdit && id) {
        await roleService.update(id, payload);
      } else {
        await roleService.create(payload);
      }
      navigate("/roles");
    } catch (error) {
      console.error("Failed to save role:", error);
      alert(error instanceof Error ? error.message : "Gagal menyimpan role");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Admin | ${isEdit ? "Edit" : "Tambah"} Role`}
        description={isEdit ? "Edit Role" : "Tambah Role Baru"}
      />
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {isEdit ? "Edit Role" : "Tambah Role"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEdit ? "Ubah data role dan permission" : "Buat role baru dengan permission"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate("/roles")} className="gap-1.5">
                <CloseIcon /> Batal
              </Button>
              <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                <SaveIcon /> {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>

          {/* Basic Info - Compact */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
              Informasi Role
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-xs">Nama Role *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama role"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-xs">Deskripsi</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Masukkan deskripsi (opsional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Permissions - Compact */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Permission
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Atur akses menu untuk role ini
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {permissions.map((modul) => (
                <div key={modul.modulId}>
                  {/* Module Header - Compact */}
                  <button
                    type="button"
                    onClick={() => toggleModule(modul.modulId)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {modul.modulName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {modul.modulDescription}
                      </p>
                    </div>
                    <span className={`transition-transform ${expandedModules.has(modul.modulId) ? "rotate-180" : ""}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>

                  {/* Module Content - Compact */}
                  {expandedModules.has(modul.modulId) && (
                    <div className="bg-gray-50/50 px-4 pb-3 dark:bg-white/[0.01]">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500 dark:text-gray-400">
                            <th className="py-2 text-left font-medium">Menu</th>
                            <th className="w-12 py-2 text-center font-medium">All</th>
                            <th className="w-12 py-2 text-center font-medium">View</th>
                            <th className="w-12 py-2 text-center font-medium">Add</th>
                            <th className="w-12 py-2 text-center font-medium">Edit</th>
                            <th className="w-12 py-2 text-center font-medium">Del</th>
                            <th className="w-12 py-2 text-center font-medium">Appr</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {modul.menus.map((menu) => (
                            <>
                              <PermissionRow
                                key={menu.menuId}
                                menu={menu}
                                modulId={modul.modulId}
                                onUpdate={updateMenuPermission}
                                onToggleAll={toggleAllPermissions}
                              />
                              {menu.child.map((child) => (
                                <PermissionRow
                                  key={child.menuId}
                                  menu={child}
                                  modulId={modul.modulId}
                                  isChild
                                  parentMenuId={menu.menuId}
                                  onUpdate={updateMenuPermission}
                                  onToggleAll={toggleAllPermissions}
                                />
                              ))}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

interface PermissionRowProps {
  menu: RoleMenuPermission;
  modulId: string;
  isChild?: boolean;
  parentMenuId?: string;
  onUpdate: (
    modulId: string,
    menuId: string,
    field: keyof RoleMenuPermission,
    value: boolean,
    isChild?: boolean,
    parentMenuId?: string
  ) => void;
  onToggleAll: (
    modulId: string,
    menuId: string,
    checked: boolean,
    isChild?: boolean,
    parentMenuId?: string
  ) => void;
}

function PermissionRow({
  menu,
  modulId,
  isChild = false,
  parentMenuId,
  onUpdate,
  onToggleAll,
}: PermissionRowProps) {
  const allChecked = menu.canView && menu.canCreate && menu.canUpdate && menu.canDelete && menu.canApprove;

  return (
    <tr>
      <td className={`py-1.5 text-xs text-gray-700 dark:text-gray-300 ${isChild ? "pl-4" : ""}`}>
        {isChild && <span className="mr-1.5 text-gray-400">└</span>}
        {menu.menuName}
      </td>
      <td className="py-1.5 text-center">
        <Checkbox
          checked={allChecked}
          onChange={(checked) => onToggleAll(modulId, menu.menuId, checked, isChild, parentMenuId)}
        />
      </td>
      <td className="py-1.5 text-center">
        <Checkbox
          checked={menu.canView}
          onChange={(checked) => onUpdate(modulId, menu.menuId, "canView", checked, isChild, parentMenuId)}
        />
      </td>
      <td className="py-1.5 text-center">
        <Checkbox
          checked={menu.canCreate}
          onChange={(checked) => onUpdate(modulId, menu.menuId, "canCreate", checked, isChild, parentMenuId)}
        />
      </td>
      <td className="py-1.5 text-center">
        <Checkbox
          checked={menu.canUpdate}
          onChange={(checked) => onUpdate(modulId, menu.menuId, "canUpdate", checked, isChild, parentMenuId)}
        />
      </td>
      <td className="py-1.5 text-center">
        <Checkbox
          checked={menu.canDelete}
          onChange={(checked) => onUpdate(modulId, menu.menuId, "canDelete", checked, isChild, parentMenuId)}
        />
      </td>
      <td className="py-1.5 text-center">
        <Checkbox
          checked={menu.canApprove}
          onChange={(checked) => onUpdate(modulId, menu.menuId, "canApprove", checked, isChild, parentMenuId)}
        />
      </td>
    </tr>
  );
}
