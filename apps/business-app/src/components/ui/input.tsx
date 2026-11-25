import { cn } from "@/src/lib/utils";
import { Platform, TextInput } from "react-native";

function Input({ className, ...props }: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "border-border bg-surface text-text flex h-12 w-full min-w-0 flex-row items-center rounded-xl border px-4 text-base leading-5 sm:h-9",
        props.editable === false &&
          cn("opacity-50", Platform.select({ web: "disabled:pointer-events-none disabled:cursor-not-allowed" })),
        Platform.select({
          web: cn(
            "placeholder:text-textMuted selection:bg-primary selection:text-background outline-none transition-[color,box-shadow] md:text-sm",
            "focus-visible:border-accent focus-visible:ring-accent/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-warning/20 aria-invalid:border-warning"
          ),
          native: "placeholder:text-textMuted/70",
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
