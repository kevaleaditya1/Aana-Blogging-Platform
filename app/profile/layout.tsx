import { privateMetadata } from "@/lib/site";
export const metadata = privateMetadata('Your profile');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
