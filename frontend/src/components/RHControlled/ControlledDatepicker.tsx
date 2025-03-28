import { DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";

export default function ControlledDatepicker({
  name,
  control,
  ...childProps
}: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          slotProps={{ textField: { size: "small" } }}
          {...childProps}
        />
      )}
    />
  );
}
