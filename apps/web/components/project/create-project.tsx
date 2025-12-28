import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { projectAPI } from "@/lib/api";
import { processErrorResponse } from "@/lib/utils";
import useProjectStore from "@/store/project-store";

const CreateProject = () => {
  const allProjects = useProjectStore((state) => state.projects);
  const setAllProjects = useProjectStore((state) => state.setProjects);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const website = formData.get("domain") as string;

    setLoading(true);
    try {
      const response = await projectAPI.create(name, website);
      const newProject = response?.data?.project;

      if (newProject) {
        setAllProjects([newProject, ...allProjects]);
      }
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Tell us a bit about the website you want to track.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input id="name" name="name" label="Name" placeholder="My Website" />
          <div className="space-y-1">
            <Input
              id="domain"
              name="domain"
              label="Domain"
              placeholder="example.com"
            />
            <Text xxs className="text-muted-foreground leading-4">
              Please enter only the domain name, without http:// or https:// or
              www.
            </Text>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" loading={loading}>
              Create
              <ArrowRightIcon />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
