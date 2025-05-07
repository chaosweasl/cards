import React from "react";
import SignInButton from "./components/auth/sign-in-button";
import SignOutButton from "./components/auth/sign-out-button";
import UserData from "./components/user-data";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <div>
        {session ? (
          <div className="flex flex-row gap-5">
            <UserData />
            <p>Hello {session.user?.name}</p> <SignOutButton />{" "}
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
      ahoy meow meow meow meow meow meow
    </div>
  );
}
