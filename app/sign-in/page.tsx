import React from "react";
import Link from "next/link";
function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome to sign in page!</h1>
      <h2>no account? sign up instead!</h2>
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}

export default SignIn;
