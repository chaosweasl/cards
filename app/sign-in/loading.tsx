import AuthFormContainer from "../components/auth/AuthFormContainer";
import AuthSkeleton from "../components/auth/AuthSkeleton";

export default function SignInLoading() {
  return (
    <AuthFormContainer>
      <AuthSkeleton />
    </AuthFormContainer>
  );
}
