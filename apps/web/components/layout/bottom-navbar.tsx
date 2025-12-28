import Link from "next/link";
import { useRouter } from "next/router";
import { side_panels } from "./side-panel";
import { Text } from "../ui/text";

const BottomNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed z-10 left-0 bottom-0 w-full bg-background border-t border-accent h-14 flex items-center md:hidden">
      {side_panels.map((option) => (
        <Link
          key={option.link}
          href={option.link}
          data-state={router.asPath.includes(option.link) ? "on" : "off"}
          className="flex items-center flex-1 gap-2 p-2 hover:bg-accent text-center justify-center border-t-2 border-transparent text-muted-foreground data-[state=on]:text-foreground data-[state=on]:bg-accent data-[state=on]:border-primary"
        >
          <div className="flex flex-col items-center justify-center gap-0.5">
            <option.icon size={18} />
            <Text xs medium className="font-mono uppercase tracking-wider">
              {option.label}
            </Text>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavbar;
