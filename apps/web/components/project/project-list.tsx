import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { Project } from "@/store/project-store";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { app_paths } from "@/lib/constants";

interface ProjectListProps {
  projects: Array<Project>;
}

const ProjectList = (props: ProjectListProps) => {
  const { projects } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>App-Id</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <Text sm medium>
                {project.name}
              </Text>
            </TableCell>
            <TableCell>
              <Text xs medium>
                {project.domain}
              </Text>
            </TableCell>
            <TableCell>
              <Text xs medium>
                {project.appId}
              </Text>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Private</Badge>
            </TableCell>
            <TableCell>
              <Button asChild variant="outline">
                <Link href={app_paths.projectDashboard(project.domain)}>
                  View <ArrowRightIcon />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectList;
