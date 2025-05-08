"use client";

import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/lib/userControl";

export default function RegisterForm() {
  const [formState, formAction] = useFormState(register, {});

  console.log(formState);

  return (
    <>
      <form action={formAction} className="max-w-xs mx-auto">
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
