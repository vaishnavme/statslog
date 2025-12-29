import { Text } from "../ui/text";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const PageHeader = (props: PageHeaderProps) => {
  const { title, children } = props;

  return (
    <div className="flex items-center justify-between px-2 py-4 sm:px-0">
      <Text sm medium className="font-mono uppercase tracking-wider">
        {title}
      </Text>
      {children}
    </div>
  );
};

export default PageHeader;
