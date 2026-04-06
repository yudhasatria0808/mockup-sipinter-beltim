import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";

// Admin pages
import AdminDashboard from "./pages/Dashboard";
import RoleList from "./pages/roles/RoleList";
import RoleForm from "./pages/roles/RoleForm";
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

const basename = import.meta.env.VITE_BASE_PATH || "/";

export default function App() {
  return (
    <Router basename={basename}>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main App */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/roles/create" element={<RoleForm />} />
            <Route path="/roles/edit/:id" element={<RoleForm />} />
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
