import { toast } from "@/components/ui/sonner";
import success_messages from "@/lib/success-messages";
import { useState } from "react";

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onCopy = async (
    text: string,
    {
      showToast = false,
      successMessage = success_messages.general.copied_to_clipboard,
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
