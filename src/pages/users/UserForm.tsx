import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import userService from "../../services/userService";
import roleService from "../../services/roleService";
import type { Role } from "../../types/role";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load roles
        const rolesData = await roleService.getAll();
        setRoles(rolesData);

        // Load user data if editing
        if (isEdit && id) {
          const user = await userService.getById(id);
          setUsername(user.username);
          setFullName(user.fullName);
          setEmail(user.email);
          setRoleId(user.roleId);
          setIsActive(user.isActive);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        alert("Gagal memuat data");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      alert("Nama lengkap harus diisi");
      return;
    }
    if (!email.trim()) {
      alert("Email harus diisi");
      return;
    }
    if (!roleId) {
      alert("Role harus dipilih");
      return;
    }
    if (!isEdit) {
      if (!username.trim()) {
        alert("Username harus diisi");
        return;
      }
      if (!password || password.length < 8) {
        alert("Password minimal 8 karakter");
        return;
      }
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await userService.update(id, {
          fullName: fullName.trim(),
          email: email.trim(),
          roleId,
          isActive,
        });
      } else {
        await userService.create({
          username: username.trim(),
          password,
          fullName: fullName.trim(),
          email: email.trim(),
          roleId,
          isActive,
        });
      }
      navigate("/users");
    } catch (error) {
      console.error("Failed to save user:", error);
      alert(error instanceof Error ? error.message : "Gagal menyimpan user");
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

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <>
      <PageMeta
        title={`Admin | ${isEdit ? "Edit" : "Tambah"} User`}
        description={isEdit ? "Edit User" : "Tambah User Baru"}
      />
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {isEdit ? "Edit User" : "Tambah User"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEdit ? "Ubah data user" : "Buat user baru"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate("/users")} className="gap-1.5">
                <CloseIcon /> Batal
              </Button>
              <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                <SaveIcon /> {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>

          {/* Form - Compact */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
              Informasi User
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Username - only for create */}
              {!isEdit && (
                <div>
                  <Label htmlFor="username" className="text-xs">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              {/* Password - only for create */}
              {!isEdit && (
                <div>
                  <Label htmlFor="password" className="text-xs">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-xs">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="roleId" className="text-xs">Role *</Label>
                <select
                  id="roleId"
                  className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="" disabled>Pilih role</option>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <Label className="text-xs">Status</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-brand-500 peer-checked:after:translate-x-4 dark:bg-gray-700"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
