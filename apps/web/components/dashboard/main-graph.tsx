import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Text } from "../ui/text";
import { processErrorResponse } from "@/lib/utils";
import { projectAPI } from "@/lib/api";
import { TimePeriod } from "./time-period-select";

const chartConfig = {
  unique_visitor: {
    label: "Unique Visitors",
    color: "var(--chart-1)",
  },
  total_visitor: {
    label: "Total Visits",
    color: "var(--chart-2)",
  },
  page_views: {
    label: "Page Views",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface MainGraphProps {
  appId: string;
  period: TimePeriod;
}

interface Stats {
  total_visitor: {
    count: number;
    change: number;
  };
  unique_visitor: {
    count: number;
    change: number;
  };
  page_views: {
    count: number;
    change: number;
  };
}

type GraphPoint = {
  date: string;
  unique_visitor?: number;
  total_visitor?: number;
  page_views?: number;
};

const normalizeGraphData = (graph: any): GraphPoint[] => {
  const map = new Map<string, GraphPoint>();

  const add = (
    list: { date?: string; count: number }[],
    key: keyof Omit<GraphPoint, "date">
  ) => {
    list.forEach(({ date, count }: { date?: string; count: number }) => {
      if (typeof date === "string") {
        const d = date.split("T")[0]; // keep YYYY-MM-DD
        if (!map.has(d)) map.set(d, { date: d });
        map.get(d)![key] = count;
      }
    });
  };

  add(graph.uniqueVisitors || [], "unique_visitor");
  add(graph.totalVisits || [], "total_visitor");
  add(graph.pageViews || [], "page_views");

  return Array.from(map.values()).sort(
    (a, b) => +new Date(a.date) - +new Date(b.date)
  );
};

const MainGraph = (props: MainGraphProps) => {
  const { appId, period } = props;

  const [stats, setStats] = useState<Stats | null>(null);
  const [graph, setGraph] = useState<GraphPoint[] | null>(null);

  const fetchGraphData = async () => {
    try {
      const response = await projectAPI.getStats(appId, period);
      const normalize = normalizeGraphData(response?.data?.graph || {});

      setStats(response?.data?.stats);
      setGraph(normalize);
    } catch (err) {
      processErrorResponse({ err });
    }
  };

  useEffect(() => {
    if (appId) {
      fetchGraphData();
    }
  }, [appId, period]);

  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("unique_visitor");

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b border-dashed p-0! sm:flex-row">
        <div className="flex items-center">
          {["unique_visitor", "total_visitor", "page_views"].map((key) => {
            const chart = key as keyof typeof chartConfig;

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                onClick={() => setActiveChart(chart)}
                className="data-[active=true]:bg-muted px-6 py-2 hover:cursor-pointer border-r border-dashed"
              >
                <Text
                  xs
                  medium
                  className="text-muted-foreground font-mono uppercase tracking-wide"
                >
                  {chartConfig[chart].label}
                </Text>
                <Text semibold className="font-mono uppercase tracking-wide">
                  {stats ? stats[chart].count.toLocaleString() : "0"}
                </Text>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <BarChart
            accessibilityLayer
            data={graph ?? []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-36"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              maxBarSize={20}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MainGraph;
