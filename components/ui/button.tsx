import Link from "next/link";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-navy-900 text-white hover:bg-navy-700",
        primary: "bg-gold-500 text-navy-900 hover:bg-gold-200",
        secondary: "bg-slate-100 text-navy-900 hover:bg-slate-200",
        outline:
          "border border-slate-300 bg-transparent text-navy-900 hover:bg-slate-100",
        ghost: "hover:bg-slate-100",
        destructive: "bg-navy-900 text-white",
        link: "underline underline-offset-4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, asChild, className, variant, size, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    if (href)
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    const Component = asChild ? Slot : "button";
    return (
      <Component className={classes} ref={ref} {...props}>
        {children}
      </Component>
    );
  },
);
Button.displayName = "Button";
