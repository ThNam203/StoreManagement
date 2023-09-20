import { useState, useMemo, useCallback, useEffect } from "react";
import { fetchChannels, fetchEpg } from ".";
import { useEpg } from "planby";

// Import theme
import { theme } from "./theme";

export function useApp() {
  const [channels, setChannels] = useState([]);
  const [epg, setEpg] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const channelsData = useMemo(() => channels, [channels]);
  const epgData = useMemo(() => epg, [epg]);

  const { getEpgProps, getLayoutProps } = useEpg({
    channels: channelsData,
    epg: epgData,
    dayWidth: 3600,
    sidebarWidth: 100,
    itemHeight: 80,
    isSidebar: false,
    isTimeline: true,
    isLine: true,
    startDate: "2022-10-18T00:00:00",
    endDate: "2022-10-18T24:00:00",
    isBaseTimeFormat: true,
    theme
  });

  const handleFetchResources = useCallback(async () => {
    setIsLoading(true);
    const epg = await fetchEpg();
    const channels = await fetchChannels();
    setEpg(epg);
    setChannels(channels);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    handleFetchResources();
  }, [handleFetchResources]);

  return { getEpgProps, getLayoutProps, isLoading };
}
