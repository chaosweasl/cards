import React from "react";
import RegisterForm from "@/components/RegisterForm";

export default async function Home() {
  return (
    <>
      <p className="text-center text-2xl text-gray-600 mb-5">
        Don&rsquo;t have an account? Sign up here:
      </p>
      <RegisterForm />
    </>
  );
}
