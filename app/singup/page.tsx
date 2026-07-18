import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join TAKSH and start creating personalized gifts."
    >
      <SignupForm />
    </AuthLayout>
  );
}