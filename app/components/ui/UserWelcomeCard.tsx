"use client";

import Link from "next/link";
import { useAuth } from "@/app/_providers/AuthProvider";

const cardClasses = "card bg-base-200 shadow-xl";
const cardBodyClasses = "card-body items-center text-center";
const buttonWrapperClasses = "card-actions justify-center mt-4";

export default function UserWelcomeCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={cardClasses}>
        <div className={cardBodyClasses}>
          <h2 className="card-title">Sign In to Play More</h2>
          <p>
            Sign in with your GitHub account to access more games and save your
            progress.
          </p>
          <div className={buttonWrapperClasses}>
            <Link href="/sign-in" className="btn btn-neutral">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userName = user.user_metadata?.name || user.email;

  return (
    <div className={cardClasses}>
      <div className={cardBodyClasses}>
        <h2 className="card-title">Welcome Back!</h2>
        <p>Glad to see you again, {userName}!</p>
        <div className={buttonWrapperClasses}>
          <Link href="/profile" className="btn btn-accent">
            View Profile
          </Link>
        </div>
        <p className="text-base-content/70 mt-2">
          <span className="line-through">More games coming soon!</span>{" "}
          (probably not)
        </p>
      </div>
    </div>
  );
}
