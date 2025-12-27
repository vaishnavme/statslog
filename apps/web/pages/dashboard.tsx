import { FolderOpenDotIcon } from "lucide-react";
import CreateProject from "@/components/project/create-project";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const Dashboard = () => {
  return (
    <div>
      <div className="pt-20">
        <Empty className="border border-dashed w-full max-w-96 mx-auto">
          <div className="border size-10 flex items-center justify-center rounded-lg bg-muted">
            <FolderOpenDotIcon strokeWidth="1.5" />
          </div>
          <EmptyHeader>
            <EmptyTitle>No projects yet l</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateProject />
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
};

export default Dashboard;
