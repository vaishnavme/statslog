import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { projectAPI } from "@/lib/api";
import { TimePeriod } from "./time-period-select";
import { processErrorResponse } from "@/lib/utils";

interface BrowserGraphProps {
  appId: string;
  period: TimePeriod;
}

type BrowserRow = {
  browser: string;
  count: number;
};

const chartConfig: ChartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
};

const BrowserGraph = (props: BrowserGraphProps) => {
  const { appId, period } = props;

  const [browsers, setBrowsers] = useState<BrowserRow[]>([]);

  const fetchBrowserData = async () => {
    try {
      const response = await projectAPI.getBrowser(appId, period);
      setBrowsers(response?.data?.browsers || []);
    } catch (err) {
      processErrorResponse({ err });
    }
  };

  useEffect(() => {
    if (appId) {
      fetchBrowserData();
    }
  }, [appId, period]);

  const sortedBrowsers = [...browsers].sort((a, b) => b.count - a.count);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Browser</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sortedBrowsers}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
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
                    label.charAt(0).toUpperCase() + label.slice(1)
                  }
                />
              }
            />

            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--chart-1)"
              radius={5}
              maxBarSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BrowserGraph;
