import { Navigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../context/AuthContext";

export default function SignIn() {
  const { isAuthenticated } = useAuth();

  // Jika sudah login, redirect ke dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageMeta
        title="Sign In | SIPINTAR"
        description="Sign in to SIPINTAR application"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
