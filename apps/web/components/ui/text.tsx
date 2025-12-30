import { JSX } from "react";
import { mergeProps, useRender } from "@base-ui/react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("font-sans", {
  variants: {
    size: {
      xxs: "text-[10px]",
      xs: "text-[12px]",
      sm: "text-[14px]",
      default: "text-[16px]",
      lg: "text-[18px]",
      xl: "text-[20px]",
      xxl: "text-[24px]",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "default",
    weight: "normal",
  },
});

type SizeFlags = {
  xxs?: boolean;
  xs?: boolean;
  sm?: boolean;
  default?: boolean;
  lg?: boolean;
  xl?: boolean;
  xxl?: boolean;
};

type WeightFlags = {
  normal?: boolean;
  medium?: boolean;
  semibold?: boolean;
};

type IntrinsicElement = keyof JSX.IntrinsicElements;

type TextProps = useRender.ComponentProps<"p"> &
  SizeFlags &
  WeightFlags & {
    className?: string;
    as?: IntrinsicElement;
  };

function Text({
  className,
  render,
  xxs,
  xs,
  sm,
  default: defaultSize,
  lg,
  xl,
  xxl,
  normal,
  medium,
  semibold,
  ...props
}: TextProps) {
  const size =
    (xxs && "xxs") ||
    (xs && "xs") ||
    (sm && "sm") ||
    (defaultSize && "default") ||
    (lg && "lg") ||
    (xl && "xl") ||
    (xxl && "xxl") ||
    undefined;

  const weight =
    (semibold && "semibold") ||
    (medium && "medium") ||
    (normal && "normal") ||
    undefined;

  const defaultProps = {
    "data-slot": "text",
    className: cn(textVariants({ size, weight }), className),
  };

  return useRender({
    defaultTagName: "p",
    render,
    props: mergeProps<"p">(defaultProps, props),
  });
}

export { Text, textVariants };
