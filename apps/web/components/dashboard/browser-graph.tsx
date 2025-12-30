import { useEffect, useState } from "react";
import { projectAPI } from "@/lib/api";
import { TimePeriod } from "./time-period-select";
import { processErrorResponse } from "@/lib/utils";
import VerticalBarGraph, { PathRow } from "../graphs/vertical-bar-graph";

interface BrowserGraphProps {
  appId: string;
  period: TimePeriod;
}

const BrowserGraph = (props: BrowserGraphProps) => {
  const { appId, period } = props;

  const [browsers, setBrowsers] = useState<PathRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBrowserData = async () => {
    if (!appId) return;
    try {
      setLoading(true);
      const response = await projectAPI.getBrowser(appId, period);
      const browsersData =
        response?.data?.browsers?.map(
          (item: { browser: string; count: number }) => ({
            label: item.browser,
            count: item.count,
          })
        ) || [];

      setBrowsers(browsersData);
    } catch (err) {
      processErrorResponse({ err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appId) {
      fetchBrowserData();
    }
  }, [appId, period]);

  const sortedBrowsers = [...browsers].sort((a, b) => b.count - a.count);

  return (
    <VerticalBarGraph
      title="Browsers"
      chartData={sortedBrowsers}
      loading={loading}
    />
  );
};

export default BrowserGraph;
