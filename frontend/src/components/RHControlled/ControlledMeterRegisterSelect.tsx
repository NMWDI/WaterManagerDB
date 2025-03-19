import MeterRegisterSelect from "../MeterRegisterSelect";
import { Controller } from "react-hook-form";

export default function ControlledMeterRegisterSelect({
  control,
  name,
  ...childProps
}: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MeterRegisterSelect
          selectedRegister={field.value}
          setSelectedRegister={field.onChange}
          meterType={childProps.meterType}
          {...childProps}
        />
      )}
    />
  );
}
