"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { PublicForm } from "@/components/public-form";
import { Button } from "@/components/ui/button";
export default function SignupPage() {
 const [pending,setPending]=useState(false);const [error,setError]=useState("");
 const google=async()=>{if(pending)return;setPending(true);setError("");try{await signIn("google",{callbackUrl:"/"});}catch{setError("Google sign-in could not start. Please try again.");}finally{setPending(false);}};
 return <div className="mx-auto w-full max-w-md px-4 py-12"><div className="glass-card space-y-6 rounded-3xl p-6">
  <h1 className="text-3xl font-bold">Create your account</h1><p>Save articles and join tech discussions.</p>
  <Button type="button" variant="outline" onClick={google} disabled={pending} aria-busy={pending} className="min-h-11 w-full">{pending?"Opening Google…":"Continue with Google"}</Button>
  {error&&<p role="alert">{error}</p>}<PublicForm kind="signup" />
  <p className="text-sm">Already have an account? <Link className="underline" href="/login">Sign in</Link></p>
 </div></div>;
}
