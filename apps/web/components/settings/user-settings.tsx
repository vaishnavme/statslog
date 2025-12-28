import { useState } from "react";
import useUserStore from "@/store/user-store";
import { Field, FieldControl, FieldLabel } from "../ui/field";
import { Form } from "../ui/form";
import FormCard from "../ui/form-card";
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
import { processErrorResponse } from "@/lib/utils";
import { userAPI } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { app_paths } from "@/lib/constants";

const DeleteAccount = () => {
  const router = useRouter();
  const { clearAppData } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const deleteAccount = async () => {
    setLoading(true);

    try {
      await userAPI.deleteAccount();
      clearAppData();
      router.replace(app_paths.home);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="destructive">
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? <br /> This action
            cannot be undone. All your data will be permanently removed from
            servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            loading={loading}
            variant="destructive"
            onClick={deleteAccount}
          >
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserSettings = () => {
  const user = useUserStore((state) => state.user);

  return (
    <FormCard title="User">
      <Form>
        <Field>
          <FieldLabel>Id</FieldLabel>
          <FieldControl id="id" name="id" readOnly defaultValue={user?.id} />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldControl
            id="email"
            name="email"
            readOnly
            defaultValue={user?.email}
          />
        </Field>

        <DeleteAccount />
      </Form>
    </FormCard>
  );
};

export default UserSettings;
