// import { MonitoredWell } from "../interfaces";

const monitoredWellDataStreamIds: Record<number, number> = {
  1515: 25089,
  1516: 25083,
  1517: 25086,
  1518: 25087,
  1519: 25091,
  1520: 25092,
  1521: 25084,
  1522: 25085,
  1523: 25082,
  1524: 25090,
  2596: -999,
  2597: -999,
  2598: -999,
  2599: -999,
  2600: -999,
  2601: -999,
  2602: -999,
};

export const getDataStreamId = (wellId: number): number | undefined => {
  const datastream_id = monitoredWellDataStreamIds[wellId];
  return datastream_id === -999 ? undefined : datastream_id;
};

// export const getDataStreamId = (
//   wells: MonitoredWell[],
//   wellId: number | undefined,
// ): number | undefined => {
//   const wellDetails = wells.find((x) => x.id === wellId);
//   if (!wellDetails) return undefined;
//   if (wellDetails.datastream_id === -999) return undefined;
//   return wellDetails.datastream_id;
// };
