import useUserStore from "@/store/user-store";
import BottomNavbar from "./bottom-navbar";
import SidePanel from "./side-panel";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  const user = useUserStore((state) => state.user);

  return (
    <div className="relative max-w-6xl mx-auto">
      <SidePanel />
      <main className={`${user?.id ? "ml-56" : ""} min-h-screen`}>
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
};

export default AppLayout;
