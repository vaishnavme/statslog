import UserSettings from "@/components/settings/user-settings";
import { Text } from "@/components/ui/text";

const Settings = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 py-4 sm:px-0">
        <Text sm medium className="font-mono uppercase tracking-wider">
          Settings
        </Text>
      </div>
      <div className="px-4">
        <UserSettings />
      </div>
    </div>
  );
};

export default Settings;
