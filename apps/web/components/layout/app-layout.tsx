import Navbar from "./navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  return (
    <div>
      <header className="border-b">
        <Navbar />
      </header>
      <main className="px-4">{children}</main>
    </div>
  );
};

export default AppLayout;
