import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { ColorPaletteProvider } from "./context/ColorPaletteContext";

// Admin pages
import AdminDashboard from "./pages/Dashboard";
import RoleList from "./pages/roles/RoleList";
import RoleForm from "./pages/roles/RoleForm";
import RoleDetail from "./pages/roles/RoleDetail";
import UserList from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";
import UserResetPassword from "./pages/users/UserResetPassword";
import AuditTrailList from "./pages/audit-trail/AuditTrailList";
import AspekList from "./pages/aspek/AspekList";
import AspekForm from "./pages/aspek/AspekForm";
import JenisKonflikList from "./pages/jenis-konflik/JenisKonflikList";
import JenisKonflikForm from "./pages/jenis-konflik/JenisKonflikForm";
import InstansiList from "./pages/instansi/InstansiList";
import InstansiForm from "./pages/instansi/InstansiForm";
import WilayahList from "./pages/wilayah/WilayahList";
import WilayahForm from "./pages/wilayah/WilayahForm";
import LevelKemungkinanList from "./pages/risiko-matriks/LevelKemungkinanList";
import LevelKemungkinanForm from "./pages/risiko-matriks/LevelKemungkinanForm";
import LevelDampakList from "./pages/risiko-matriks/LevelDampakList";
import LevelDampakForm from "./pages/risiko-matriks/LevelDampakForm";
import LevelRisikoList from "./pages/risiko-matriks/LevelRisikoList";
import LevelRisikoForm from "./pages/risiko-matriks/LevelRisikoForm";
import MatriksRisikoPage from "./pages/risiko-matriks/MatriksRisikoPage";
import KewaspadaanList from "./pages/kewaspadaan/KewaspadaanList";
import KewaspadaanForm from "./pages/kewaspadaan/KewaspadaanForm";
import KewaspadaanDetail from "./pages/kewaspadaan/KewaspadaanDetail";
import EWSDashboard from "./pages/ews/EWSDashboard";
import PotensiKonflikList from "./pages/potensi-konflik/PotensiKonflikList";
import PotensiKonflikForm from "./pages/potensi-konflik/PotensiKonflikForm";
import PotensiKonflikDetail from "./pages/potensi-konflik/PotensiKonflikDetail";
import EWSPotensiKonflik from "./pages/potensi-konflik/EWSPotensiKonflik";
import PeristiwaKonflikList from "./pages/peristiwa-konflik/PeristiwaKonflikList";
import PeristiwaKonflikForm from "./pages/peristiwa-konflik/PeristiwaKonflikForm";
import PeristiwaKonflikDetail from "./pages/peristiwa-konflik/PeristiwaKonflikDetail";
import EWSPeristiwaKonflik from "./pages/peristiwa-konflik/EWSPeristiwaKonflik";
import WNAList from "./pages/wna/WNAList";
import WNAForm from "./pages/wna/WNAForm";
import WNADetail from "./pages/wna/WNADetail";
import EWSWna from "./pages/wna/EWSWna";
import TKAList from "./pages/tka/TKAList";
import TKAForm from "./pages/tka/TKAForm";
import TKADetail from "./pages/tka/TKADetail";
import EWSTka from "./pages/tka/EWSTka";
import GeneralSettingList from "./pages/general-setting/GeneralSettingList";
import PengaturanTampilan from "./pages/pengaturan-tampilan/PengaturanTampilan";
import NotifikasiList from "./pages/notifikasi/NotifikasiList";
import LaporanPeriodik from "./pages/laporan/LaporanPeriodik";
import TindakLanjutList from "./pages/tindak-lanjut/TindakLanjutList";
import TindakLanjutForm from "./pages/tindak-lanjut/TindakLanjutForm";

const basename = import.meta.env.VITE_BASE_PATH || "/";

