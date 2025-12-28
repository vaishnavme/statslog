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
import useAuth from "@/hooks/useAuth";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import error_messages from "@/lib/errors-messages";

const Signup = () => {
  const { loading, signupHandler } = useAuth();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    signupHandler({ email, password });
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
            Signup
          </Button>
        </Form>
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
