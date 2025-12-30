import { useEffect, useState } from "react";
import { type ChartConfig } from "@/components/ui/chart";
import { projectAPI } from "@/lib/api";
import { TimePeriod } from "./time-period-select";
import { processErrorResponse } from "@/lib/utils";
import VerticalBarGraph, { PathRow } from "../graphs/vertical-bar-graph";

interface PageViewGraphProps {
  appId: string;
  period: TimePeriod;
}

const chartConfig: ChartConfig = {
  percent: {
    label: "Visitors",
    color: "var(--orange-100)",
  },
};

const PageViewGraph = ({ appId, period }: PageViewGraphProps) => {
  const [paths, setPaths] = useState<PathRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!appId) return;

    const fetchPaths = async () => {
      try {
        setLoading(true);
        const response = await projectAPI.getPaths(appId, period);
        const pathList = response?.data?.paths?.map(
          (path: { path: string; count: number }) => ({
            label: path.path,
            count: path.count,
          })
        );
        setPaths(pathList || []);
      } catch (err) {
        processErrorResponse({ err });
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, [appId, period]);

  return (
    <VerticalBarGraph
      title="Top pages"
      chartConfig={chartConfig}
      chartData={paths}
      loading={loading}
    />
  );
};

export default PageViewGraph;
