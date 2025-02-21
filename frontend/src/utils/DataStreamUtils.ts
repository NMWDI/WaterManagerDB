import { MonitoredWell } from "../interfaces";

export const getDataStreamId = (
  wells: MonitoredWell[],
  wellId: number | undefined,
): number | undefined => {
  const wellDetails = wells.find((x) => x.id === wellId);
  if (!wellDetails) return undefined;
  if (wellDetails.datastream_id === -999) return undefined;
  return wellDetails.datastream_id;
};
