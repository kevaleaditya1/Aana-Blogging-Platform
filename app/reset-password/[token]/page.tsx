import { PasswordForm } from "@/components/password-form";
export default async function Page({params}:{params:Promise<{token:string}>}){ const {token}=await params; return <PasswordForm token={token} />; }
