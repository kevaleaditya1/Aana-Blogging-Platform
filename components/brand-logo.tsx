import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
    return (
        <span className={cn("relative inline-block h-6 w-[112px] shrink-0", className)}>
            <Image
                src="/brand/wordmark-light.svg"
                alt="Aana"
                fill
                sizes="112px"
                className="object-contain dark:hidden"
                unoptimized
            />
            <Image
                src="/brand/wordmark-dark.svg"
                alt=""
                aria-hidden="true"
                fill
                sizes="112px"
                className="hidden object-contain dark:block"
                unoptimized
            />
        </span>
    );
}
