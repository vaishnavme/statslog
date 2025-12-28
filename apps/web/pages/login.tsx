import { ReactNode } from "react";
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
import { Text } from "@/components/ui/text";
import { app_paths } from "@/lib/constants";
import OnboardingLayout from "@/components/layout/onboarding-layout";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import error_messages from "@/lib/errors-messages";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { loading, loginHandler } = useAuth();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    loginHandler({ email, password });
  };

  return (
    <Card className="w-full max-w-96 mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={onSubmit}>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldControl
              name="email"
              type="email"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
            <FieldError>{error_messages.auth.empty_email.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldControl
              name="password"
              type="password"
              disabled={loading}
              required
            />
            <FieldError>
              {error_messages.auth.empty_password.message}
            </FieldError>
          </Field>

          <Button
            className="w-full"
            loading={loading}
            disabled={loading}
            type="submit"
            size="lg"
          >
            Login
          </Button>
        </Form>
      </CardContent>
      <CardFooter>
        <Text xs>
          Don&apos;t have an account?{" "}
          <Link href={app_paths.signup} className="underline font-medium">
            Sign up
          </Link>
        </Text>
      </CardFooter>
    </Card>
  );
};

Login.getLayout = (page: ReactNode) => (
  <OnboardingLayout>{page}</OnboardingLayout>
);

export default Login;
