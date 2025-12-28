import { toast } from "@/components/ui/sonner";
import { useState } from "react";

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onCopy = async (
    text: string,
    {
      showToast = false,
      successMessage = "Copied to clipboard!",
    }: {
      showToast?: boolean;
      successMessage?: string;
    } = {}
  ) => {
    try {
      if (!navigator.clipboard) {
        setIsCopied(false);
        return;
      }
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1200);
      if (showToast) {
        toast.success({ title: successMessage });
      }
    } catch {
      setIsCopied(false);
    }
  };

  return { isCopied, onCopy };
};

export default useCopyToClipboard;
