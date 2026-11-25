import { TextClassContext } from "@/src/components/ui/text";
import { cn } from "@/src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-2xl shadow-none",
    Platform.select({
      web: "focus-visible:border-accent focus-visible:ring-accent/50 aria-invalid:ring-warning/20 aria-invalid:border-warning whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn("bg-primary active:bg-primary/90", Platform.select({ web: "hover:bg-primary/90" })),
        destructive: cn("bg-warning active:bg-warning/90", Platform.select({ web: "hover:bg-warning/90" })),
        outline: cn(
          "border-border bg-background active:bg-surface border",
          Platform.select({ web: "hover:bg-surface" })
        ),
        secondary: cn("bg-surface active:bg-surface/80", Platform.select({ web: "hover:bg-surface/80" })),
        ghost: cn("active:bg-surface", Platform.select({ web: "hover:bg-surface" })),
        link: "",
      },
      size: {
        default: cn("h-10 px-4 py-2 sm:h-9", Platform.select({ web: "has-[>svg]:px-3" })),
        sm: cn("h-9 gap-1.5 rounded-xl px-3 sm:h-8", Platform.select({ web: "has-[>svg]:px-2.5" })),
        lg: cn("h-11 rounded-2xl px-6 sm:h-10", Platform.select({ web: "has-[>svg]:px-4" })),
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva(
  cn("text-text text-sm font-medium", Platform.select({ web: "pointer-events-none transition-colors" })),
  {
    variants: {
      variant: {
        default: "text-background",
        destructive: "text-background",
        outline: cn("group-active:text-text", Platform.select({ web: "group-hover:text-text" })),
        secondary: "text-text",
        ghost: "group-active:text-text",
        link: cn(
          "text-primary group-active:underline",
          Platform.select({ web: "underline-offset-4 hover:underline group-hover:underline" })
        ),
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled && "opacity-50", buttonVariants({ variant, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
