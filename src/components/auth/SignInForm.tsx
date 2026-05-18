import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth, mockCredentials } from "../../context/AuthContext";

export default function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi");
      return;
    }

    setIsLoading(true);
    // Simulate brief loading for UX feel
    setTimeout(() => {
      const result = login(formData.username, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Login gagal");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleQuickLogin = (username: string, password: string) => {
    setFormData({ username, password });
  };

  return (
    <div className="flex w-full max-w-md flex-col">
      {/* Logo for mobile */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <img
          className="h-10 w-auto"
          src="/images/logo/logo-beltim.png"
          alt="Logo"
        />
        <span className="text-lg font-bold text-gray-800 dark:text-white">
          SIPINTAR
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Selamat Datang
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
              <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Masukkan username"
            value={formData.username}
            onChange={handleChange("username")}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {showPassword ? (
                <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox checked={rememberMe} onChange={setRememberMe} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Ingat saya
            </span>
          </div>
        </div>

        <Button
          className="w-full !py-3.5 !text-base font-semibold shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
          size="md"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </span>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>

      {/* Demo credentials - redesigned */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 px-3 text-gray-400 dark:bg-gray-900 dark:text-gray-500">
              Demo Akses Cepat
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {mockCredentials.map((cred) => (
            <button
              key={cred.username}
              type="button"
              onClick={() => handleQuickLogin(cred.username, cred.password)}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-md hover:shadow-brand-500/5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 text-sm font-bold text-brand-700 transition-transform group-hover:scale-110 dark:from-brand-500/20 dark:to-brand-600/20 dark:text-brand-400">
                {cred.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {cred.username}
                  </span>
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                    {cred.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Password: {cred.password}
                </p>
              </div>
              <svg
                className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-brand-500 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
