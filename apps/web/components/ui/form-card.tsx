import { Text } from "./text";

interface FormCardProps {
  title: string;
  children?: React.ReactNode;
}

const FormCard = (props: FormCardProps) => {
  const { title, children } = props;

  return (
    <div className="border border-dashed rounded-lg w-full max-w-lg bg-muted/25 overflow-hidden">
      <div className="p-2 bg-background border-b border-dashed">
        <Text xs medium className="font-mono uppercase tracking-wider">
          {title}
        </Text>
      </div>

      <div className="px-4 md:px-6 py-4">{children}</div>
    </div>
  );
};

export default FormCard;
