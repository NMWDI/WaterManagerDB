/*

This component is a UI that allows a user to enter a latitude or longitude using 
degrees, minutes, and seconds. This version uses a "controller" from react-hook-form

In this version I try and use a pattern mask to display Degrees, minutes, and seconds

*/

import React, { useEffect, useState, forwardRef } from 'react';
import { TextField, Container } from '@mui/material'
import { Controller } from 'react-hook-form'
import { GCSdimension } from '../../enums';
import { PatternFormat, PatternFormatProps } from 'react-number-format';
import { on } from 'events';


interface DMSInputProps {
    dimension_type: GCSdimension,
    value: number,
    onChange: (decimal_degrees: number) => void
}

//This is from the MUI example
interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void; 
    name: string;
}

const DMSFormatCustom = React.forwardRef<PatternFormatProps, CustomProps>(
    function PatternFormatCustom(props, ref) {
      const { onChange, ...other } = props;
  
      return (
        <PatternFormat
          {...other}
          getInputRef={ref}
          onValueChange={(values) => {
            onChange({
              target: {
                name: props.name,
                value: values.value,
              },
            });
          }}
          format="###&deg; ##' ##.###&quot;"
        />
      );
    },
  );

//A function to convert decimal degrees to a DMS string which is a string of 10 numbers XXXXXXXXXX
//The numbers can be mapped to XXX degrees, XX minutes, and XX.XXX seconds in the UI 
function getDMSstringFromDecimalDegrees(decimal_degrees: number): string {
    const degrees = Math.floor(decimal_degrees);
    const minutes = Math.floor((decimal_degrees - degrees) * 60);
    const seconds_string = ((decimal_degrees - degrees - minutes/60) * 3600).toFixed(3);
    return degrees.toString().padStart(3, '0') + minutes.toString().padStart(2, '0') + seconds_string.padStart(2, '0');
}

//Create a component that takes a label (latitude or longitude) and a callback function
//that will be called when the user enters a valid latitude or longitude.
//The 'value' prop will be controlled by the parent component.
function DMSInput({ dimension_type, value, onChange }: DMSInputProps) {
    const [dms_string, setDMSString] = useState<string>(value ? getDMSstringFromDecimalDegrees(value): "0000000000")
    const [decimal_degrees, setDecimalDegrees] = useState<number>(value);

    if(dimension_type === GCSdimension.Latitude) {
        var dms_label = "Latitude (N)";
    } else {
        var dms_label = "Longitude (W)";
    }

    function calculateDecimalDegreesFromDMS(dms_string: string): number {
        const d = parseInt(dms_string.substring(0, 3));
        const m = parseInt(dms_string.substring(3, 5));
        const s = parseFloat(dms_string.substring(5, 11));
        return d + m/60 + s/3600;
    }
    
    function handleUpdate(event: React.ChangeEvent<HTMLInputElement>){
        let newDMSString = event.target.value;
        console.log("newDMSString: " + newDMSString)
        setDMSString(newDMSString)
        setDecimalDegrees(calculateDecimalDegreesFromDMS(newDMSString))
        onChange(decimal_degrees)
    }
    
    return (
        <TextField
            label={dms_label}
            value={dms_string}
            onChange={handleUpdate}
            InputProps={{
                inputComponent: DMSFormatCustom as any,
            }}
        />
    )
}

export default function ControlledDMS({ dimension, control, name }: any) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <DMSInput {...field} dimension_type={dimension}/>
            )}
        />
    )
}