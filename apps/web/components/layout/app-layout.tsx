import useUserStore from "@/store/user-store";
import BottomNavbar from "./bottom-navbar";
import SidePanel from "./side-panel";
import Footer from "./footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  const user = useUserStore((state) => state.user);

  return (
    <div className="relative max-w-6xl mx-auto">
      <SidePanel />
      <main className={`${user?.id ? "md:ml-56" : ""}`}>
        <div className="min-h-screen">{children}</div>
        <Footer />
      </main>

      <BottomNavbar />
    </div>
  );
};

export default AppLayout;
