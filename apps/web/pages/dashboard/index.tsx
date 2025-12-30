import { LoaderIcon } from "lucide-react";
import CreateProject from "@/components/project/create-project";
import NoProjectEmptyState from "@/components/project/no-projects";
import ProjectList from "@/components/project/project-list";
import useProjectStore from "@/store/project-store";
import PageHeader from "@/components/layout/page-header";
import SEO from "@/components/ui/seo";

const Dashboard = () => {
  const projects = useProjectStore((state) => state.projects);
  const isProjectLoading = useProjectStore((state) => state.isLoading);

  return (
    <>
      <SEO />
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
          <PageHeader title="ALL PROJECT(s)">
            <CreateProject />
          </PageHeader>

          <ProjectList projects={projects} />
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
