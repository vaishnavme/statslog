import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "universal-cookie";
import { toast } from "@/components/ui/sonner";

const cookie = new Cookies(null, { path: "/" });

export const cookies = {
  set: async (key: string, value: string) => cookie.set(key, value),
  get: async (key: string) => cookie.get(key),
  remove: async (key: string) => cookie.remove(key),
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const processErrorResponse = ({
  err,
  message,
  showToast = true,
}: {
  err: unknown;
  message?: string;
  showToast?: boolean;
}) => {
  let errorMessage = "An unknown error occurred.";
  let status: number | undefined = undefined;

  if (axios.isAxiosError(err)) {
    const errorData = err.response?.data as { error?: { message?: string } };
    errorMessage = errorData?.error?.message || err.message;
    status = err.status;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  if (showToast) {
    toast.error({
      title: "Uh oh! Something went wrong.",
      description: message ?? errorMessage,
    });
  }

  return {
    status,
    message: errorMessage,
  };
};
