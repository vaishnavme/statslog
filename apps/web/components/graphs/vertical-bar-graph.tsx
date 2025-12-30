import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { LoaderIcon } from "lucide-react";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const RightAlignedValue = ({ y, value }: any) => (
  <text
    x="100%"
    dx={-12}
    y={y + 12}
    textAnchor="end"
    fill="var(--foreground)"
    fontSize={12}
    fontWeight={500}
    fontFamily="var(--font-geist-mono)"
  >
    {value}
  </text>
);

export type PathRow = {
  label: string;
  count: number;
};

interface VerticalBarGraphProps {
  title: string;
  loading: boolean;
  chartConfig: ChartConfig;
  chartData: { label: string; count: number }[];
}

const VerticalBarGraph = (props: VerticalBarGraphProps) => {
  const { title, chartConfig, chartData, loading } = props;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {loading ? <LoaderIcon className="animate-spin" size={20} /> : null}
      </CardHeader>
      <CardContent className="relative">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              width={0}
              axisLine={false}
              tickFormatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />

            <XAxis dataKey="count" type="number" hide />

            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--chart-0)"
              radius={5}
              opacity={10}
              maxBarSize={30}
              activeBar={{
                fill: "var(--chart-1)",
              }}
            >
              <LabelList
                dataKey="label"
                position="insideLeft"
                offset={12}
                style={{
                  fill: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: "500",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />

              <LabelList content={<RightAlignedValue />} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VerticalBarGraph;
