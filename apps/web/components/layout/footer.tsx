import Link from "next/link";
import { app_name, app_paths, github_repo } from "@/lib/constants";
import { Text } from "../ui/text";

const Footer = () => (
  <footer className="pb-6 flex items-center justify-between gap-4">
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
