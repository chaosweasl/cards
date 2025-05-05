import React from "react";
import SignInButton from "./components/sign-in-button";
import { auth } from "@/auth";
import SignOutButton from "./components/sign-out-button";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <>
        <h1 className="text-4xl">you are not signed in :(</h1>
        <SignInButton />
      </>
    );
  }

  const user = session.user;

  if (!user) {
    throw new Error("Oops! User is not valid?");
  }

  return (
    <div>
      <h1>welcome to homepage!</h1>
      <h2>you are signed in, {user.name} :)</h2>

      <SignOutButton />
    </div>
  );
}
