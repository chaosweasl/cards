import AuthForm from "../components/AuthForm";
import AuthFormContainer from "../components/AuthFormContainer";

export default function SignUpPage() {
  return (
    <AuthFormContainer>
      <AuthForm mode="signup" />
    </AuthFormContainer>
  );
}
