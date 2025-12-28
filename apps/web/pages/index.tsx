import OnboardingLayout from "@/components/layout/onboarding-layout";
import { ReactNode } from "react";

const Home = () => {
  return <div>Welcome to the Home Page</div>;
};

Home.getLayout = (page: ReactNode) => (
  <OnboardingLayout>{page}</OnboardingLayout>
);

export default Home;
