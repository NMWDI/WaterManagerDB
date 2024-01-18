/*

This component is a UI that allows a user to enter a latitude or longitude using 
degrees, minutes, and seconds.

*/

import React, { useEffect, useState } from 'react';
//import { TextField } from '@mui/material'

//Create a component that takes a label (latitude or longitude) and a callback function
//that will be called when the user enters a valid latitude or longitude.
export default function DMSentry({ dms_label, onChange }: any) {
    const [degrees, setDegrees] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [decimal_degrees, setDecimalDegrees] = useState<Number>(0);

    function calculateDecimalDegrees(d: number ,m: number, s: number) {
        return d + m/60 + s/3600;
    }
    
    useEffect(() => {
        setDecimalDegrees(calculateDecimalDegrees(degrees, minutes, seconds));
        onChange(decimal_degrees);
    }, [degrees, minutes, seconds])

    // //This function is called when the user enters a valid latitude or longitude.
    // //It calls the callback function that was passed in as a prop.
    // const handleEntry = () => {
    //     //If the user entered a valid latitude or longitude, call the callback function.
    //     if (validateEntry()) {
    //         props.onEntry(degrees, minutes, seconds);
    //     }
    // }

    // //This function validates the latitude or longitude entered by the user.
    // //It returns true if the user entered a valid latitude or longitude.
    // const validateEntry = () => {
    //     //If the user didn't enter a value for degrees, minutes, or seconds, return false.
    //     if (degrees === '' || minutes === '' || seconds === '') {
    //         return false;
    //     }

    //     //If the user entered a value for degrees, minutes, or seconds that isn't a number, return false.
    //     if (isNaN(Number(degrees)) || isNaN(Number(minutes)) || isNaN(Number(seconds))) {
    //         return false;
    //     }

    //     //If the user entered a value for degrees, minutes, or seconds that is less than 0, return false.
    //     if (Number(degrees) < 0 || Number(minutes) < 0 || Number(seconds) < 0) {
    //         return false;
    //     }

    //     //If the user entered a value for degrees that is greater than 180, return false.
    //     if (Number(degrees) > 180) {
    //         return false;
    //     }

    //     //If the user entered a value for minutes or seconds that is greater than 59, return false.
    //     if (Number(minutes) > 59 || Number(seconds) > 59) {
    //         return false;
    //     }

    //     //If the user entered a value for degrees that is greater than 90, return false.
    //     if (props.label === 'Latitude' && Number(degrees) > 90) {
    //         return false;
    //     }

    //     //If the user entered a value for degrees that is greater than 180, return false.
    //     if (props.label === 'Longitude' && Number(degrees) > 180) {
    //         return false;
    //     }

    return (
        <div>
            {dms_label}:
            <input value={ degrees } onChange={ (e: any) => setDegrees(Number(e.target.value)) } type="number"/>&deg;
            <input value={ minutes } onChange={ (e: any) => setMinutes(Number(e.target.value)) } type="number"/>&prime;
            <input value={ seconds } onChange={ (e: any) => setSeconds(Number(e.target.value)) } type="number"/>&Prime;&Prime;
        </div>
    )}