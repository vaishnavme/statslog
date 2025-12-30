import Link from "next/link";
import { app_name, app_paths, github_repo } from "@/lib/constants";
import { Text } from "../ui/text";

const Footer = () => (
  <footer className="flex items-center justify-between gap-4 px-4 md:px-0 pb-20 md:pb-6">
    <Text
      sm
      medium
      render={<Link href={app_paths.home} />}
      className="uppercase font-mono hover:text-primary"
    >
      {app_name}
    </Text>

    <Text
      className="text-muted-foreground hover:text-primary"
      render={<Link href={github_repo} />}
    >
      GitHub
    </Text>
  </footer>
);

export default Footer;
