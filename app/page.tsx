import React from "react";
import SignInButton from "./components/auth/sign-in-button";
import { auth } from "@/auth";
import SignOutButton from "./components/auth/sign-out-button";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <div>
        {session ? (
          <>
            {" "}
            <p>Hello {session.user?.name}</p> <SignOutButton />{" "}
          </>
        ) : (
          <SignInButton />
        )}
      </div>
      ahoy meow meow meow meow meow meow
    </div>
  );
}
