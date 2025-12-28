import { FolderOpenDotIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../ui/empty";
import CreateProject from "./create-project";

const NoProjectEmptyState = () => (
  <Empty className="border border-dashed w-full min-h-[calc(100vh-32px)] mx-auto bg-muted/25">
    <div className="border size-10 flex items-center justify-center rounded-lg bg-muted">
      <FolderOpenDotIcon strokeWidth="1.5" />
    </div>
    <EmptyHeader>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        You haven&apos;t created any projects yet.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <CreateProject />
    </EmptyContent>
  </Empty>
);

export default NoProjectEmptyState;
