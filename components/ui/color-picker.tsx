"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef
  ) => {
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value;
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            {...props}
            ref={forwardedRef}
            className={cn("block", className)}
            name={name}
            disabled={disabled}
            onBlur={onBlur}
            onClick={() => setOpen(true)}
            size="icon"
            style={{
              backgroundColor: parsedValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <HexColorPicker
            color={parsedValue}
            onChange={onChange}
            className="rounded-md"
          />
          <div className="h-2" />
          <Input
            className="shadow-none"
            maxLength={7}
            onChange={(e) => {
              onChange(e.currentTarget.value);
            }}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
