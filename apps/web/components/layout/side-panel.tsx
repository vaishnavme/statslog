import { useRouter } from "next/router";
import Link from "next/link";
import { BoxIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { app_paths } from "@/lib/constants";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";

export const side_panels = [
  {
    icon: BoxIcon,
    label: "Dashboard",
    link: app_paths.dashboard,
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    link: app_paths.settings,
  },
];

const SidePanel = () => {
  const router = useRouter();
  const { loading, logoutHandler } = useAuth();

  return (
    <aside className="fixed min-h-svh w-full max-w-56 p-4 hidden md:flex flex-col justify-between gap-6">
      <div className="space-y-10 ">
        <div className="ml-2">
          <Text medium lg className="font-mono uppercase">
            StatsLog
          </Text>
        </div>

        <div className="flex flex-col gap-2">
          {side_panels.map((option) => (
            <Link
              href={option.link}
              key={option.link}
              prefetch
              data-state={router.asPath.includes(option.link) ? "on" : "off"}
              className="text-xs font-mono uppercase tracking-wider font-medium px-2 flex items-center gap-2 rounded-md h-8 border border-transparent text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent data-[state=on]:text-foreground data-[state=on]:bg-accent data-[state=on]:border-accent"
            >
              <option.icon size={16} />
              {option.label}
            </Link>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="lg"
        loading={loading}
        onClick={logoutHandler}
        className="w-full justify-start hover:text-rose-600"
      >
        <LogOutIcon />
        Logout
      </Button>
    </aside>
  );
};

export default SidePanel;
