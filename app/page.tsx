import React from "react";
import Link from "next/link";

function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome to homepage!</h1>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/blackjack">Blackjack</Link>
    </div>
  );
}

export default Homepage;
