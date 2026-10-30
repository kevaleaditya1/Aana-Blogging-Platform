import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
export default function NotFound() {
 return <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
  <BrandLogo /><p className="text-sm font-semibold text-primary">404 · Page not found</p>
  <h1 className="text-3xl font-bold">Let’s find your next read.</h1>
  <p>This page may have moved or the link may be incorrect.</p>
  <div className="flex flex-wrap justify-center gap-4">
   <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-background">Back to homepage</Link>
   <Link href="/blog" className="inline-flex min-h-11 items-center rounded-full border px-6">Explore articles</Link>
  </div>
 </div>;
}
