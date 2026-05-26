import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Login gagal");
      }
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex w-full flex-col">
      {/* Welcome text */}
      <div
        className={`mb-7 transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90">
          Selamat Datang
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-white/50">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`w-full space-y-4 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-400/30 dark:bg-red-500/10 animate-shake">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
              <svg className="h-3.5 w-3.5 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700 dark:text-red-200">
              {error}
            </p>
          </div>
        )}

        {/* Username */}
        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white/70">
            Username
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-4.5 w-4.5 text-gray-400 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange("username")}
              className="w-full rounded-xl border border-gray-200/50 bg-white/30 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-primary-300 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/30 dark:focus:border-white/30 dark:focus:bg-white/10 dark:focus:ring-white/10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white/70">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-4.5 w-4.5 text-gray-400 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange("password")}
              className="w-full rounded-xl border border-gray-200/50 bg-white/30 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-primary-300 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/30 dark:focus:border-white/30 dark:focus:bg-white/10 dark:focus:ring-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/70"
            >
              {showPassword ? (
                <EyeIcon className="size-4.5 fill-current" />
              ) : (
                <EyeCloseIcon className="size-4.5 fill-current" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox checked={rememberMe} onChange={setRememberMe} />
          <span className="text-sm text-gray-500 dark:text-white/50">
            Ingat saya
          </span>
        </div>

        {/* Submit button */}
        <Button
          className="w-full !rounded-xl !py-3.5 !text-base font-semibold shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]"
          size="md"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Masuk
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </Button>
      </form>

      {/* Demo credentials */}
      <div
        className={`mt-8 w-full transition-all duration-700 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/30 px-3 text-gray-400 backdrop-blur-sm dark:bg-transparent dark:text-white/30">
              Demo Akses Cepat
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          {mockCredentials.map((cred, index) => (
            <button
              key={cred.username}
              type="button"
              onClick={() => handleQuickLogin(cred.username, cred.password)}
              className={`group flex items-center gap-3 rounded-xl border border-white/50 bg-white/25 px-4 py-2.5 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary-200 hover:bg-white/50 hover:shadow-md hover:shadow-primary-500/5 hover:scale-[1.02] active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10 ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${600 + index * 80}ms` }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white shadow-md shadow-primary-500/30 transition-transform duration-300 group-hover:scale-110">
                {cred.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/80">
                    {cred.username}
                  </span>
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-white/10 dark:text-white/50">
                    {cred.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-white/30">
                  Password: {cred.password}
                </p>
              </div>
              <svg
                className="h-3.5 w-3.5 text-gray-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary-500 dark:text-white/20 dark:group-hover:text-white/50"
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
