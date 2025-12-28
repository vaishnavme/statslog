import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import useUserStore from "@/store/user-store";
import useProjectStore from "@/store/project-store";
import { projectAPI } from "@/lib/api";
import { processErrorResponse } from "@/lib/utils";

const AppInitializer = () => {
  const router = useRouter();
  const { fetchUser } = useAuth();

  const user = useUserStore((state) => state.user);
  const { projects, setProjects, setLoading } = useProjectStore(
    (state) => state
  );

  const fetchAllUserProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      const allProjects = response?.data?.projects || [];

      setProjects(allProjects);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.isReady) {
      fetchUser();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (user?.id && projects.length === 0) {
      fetchAllUserProjects();
    }
  }, [user?.id, projects.length]);

  return null;
};

export default AppInitializer;