export default function App() {
  return (
    <Router basename={basename}>
      <ScrollToTop />
      <AuthProvider>
        <ColorPaletteProvider>
        <Routes>
          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main App — Protected */}
          <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/roles/create" element={<RoleForm />} />
            <Route path="/roles/edit/:id" element={<RoleForm />} />
            <Route path="/roles/:id" element={<RoleDetail />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="/users/reset-password/:id" element={<UserResetPassword />} />
            <Route path="/audit-trail" element={<AuditTrailList />} />
            <Route path="/aspek" element={<AspekList />} />
            <Route path="/aspek/create" element={<AspekForm />} />
            <Route path="/aspek/edit/:id" element={<AspekForm />} />
            <Route path="/jenis-konflik" element={<JenisKonflikList />} />
            <Route path="/jenis-konflik/create" element={<JenisKonflikForm />} />
            <Route path="/jenis-konflik/edit/:id" element={<JenisKonflikForm />} />
            <Route path="/instansi" element={<InstansiList />} />
            <Route path="/instansi/create" element={<InstansiForm />} />
            <Route path="/instansi/edit/:id" element={<InstansiForm />} />
            <Route path="/wilayah" element={<WilayahList />} />
            <Route path="/wilayah/create" element={<WilayahForm />} />
            <Route path="/wilayah/edit/:id" element={<WilayahForm />} />
            {/* Matriks Risiko */}
            <Route path="/risiko/kemungkinan" element={<LevelKemungkinanList />} />
            <Route path="/risiko/kemungkinan/create" element={<LevelKemungkinanForm />} />
            <Route path="/risiko/kemungkinan/edit/:id" element={<LevelKemungkinanForm />} />
            <Route path="/risiko/dampak" element={<LevelDampakList />} />
            <Route path="/risiko/dampak/create" element={<LevelDampakForm />} />
            <Route path="/risiko/dampak/edit/:id" element={<LevelDampakForm />} />
            <Route path="/risiko/level" element={<LevelRisikoList />} />
            <Route path="/risiko/level/create" element={<LevelRisikoForm />} />
            <Route path="/risiko/level/edit/:id" element={<LevelRisikoForm />} />
            <Route path="/risiko/matriks" element={<MatriksRisikoPage />} />
            {/* Kewaspadaan Dini */}
            <Route path="/kewaspadaan" element={<KewaspadaanList />} />
            <Route path="/kewaspadaan/create" element={<KewaspadaanForm />} />
            <Route path="/kewaspadaan/edit/:id" element={<KewaspadaanForm />} />
            <Route path="/kewaspadaan/:id" element={<KewaspadaanDetail />} />
            {/* EWS */}
            <Route path="/ews" element={<EWSDashboard />} />
            {/* Potensi Konflik */}
            <Route path="/potensi-konflik" element={<PotensiKonflikList />} />
            <Route path="/potensi-konflik/create" element={<PotensiKonflikForm />} />
            <Route path="/potensi-konflik/edit/:id" element={<PotensiKonflikForm />} />
            <Route path="/potensi-konflik/:id" element={<PotensiKonflikDetail />} />
            <Route path="/ews/potensi-konflik" element={<EWSPotensiKonflik />} />
            {/* Peristiwa Konflik */}
            <Route path="/peristiwa-konflik" element={<PeristiwaKonflikList />} />
            <Route path="/peristiwa-konflik/create" element={<PeristiwaKonflikForm />} />
            <Route path="/peristiwa-konflik/edit/:id" element={<PeristiwaKonflikForm />} />
            <Route path="/peristiwa-konflik/:id" element={<PeristiwaKonflikDetail />} />
            <Route path="/ews/peristiwa-konflik" element={<EWSPeristiwaKonflik />} />
            {/* Warga Negara Asing */}
            <Route path="/wna" element={<WNAList />} />
            <Route path="/wna/create" element={<WNAForm />} />
            <Route path="/wna/edit/:id" element={<WNAForm />} />
            <Route path="/wna/:id" element={<WNADetail />} />
            <Route path="/ews/wna" element={<EWSWna />} />
            {/* Tenaga Kerja Asing */}
            <Route path="/tka" element={<TKAList />} />
            <Route path="/tka/create" element={<TKAForm />} />
            <Route path="/tka/edit/:id" element={<TKAForm />} />
            <Route path="/tka/:id" element={<TKADetail />} />
            <Route path="/ews/tka" element={<EWSTka />} />
            {/* General Setting */}
            <Route path="/general-setting" element={<GeneralSettingList />} />
            {/* Pengaturan Tampilan */}
            <Route path="/pengaturan-tampilan" element={<PengaturanTampilan />} />
            {/* Notifikasi */}
            <Route path="/notifikasi" element={<NotifikasiList />} />
            {/* Laporan Periodik */}
            <Route path="/laporan" element={<LaporanPeriodik />} />
            {/* Tindak Lanjut & Keputusan */}
            <Route path="/tindak-lanjut" element={<TindakLanjutList />} />
            <Route path="/tindak-lanjut/create" element={<TindakLanjutForm />} />
          </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ColorPaletteProvider>
      </AuthProvider>
    </Router>
  );
}
