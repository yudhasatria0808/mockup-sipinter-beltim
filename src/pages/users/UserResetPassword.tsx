import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import userService from "../../services/userService";
import type { UserDetail } from "../../types/user";

export default function UserResetPassword() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        navigate("/users");
        return;
      }

      setLoading(true);
      try {
        const userData = await userService.getById(id);
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
        alert("Gagal memuat data user");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      alert("Password baru minimal 8 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    if (!id) return;

    setSaving(true);
    try {
      await userService.resetPassword(id, { newPassword });
      alert("Password berhasil direset");
      navigate("/users");
    } catch (error) {
      console.error("Failed to reset password:", error);
      alert(error instanceof Error ? error.message : "Gagal mereset password");
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

  if (!user) {
    return null;
  }

  return (
    <>
      <PageMeta
        title="Admin | Reset Password"
        description="Reset Password User"
      />
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Reset Password
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                User: {user.fullName} ({user.username})
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate("/users")} className="gap-1.5">
                <CloseIcon /> Batal
              </Button>
              <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                <SaveIcon /> {saving ? "Menyimpan..." : "Reset"}
              </Button>
            </div>
          </div>

          {/* Form - Compact */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
              Password Baru
            </h3>
            <div className="grid gap-3 max-w-md">
              <div>
                <Label htmlFor="newPassword" className="text-xs">Password Baru *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-xs">Konfirmasi Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
