import Navbar from "./navbar";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout = (props: OnboardingLayoutProps) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-50px)] flex items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default OnboardingLayout;
