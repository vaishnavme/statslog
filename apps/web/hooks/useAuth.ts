import { useState } from "react";
import { authAPI } from "@/lib/api";
import { cookies, processErrorResponse } from "@/lib/utils";
import useUserStore from "@/store/user-store";

interface LoginSignupHandlerParams {
  email: string;
  password: string;
}

const useAuth = () => {
  const userStore = useUserStore();
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
      cookies.set("id", userData.id);
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
      cookies.set("id", userData.id);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loginHandler,
    signupHandler,
  };
};

export default useAuth;
