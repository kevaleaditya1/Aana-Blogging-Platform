import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-primary/10 text-primary border border-primary/20 backdrop-blur-md",
                secondary:
                    "bg-black/[0.04] dark:bg-white/[0.08] backdrop-blur-md text-foreground border border-black/[0.04] dark:border-white/[0.06]",
                glass:
                    "bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.12] text-foreground shadow-sm",
                destructive:
                    "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 backdrop-blur-md",
                outline: "border border-black/[0.1] dark:border-white/[0.12] text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
