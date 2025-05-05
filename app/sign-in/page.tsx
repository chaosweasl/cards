import SignInButton from "../components/auth/sign-in-button";

export default async function SignIn() {
  return (
    <div>
      You are not signed in :(
      <SignInButton />
    </div>
  );
}
