import { LoaderIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";

export type PathRow = {
  label: string;
  count: number;
};

interface VerticalBarGraphProps {
  title: string;
  loading: boolean;
  chartData: { label: string; count: number }[];
}

const VerticalBarGraph = (props: VerticalBarGraphProps) => {
  const { title, chartData, loading } = props;

  const max = Math.max(...chartData.map((d) => d.count), 1);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {loading ? <LoaderIcon className="animate-spin" size={20} /> : null}
      </CardHeader>
      <CardContent className="relative overflow-hidden">
        <div className="space-y-2">
          {chartData.map((row: PathRow, index: number) => {
            const width = (row.count / max) * 100;

            return (
              <div
                className="relative cursor-default group flex items-center justify-between gap-4 hover:bg-zinc-50 rounded-md"
                key={`${row.label}-${index + 1}`}
              >
                <Text
                  xs
                  medium
                  className="absolute pl-2 truncate text-foreground"
                >
                  {row.label}
                </Text>
                <div
                  className="bg-orange-50 group-hover:bg-orange-200 h-8 rounded-md flex items-center px-2 transition-all ease-in-out"
                  style={{ width: `${width}%` }}
                />
                <Text xs medium className="font-mono text-right pr-2">
                  {row.count.toLocaleString()}
                </Text>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerticalBarGraph;
