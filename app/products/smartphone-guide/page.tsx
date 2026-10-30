import Link from "next/link";
import { pageMetadata } from "@/lib/site";
export const metadata = { ...pageMetadata("Smartphone Buying Guide", "Browse Aana's smartphone articles while a downloadable buying guide is being prepared.", "/products/smartphone-guide"), robots: { index: false, follow: true } };
export default function SmartphoneGuide() {
 return <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
  <h1 className="text-3xl font-bold">Smartphone buying guide</h1>
  <p>A downloadable guide is not currently available to purchase. In the meantime, explore our published articles.</p>
  <Link href="/blog" className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-background">Explore articles</Link>
  <p className="text-sm">Questions? <Link href="/contact" className="underline">Contact Aana</Link>.</p>
 </div>;
}
