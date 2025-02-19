import React from "react";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

export function ControlledSelect({
  control,
  name,
  getOptionDisabled = () => false,
  ...childProps
}: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          size="small"
          fullWidth
          error={childProps.error != undefined}
          sx={childProps.sx}
        >
          <InputLabel>{childProps.label}</InputLabel>
          <Select
            {...field}
            {...childProps}
            sx={undefined}
            value={
              childProps.value ? childProps.value : (field.value?.id ?? "")
            }
            onChange={(event: any) => {
              field.onChange(
                childProps.options.find(
                  (x: any) => x?.id == event.target.value,
                ),
              );
            }}
            defaultValue={""}
          >
            {childProps.options.map((option: any) => (
              <MenuItem
                value={option.id}
                key={option.id}
                disabled={getOptionDisabled?.(option) ?? false}
              >
                {childProps.getOptionLabel(option)}
              </MenuItem>
            ))}
            {childProps.value == "Loading..." && (
              <MenuItem value="Loading...">Loading...</MenuItem>
            )}
          </Select>
          {childProps.error && (
            <FormHelperText key={childProps.error}>
              {childProps.error}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export function ControlledSelectNonObject({
  control,
  name,
  ...childProps
}: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          size="small"
          fullWidth
          error={childProps.error != undefined}
          sx={childProps.sx}
        >
          <InputLabel>{childProps.label}</InputLabel>
          <Select
            {...field}
            {...childProps}
            sx={undefined}
            value={field.value ?? ""}
            defaultValue={""}
          >
            {childProps.options.map((option: any) => (
              <MenuItem value={option} key={option}>
                {childProps.getOptionLabel(option)}
              </MenuItem>
            ))}
            {childProps.value == "Loading..." && (
              <MenuItem value="Loading...">Loading...</MenuItem>
            )}
          </Select>
          {childProps.error && (
            <FormHelperText key={childProps.error}>
              {childProps.error}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
