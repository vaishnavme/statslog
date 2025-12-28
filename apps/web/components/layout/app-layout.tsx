import BottomNavbar from "./bottom-navbar";
import SidePanel from "./side-panel";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <SidePanel />
      <main className="md:ml-56 min-h-screen">{children}</main>
      <BottomNavbar />
    </div>
  );
};

export default AppLayout;
