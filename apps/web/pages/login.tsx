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

const Login = () => {
  return (
    <div className="h-[calc(100vh-48px)] flex items-center justify-center">
      <Card className="w-full max-w-96 mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
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

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Text xs className="text-center">
            Don&apos;t have an account?{" "}
            <Link href={app_paths.signup} className="underline font-medium">
              Sign up
            </Link>
          </Text>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
