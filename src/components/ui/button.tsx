
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

<button
  onClick={onClick}
  className="
    company-card hierarchy-card
    w-full text-left group
  "
>

        // NOVOS variants para mini ações
        soft: "bg-primary/15 text-primary hover:bg-primary/20",
        muted: "bg-muted text-muted-foreground hover:bg-accent/20 hover:text-foreground",
        chip: "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground rounded-full",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",

        // NOVOS tamanhos compactos
        xs: "h-7 rounded-md px-2 text-xs gap-1",
        xxs: "h-6 rounded-md px-2 text-[11px] gap-1 [&_svg]:size-3",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-6 w-6 [&_svg]:size-3",
      },

      // Estado de toggle (para curtida/comentários ativos)
      pressed: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Estilo quando "pressed" em cada variant novo
      {
        variant: "soft",
        pressed: true,
        class: "bg-primary/25 text-primary shadow-inner",
      },
      {
        variant: "muted",
        pressed: true,
        class: "bg-accent/30 text-foreground",
      },
      {
        variant: "chip",
        pressed: true,
        class: "bg-primary/15 text-primary border border-primary/30",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      pressed: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Marca visualmente como ativo (toggle) e aplica aria-pressed */
  pressed?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pressed, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        // type padrão para evitar submit em formulários
        type={type ?? "button"}
        className={cn(buttonVariants({ variant, size, pressed, className }))}
        ref={ref}
        // Acessibilidade para botões de toggle
        aria-pressed={pressed}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
