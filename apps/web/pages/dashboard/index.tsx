import { LoaderIcon } from "lucide-react";
import CreateProject from "@/components/project/create-project";
import NoProjectEmptyState from "@/components/project/no-projects";
import ProjectList from "@/components/project/project-list";
import { Text } from "@/components/ui/text";
import useProjectStore from "@/store/project-store";

const Dashboard = () => {
  const projects = useProjectStore((state) => state.projects);
  const isProjectLoading = useProjectStore((state) => state.isLoading);

  return (
    <>
      {isProjectLoading ? (
        <div className="p-4 min-h-screen flex items-center justify-center">
          <LoaderIcon className="animate-spin" size={24} />
        </div>
      ) : null}

      {!isProjectLoading && projects.length === 0 ? (
        <div className="min-h-screen flex p-4">
          <NoProjectEmptyState />
        </div>
      ) : null}

      {!isProjectLoading && projects.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <Text sm medium className="font-mono uppercase tracking-wider">
              ALL PROJECT(s)
            </Text>
            <CreateProject />
          </div>
          <ProjectList projects={projects} />
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
