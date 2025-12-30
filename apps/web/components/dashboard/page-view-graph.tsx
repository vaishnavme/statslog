import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { projectAPI } from "@/lib/api";
import { TimePeriod } from "./time-period-select";
import { processErrorResponse } from "@/lib/utils";

interface PageViewGraphProps {
  appId: string;
  period: TimePeriod;
}

type PathRow = {
  path: string;
  count: number;
};

const chartConfig: ChartConfig = {
  percent: {
    label: "Visitors",
    color: "var(--orange-100)",
  },
};

const RightAlignedValue = ({ x, y, width, value }: any) => {
  return (
    <text
      x="100%"
      dx={-12}
      y={y + 12}
      textAnchor="end"
      fill="var(--foreground)"
      fontSize={12}
      fontWeight={500}
    >
      {value}
    </text>
  );
};

const PageViewGraph = ({ appId, period }: PageViewGraphProps) => {
  const [paths, setPaths] = useState<PathRow[]>([]);

  useEffect(() => {
    if (!appId) return;

    const fetchPaths = async () => {
      try {
        const res = await projectAPI.getPaths(appId, period);
        setPaths(res?.data?.paths || []);
      } catch (err) {
        processErrorResponse({ err });
      }
    };

    fetchPaths();
  }, [appId, period]);

  /** Sort + normalize for Plausible-style bars */
  const chartData = useMemo(() => {
    if (paths.length === 0) return [];

    const sorted = [...paths].sort((a, b) => b.count - a.count);
    const max = sorted[0]?.count ?? 0;
    const total = sorted.reduce((sum, p) => sum + p.count, 0);

    return sorted.map((p) => ({
      path: p.path,
      count: p.count,
      percent: (p.count / max) * 100,
      share: (p.count / total) * 100,
    }));
  }, [paths]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top pages</CardTitle>
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
              dataKey="browser"
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

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => ["Count: ", value?.toLocaleString()]}
                  labelFormatter={(label) =>
                    label?.charAt(0)?.toUpperCase() + label?.slice(1)
                  }
                />
              }
            />

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
                dataKey="path"
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

export default PageViewGraph;
