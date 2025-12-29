import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/router";
import { projectAPI } from "@/lib/api";
import useUserStore from "@/store/user-store";
import { processErrorResponse } from "@/lib/utils";
import { Project } from "@/store/project-store";
import { Text } from "@/components/ui/text";

const ProjectDashboard = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const appId = router.query.appId;

  const fetchDashboard = async (appId: string) => {
    if (!appId) return;
    try {
      setLoading(true);
      const response = await projectAPI.getDashboard(appId);

      setProject(response?.data?.project || null);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appId) {
      fetchDashboard(appId as string);
    }
  }, [appId, user?.id]);

  return (
    <>
      {loading ? (
        <div className="p-4 min-h-screen flex items-center justify-center">
          <LoaderIcon className="animate-spin" size={24} />
        </div>
      ) : null}

      {!loading && project?.id ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 py-4 sm:px-0">
            <div>
              <Text sm medium className="font-mono uppercase tracking-wider">
                {project.name || "Project Dashboard"}
              </Text>
              <Text xs medium className="font-mono text-muted-foreground">
                {project.domain}
              </Text>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProjectDashboard;
