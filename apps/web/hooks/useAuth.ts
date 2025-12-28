import { useState } from "react";
import { useRouter } from "next/router";
import { authAPI, userAPI } from "@/lib/api";
import { cookies, processErrorResponse } from "@/lib/utils";
import useUserStore from "@/store/user-store";
import { app_paths } from "@/lib/constants";

interface LoginSignupHandlerParams {
  email: string;
  password: string;
}

const redirectOnLogin = [app_paths.home, app_paths.login, app_paths.signup];

const useAuth = () => {
  const userStore = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const loginHandler = async ({
    email,
    password,
  }: LoginSignupHandlerParams) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);

      const userData = response?.data?.user;
      userStore.setUser(userData);
      await cookies.set("id", userData.id);

      router.replace(app_paths.dashboard);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  const signupHandler = async ({
    email,
    password,
  }: LoginSignupHandlerParams) => {
    try {
      setLoading(true);
      const response = await authAPI.signup(email, password);

      const userData = response?.data?.user;
      userStore.setUser(userData);
      await cookies.set("id", userData.id);

      router.replace(app_paths.dashboard);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const id = await cookies.get("id");
    if (!id) {
      if (!redirectOnLogin.includes(router.asPath)) {
        router.replace(app_paths.home);
      }
      return;
    }

    try {
      const response = await userAPI.me();
      const userData = response?.data?.user;
      userStore.setUser(userData);
    } catch (err) {
      processErrorResponse({ err });
    }
  };

  return {
    loading,
    fetchUser,
    loginHandler,
    signupHandler,
  };
};

export default useAuth;
