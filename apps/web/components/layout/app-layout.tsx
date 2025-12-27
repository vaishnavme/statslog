import Navbar from "./navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  return (
    <>
      <Navbar />
      <main className="px-4">{children}</main>
    </>
  );
};

export default AppLayout;
