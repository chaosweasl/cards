import AuthFormContainer from "../components/AuthFormContainer";
import AuthSkeleton from "../components/AuthSkeleton";

export default function SignInLoading() {
  return (
    <AuthFormContainer>
      <AuthSkeleton />
    </AuthFormContainer>
  );
}
