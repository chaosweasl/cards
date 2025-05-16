import AuthForm from "@/app/components/auth/AuthForm";
import AuthFormContainer from "@/app/components/auth/AuthFormContainer";

export default function SignUpPage() {
  return (
    <AuthFormContainer>
      <AuthForm mode="signup" />
    </AuthFormContainer>
  );
}
