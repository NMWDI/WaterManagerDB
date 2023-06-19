//Monitoring Wells Page
import React from 'react'
import { Box, FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useAuthHeader } from 'react-auth-kit';
import { API_URL } from "../../API_config.js"

import { WellMeasurementsTable } from './WellMeasurementsTable'
import { WellObservationsPlot } from './WellObservationsPlot'
import { NewMeasurementModal } from './NewMeasurementModal'
import { CreateManualWaterLevelMeasurement, ManualWaterLevelMeasurement, ST2WaterLevelMeasurement } from '../../interfaces.js';

export default function MonitoringWellsView(){

    const authHeader = useAuthHeader()

    const [site_name, setSiteName] = useState<string>('')
    const [wellID, setWellID] = useState<number>()
    const [manualWaterLevelMeasurements, setManualWaterLevelMeasurements] = useState<ManualWaterLevelMeasurement[]>([])
    const [ST2WaterLevelMeasurements, setST2WaterLevelMeasurements] = useState<ST2WaterLevelMeasurement[]>([])
    const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] = useState<boolean>(false)

    const handleOpenNewMeasurementModal = () => setIsNewMeasurementModalOpen(true)
    const handleCloseNewMeasurementModal = () => setIsNewMeasurementModalOpen(false)

    const handleSelect = (event: SelectChangeEvent<string>) => {
        const siteName = event.target.value
        setSiteName(siteName)
        getMeasurements(siteName)
        getLoggerVals(siteName)
    }

    function getMeasurements(siteName: string) {
        
        // Site ID map, should probably come from an API at some point
        let site_ids: any = {
            'Poe Corn':1,
            'TransWestern':2,
            'Berrendo-Smith':3,
            'LFD':4,
            'OrchardPark':5,
            'Greenfield':6,
            'Bartlett':7,
            'Cottonwood':8,
            'Zumwalt':9,
            'Artesia':10
        }
        setWellID(site_ids[siteName])

        // Get well measurements for site and set
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )
        fetch(
            `${API_URL}/waterlevels?well_id=${site_ids[siteName]}`,
            { headers: auth_headers }
        )
            .then(r => r.json())
            .then((data: ManualWaterLevelMeasurement[]) => setManualWaterLevelMeasurements(data))
    }

    function getLoggerVals(siteName: string){
        //Get logger values from ST2 endpoint

        //Map site ids to sensorthings datastreams
        let datastreams: any = {
            'Poe Corn':14474,
            'Artesia':14475,
            'TransWestern':14469,
            'Cottonwood':14470,
            'LFD':14472,
            'Greenfield':14477,
            'Berrendo-Smith':14471,
            'Orchard Park':14476,
            'Bartlett':14473,
            'Zumwalt':14468,
        }

        let endpoint = `https://st2.newmexicowaterdata.org/FROST-Server/v1.1/Datastreams(${datastreams[siteName]})/Observations`
        let query_str = '?$filter=year(phenomenonTime)%20gt%202021&$orderby=phenomenonTime%20asc'

        //Get data
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        fetch(
            endpoint+query_str,
            { headers: auth_headers }
        )
            .then(r => r.json()).then(r => r.value)
            .then((data: ST2WaterLevelMeasurement[]) => setST2WaterLevelMeasurements(data))
    }

    function handleSubmitNewMeasurement(measurementData: CreateManualWaterLevelMeasurement) {

        // Set well_id based on current selection
        measurementData.well_id = wellID as number

        const headers = {'Authorization': authHeader(), 'Content-Type': 'application/json'}
        fetch(
            `${API_URL}/waterlevel`,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(measurementData)
            }
        )
        .then(r => r.json()).then((rspjson: ManualWaterLevelMeasurement) => {

            // Quick success check, should ideally have the backend return a success msg
            if(rspjson.id != undefined){
                handleCloseNewMeasurementModal()
                const newWaterLevelEntry = {
                    id: rspjson.id,
                    well_id: rspjson.well_id,
                    timestamp: rspjson.timestamp,
                    value: rspjson.value,
                    technician: "..." // This is not sent back in the server response
                }
                setManualWaterLevelMeasurements([...manualWaterLevelMeasurements, newWaterLevelEntry])

            }else{
                alert('There was an error adding this measurement, please try again.')
            }
        })
    }

    return(
        <Box>
            <FormControl sx={{minWidth: '100px'}}>
                <InputLabel id="plot-select-label">Site</InputLabel>
                <Select
                    labelId="plot-select-label"
                    id="plot-select"
                    value={site_name}
                    onChange={handleSelect}
                    label="Site"
                >
                    <MenuItem value={'Poe Corn'}>Poe Corn</MenuItem>
                    <MenuItem value={'TransWestern'}>TransWestern</MenuItem>
                    <MenuItem value={'Berrendo-Smith'}>Berredo-Smith</MenuItem>
                    <MenuItem value={'LFD'}>LFD</MenuItem>
                    <MenuItem value={'OrchardPark'}>OrchardPark</MenuItem>
                    <MenuItem value={'Greenfield'}>Greenfield</MenuItem>
                    <MenuItem value={'Bartlett'}>Bartlett</MenuItem>
                    <MenuItem value={'Cottonwood'}>Cottonwood</MenuItem>
                    <MenuItem value={'Zumwalt'}>Zumwalt</MenuItem>
                    <MenuItem value={'Artesia'}>Artesia</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ mt: '10px', display: 'flex' }}>
                <WellMeasurementsTable rows={manualWaterLevelMeasurements} isWellSelected={wellID != undefined ? true : false} onOpenModal={handleOpenNewMeasurementModal} />

                <WellObservationsPlot
                    manual_dates={manualWaterLevelMeasurements.map(measurement => measurement.timestamp)}
                    manual_vals={manualWaterLevelMeasurements.map(measurement => measurement.value)}
                    logger_dates={ST2WaterLevelMeasurements.map(measurement => measurement.resultTime)}
                    logger_vals={ST2WaterLevelMeasurements.map(measurement => measurement.result)} />

            </Box>

            <NewMeasurementModal
                isNewMeasurementModalOpen={isNewMeasurementModalOpen}
                handleCloseNewMeasurementModal={handleCloseNewMeasurementModal}
                handleSubmitNewMeasurement={handleSubmitNewMeasurement} />
        </Box>
    )

}
