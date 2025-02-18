import { MonitoredWell } from "../interfaces";

export const getDataStreamId = (
  wells: MonitoredWell[],
  wellId: number | undefined,
): number | undefined => {
  let wellDetails = wells.find((x) => x.id == wellId);
  if (wellDetails)
    if (wellDetails.datastream_id == -999) return undefined;
    else return wellDetails.datastream_id;
  else return wellDetails;
};
