import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";

interface LogoutProps {
  className?: string;
}

const Logout = (props: LogoutProps) => {
  const { className } = props;

  const { loading, logoutHandler } = useAuth();

  return (
    <Button
      variant="outline"
      size="lg"
      loading={loading}
      onClick={logoutHandler}
      className={className}
    >
      <LogOutIcon />
      Logout
    </Button>
  );
};

export default Logout;
