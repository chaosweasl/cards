import AuthFormContainer from "@/app/components/auth/AuthFormContainer";
import AuthSkeleton from "@/app/components/auth/AuthSkeleton";

export default function SignUpLoading() {
  return (
    <AuthFormContainer>
      <AuthSkeleton />
    </AuthFormContainer>
  );
}
