import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  type ToasterProps,
  toast as sonnerToast,
} from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

type ToastInput = {
  title: string;
  description?: string;
};

const toast = {
  success: ({ title, description }: ToastInput) =>
    sonnerToast.success(title, {
      description,
    }),

  error: ({ title, description }: ToastInput) =>
    sonnerToast.error(title, {
      description,
    }),

  info: ({ title, description }: ToastInput) =>
    sonnerToast.info(title, {
      description,
    }),

  warning: ({ title, description }: ToastInput) =>
    sonnerToast.warning(title, {
      description,
    }),

  loading: ({ title, description }: ToastInput) =>
    sonnerToast.loading(title, {
      description,
    }),
};

export { Toaster, toast };
