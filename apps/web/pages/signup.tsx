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

const Signup = () => {
  return (
    <div className="h-[calc(100vh-48px)] flex items-center justify-center">
      <Card className="w-full max-w-96 mx-auto">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
              Signup
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Text xs className="text-center">
            Already have an account?{" "}
            <Link href={app_paths.login} className="underline font-medium">
              Login
            </Link>
          </Text>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
