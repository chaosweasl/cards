"use client";

import Link from "next/link";

export default function AuthModal() {
  const handleCloseModal = () => {
    document.getElementById("auth-modal")?.classList.remove("modal-open");
  };

  return (
    <div id="auth-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Authentication Required</h3>
        <p className="py-4">You need to be signed in to play Blackjack.</p>
        <div className="modal-action">
          <Link href="/sign-in" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn">
            Sign Up
          </Link>
          <button className="btn btn-outline" onClick={handleCloseModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
