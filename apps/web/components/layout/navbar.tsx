import { app_paths } from "@/lib/constants";
import Link from "next/link";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

const login_signup_links = [
  {
    label: "Login",
    link: app_paths.login,
  },
  {
    label: "Signup",
    link: app_paths.signup,
  },
];

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="border-b">
      <nav className="flex items-center justify-between h-12 w-full max-w-6xl mx-auto px-4">
        <Link href={app_paths.home}>
          <Text semibold>StatsLog</Text>
        </Link>

        <div className="flex items-center">
          {login_signup_links.map((item) => (
            <Button
              className={`${router.pathname === item.link ? "hidden" : ""}`}
              asChild
              variant="link"
              key={item.label}
            >
              <Link href={item.link}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
