import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  EllipsisIcon,
  LockOpenIcon,
  Trash2Icon,
} from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import useProjectStore, { Project } from "@/store/project-store";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { app_paths } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { projectAPI } from "@/lib/api";
import { processErrorResponse } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "../ui/sonner";

interface ProjectListProps {
  projects: Array<Project>;
}

interface MoreProjectOptionsProps {
  project: Project;
}

type OptionAction = (typeof option_actions)[keyof typeof option_actions];

const option_actions = {
  make_public: "make_public",
  copy_app_id: "copy_app_id",
  copy_dashboard_link: "copy_dashboard_link",
  delete_project: "delete_project",
} as const;

const options = [
  {
    icon: <LockOpenIcon />,
    label: "Make Public",
    action: option_actions.make_public,
  },
  {
    icon: <CopyIcon />,
    label: "Copy App ID",
    action: option_actions.copy_app_id,
  },
  {
    icon: <CopyIcon />,
    label: "Copy Dashboard Link",
    action: option_actions.copy_dashboard_link,
  },
  {
    icon: <Trash2Icon />,
    label: "Delete Project",
    action: option_actions.delete_project,
  },
];

const MoreProjectOptions = (props: MoreProjectOptionsProps) => {
  const { project } = props;

  const { onCopy } = useCopyToClipboard();
  const projects = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);

  const deleteProject = async (projectId: string) => {
    if (!projectId) return;

    try {
      await projectAPI.delete(projectId);

      const updatedProjects = projects.filter(
        (project) => project.id !== projectId
      );
      setProjects(updatedProjects);
      setDeleteConfirmationOpen(false);

      toast.success({
        title: "Project deleted successfully",
      });
    } catch (err) {
      processErrorResponse({ err });
    }
  };

  const onOptionSelect = (action: OptionAction) => {
    switch (action) {
      case option_actions.copy_app_id: {
        onCopy(project.appId, {
          showToast: true,
          successMessage: "App ID copied to clipboard!",
        });
        break;
      }

      case option_actions.copy_dashboard_link: {
        const dashboardLink = `${app_paths.fe_url}${app_paths.projectDashboard(
          project.appId
        )}`;
        onCopy(dashboardLink, {
          showToast: true,
          successMessage: "Dashboard link copied to clipboard!",
        });
        break;
      }

      case option_actions.delete_project: {
        setDeleteConfirmationOpen(true);
        break;
      }

      // @TODO: delete and make public functionality for projects

      default:
        break;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.action}
              onClick={() => onOptionSelect(option.action)}
              variant={
                option.action === option_actions.delete_project
                  ? "destructive"
                  : undefined
              }
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={deleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteProject(project.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ListItem = (props: { project: Project }) => {
  const { project } = props;

  const { isCopied, onCopy } = useCopyToClipboard();

  return (
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
      <TableCell className="flex items-center gap-x-2">
        <Text xs medium>
          {project.appId}
        </Text>
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => onCopy(project.appId)}
        >
          {isCopied ? (
            <CheckIcon size={14} strokeWidth={2.5} className="text-primary" />
          ) : (
            <CopyIcon size={14} strokeWidth={2.5} />
          )}
        </Button>
      </TableCell>
      <TableCell>
        <Badge variant="outline">Private</Badge>
      </TableCell>
      <TableCell className="flex items-center justify-between gap-x-4">
        <Button asChild variant="outline">
          <Link href={app_paths.projectDashboard(project.appId)}>
            View <ArrowRightIcon />
          </Link>
        </Button>
        <MoreProjectOptions project={project} />
      </TableCell>
    </TableRow>
  );
};

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
          <ListItem key={project.id} project={project} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectList;
