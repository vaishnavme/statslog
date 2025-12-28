import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";

const AppInitializer = () => {
  const router = useRouter();
  const { fetchUser } = useAuth();

  useEffect(() => {
    if (router?.isReady) {
      fetchUser();
    }
  }, [router.isReady]);
  return null;
};

export default AppInitializer;
