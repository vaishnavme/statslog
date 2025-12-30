import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/router";
import { projectAPI } from "@/lib/api";
import useUserStore from "@/store/user-store";
import { processErrorResponse } from "@/lib/utils";
import { Project } from "@/store/project-store";
import { Text } from "@/components/ui/text";
import TimePeriodSelect, {
  TimePeriod,
} from "@/components/dashboard/time-period-select";
import MainGraph from "@/components/dashboard/main-graph";
import PageViewGraph from "@/components/dashboard/page-view-graph";
import BrowserGraph from "@/components/dashboard/browser-graph";
import SEO from "@/components/ui/seo";

const ProjectDashboard = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [period, setPeriod] = useState<TimePeriod>("7d");
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
      <SEO
        title={
          project?.name
            ? `${project.name} – StatsLog Dashboard `
            : "StatsLog Dashboard"
        }
      />
      {loading ? (
        <div className="p-4 min-h-screen flex items-center justify-center">
          <LoaderIcon className="animate-spin" size={24} />
        </div>
      ) : null}

      {!loading && project?.id ? (
        <div className="pb-10">
          <div className="flex items-start justify-between px-4 py-4 md:px-0">
            <div>
              <Text
                sm
                medium
                render={<h1 />}
                className="font-mono uppercase tracking-wider"
              >
                {project.name || "Project Dashboard"}
              </Text>
              <Text xs medium className="font-mono text-muted-foreground">
                {project.domain}
              </Text>
            </div>
            <TimePeriodSelect value={period} onChange={setPeriod} />
          </div>

          <div className="space-y-6 px-4 md:px-0">
            <MainGraph appId={project.appId} period={period} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PageViewGraph appId={project.appId} period={period} />
              <BrowserGraph appId={project.appId} period={period} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProjectDashboard;
