import AuthFormContainer from "../components/AuthFormContainer";
import AuthSkeleton from "../components/AuthSkeleton";

export default function SignUpLoading() {
  return (
    <AuthFormContainer>
      <AuthSkeleton />
    </AuthFormContainer>
  );
}
