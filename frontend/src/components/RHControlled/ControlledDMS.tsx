/*

This component is a UI that allows a user to enter a latitude or longitude using 
degrees, minutes, and seconds. This version uses a "controller" from react-hook-form

*/

import React, { useEffect, useState } from 'react';
import { TextField, Container } from '@mui/material'
import { Controller } from 'react-hook-form'
import { GCSdimension } from '../../enums';

interface DMSInputProps {
    dimension_type: GCSdimension,
    value: number,
    onChange: (decimal_degrees: number) => void
}

const dms_style = {
    width: "3ch"
}

function getDMSfromDecimalDegrees(decimal_degrees: number): [number, number, number] {
    const degrees = Math.floor(decimal_degrees);
    const minutes = Math.floor((decimal_degrees - degrees) * 60);
    const seconds = Math.round((decimal_degrees - degrees - minutes/60) * 3600);
    return [degrees, minutes, seconds];
}

//Create a component that takes a label (latitude or longitude) and a callback function
//that will be called when the user enters a valid latitude or longitude.
//The 'value' prop will be controlled by the parent component.
function DMSInput({ dimension_type, value, onChange }: DMSInputProps) {
    const [degrees, setDegrees] = useState<number>(getDMSfromDecimalDegrees(value)[0]);
    const [minutes, setMinutes] = useState<number>(getDMSfromDecimalDegrees(value)[1]);
    const [seconds, setSeconds] = useState<number>(getDMSfromDecimalDegrees(value)[2]);
    const [decimal_degrees, setDecimalDegrees] = useState<number>(value);

    if(dimension_type === GCSdimension.Latitude) {
        var dms_label = "Latitude (N)";
    } else {
        var dms_label = "Longitude (W)";
    }

    function calculateDecimalDegrees(d: number ,m: number, s: number) {
        return d + m/60 + s/3600;
    }
    
    useEffect(() => {
        setDecimalDegrees(calculateDecimalDegrees(degrees, minutes, seconds));
        onChange(decimal_degrees);
    }, [degrees, minutes, seconds])

    return (
        <Container>
            {dms_label}:
            <TextField sx={dms_style} value={ degrees } onChange={ (e: any) => setDegrees(Number(e.target.value)) } type="number"/>&deg;
            <TextField sx={dms_style} value={ minutes } onChange={ (e: any) => setMinutes(Number(e.target.value)) } type="number"/>&prime;
            <TextField sx={dms_style} value={ seconds } onChange={ (e: any) => setSeconds(Number(e.target.value)) } type="number"/>&Prime;&Prime;
        </Container>
        
    )}

export default function ControlledDMS({ dimension, control, name }: any) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <DMSInput dimension_type={dimension} {...field} />
            )}
        />
    )
}