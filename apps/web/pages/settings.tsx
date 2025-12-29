import PageHeader from "@/components/layout/page-header";
import UserSettings from "@/components/settings/user-settings";

const Settings = () => {
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" />

      <div className="px-4 sm:px-0">
        <UserSettings />
      </div>
    </div>
  );
};

export default Settings;
