import AuthForm from "@/app/components/auth/AuthForm";
import AuthFormContainer from "@/app/components/auth/AuthFormContainer";

export default function SignInPage() {
  return (
    <AuthFormContainer>
      <AuthForm mode="signin" />
    </AuthFormContainer>
  );
}
