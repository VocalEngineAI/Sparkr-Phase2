import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

// The app's main call to action: navy pill, linen bold label (the "Get started" style).
export default function PrimaryButton({ label, className, ...props }: ButtonProps & { label: string }) {
  return (
    <Button {...props} className={cn("h-14 w-full rounded-2xl", className)}>
      <Text className="text-base font-bold">{label}</Text>
    </Button>
  );
}
