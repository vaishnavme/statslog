import { useEffect } from "react";
import { useRouter } from "next/router";
import { projectAPI } from "@/lib/api";
import useUserStore from "@/store/user-store";
import { processErrorResponse } from "@/lib/utils";

const ProjectDashboard = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const appId = router.query.appId;

  const fetchDashboard = async (appId: string) => {
    if (!appId) return;
    try {
      const response = await projectAPI.getDashboard(appId);
      console.log("Dashboard Data:", response);
    } catch (err) {
      processErrorResponse({ err });
    }
  };

  useEffect(() => {
    if (appId) {
      fetchDashboard(appId as string);
    }
  }, [appId, user?.id]);

  return <div>Project Dashboard</div>;
};

export default ProjectDashboard;
