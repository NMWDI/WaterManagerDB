/*
  This component is a UI that allows a user to enter a latitude or longitude using 
  degrees, minutes, and seconds.
*/

import { useEffect, useState } from "react";

// Create a component that takes a label (latitude or longitude) and a callback function
// That will be called when the user enters a valid latitude or longitude.
export default function DMSentry({ dms_label, onChange }: any) {
  const [degrees, setDegrees] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [decimal_degrees, setDecimalDegrees] = useState<Number>(0);

  const calculateDecimalDegrees = (d: number, m: number, s: number) =>
    d + m / 60 + s / 3600;

  useEffect(() => {
    setDecimalDegrees(calculateDecimalDegrees(degrees, minutes, seconds));
    onChange(decimal_degrees);
  }, [degrees, minutes, seconds]);

  return (
    <div>
      {dms_label}:
      <input
        value={degrees}
        onChange={(e: any) => setDegrees(Number(e.target.value))}
        type="number"
      />
      &deg;
      <input
        value={minutes}
        onChange={(e: any) => setMinutes(Number(e.target.value))}
        type="number"
      />
      &prime;
      <input
        value={seconds}
        onChange={(e: any) => setSeconds(Number(e.target.value))}
        type="number"
      />
      &Prime;&Prime;
    </div>
  );
}
