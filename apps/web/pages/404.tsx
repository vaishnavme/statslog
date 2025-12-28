import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { app_paths } from "@/lib/constants";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="p-4">
      <Empty className="border border-dashed w-full min-h-[calc(100vh-32px)] mx-auto bg-muted/25">
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeftIcon />
            Go back
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default NotFound;
