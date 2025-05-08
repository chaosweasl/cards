import React from "react";
import Link from "next/link";
import { register } from "@/actions/userControl";

export default async function Home() {
  return (
    <>
      <p className="text-center text-2xl text-gray-600 mb-5">
        Don't have an account? Sign up here:
      </p>
      <form action={register} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input
            name="username"
            autoComplete="false"
            type="text"
            placeholder="Username"
            className="input"
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            autoComplete="false"
            type="password"
            placeholder="Password"
            className="input"
          />
        </div>
        <button className="btn btn-primary">Create Account</button>
      </form>
    </>
  );
}
