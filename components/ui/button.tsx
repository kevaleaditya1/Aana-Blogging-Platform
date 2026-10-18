import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Note: I need to install class-variance-authority and @radix-ui/react-slot
// I will add them to the install list or run a separate install command.
// For now, I'll write the code assuming they will be installed.

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:opacity-95 shadow-sm",
                monochrome: "bg-foreground text-background hover:opacity-90",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
                outline:
                    "border border-black/[0.12] dark:border-white/[0.15] bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-foreground",
                secondary:
                    "bg-black/[0.05] dark:bg-white/[0.08] text-foreground hover:bg-black/[0.08] dark:hover:bg-white/[0.12]",
                ghost: "hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-foreground",
                link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
            },
            size: {
                default: "h-9 px-4 py-2 text-[13px]",
                sm: "h-8 px-3 text-[12px]",
                lg: "h-11 px-6 text-[15px]",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
