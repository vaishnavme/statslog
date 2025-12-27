import { ReactNode, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { app_paths } from "@/lib/constants";
import { authAPI } from "@/lib/api";
import { processErrorResponse } from "@/lib/utils";
import OnboardingLayout from "@/components/layout/onboarding-layout";
import useUserStore from "@/store/user-store";

const Signup = () => {
  const userStore = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);

  const onSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);
      const response = await authAPI.signup(email, password);
      const user = response?.data?.user;
      userStore.setUser(user);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-96 mx-auto">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={onSignupSubmit}>
          <Input
            id="email"
            name="email"
            label="Email"
            placeholder="m@example.com"
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
          />

          <Button size="lg" type="submit" loading={loading} className="w-full">
            Signup
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Text xs>
          Already have an account?{" "}
          <Link href={app_paths.login} className="underline font-medium">
            Login
          </Link>
        </Text>
      </CardFooter>
    </Card>
  );
};

Signup.getLayout = (page: ReactNode) => (
  <OnboardingLayout>{page}</OnboardingLayout>
);

export default Signup;
