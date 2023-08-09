import React from 'react'
import { Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useState } from "react";

import { WellMeasurementsTable } from './WellMeasurementsTable'
import { WellObservationsPlot } from './WellObservationsPlot'
import { NewMeasurementModal } from './NewMeasurementModal'
import { NewWaterLevelMeasurement } from '../../interfaces.js';
import { useCreateWaterLevel, useGetST2WaterLevels, useGetWaterLevels } from '../../service/ApiServiceNew';

interface MonitoredWell {
    id: number
    name: string
    datastream_id: number
}

const monitoredWells: MonitoredWell[] = [
    {id: 1, name: 'Poe Corn', datastream_id: 14474},
    {id: 2, name: 'Artesia', datastream_id: 14475},
    {id: 3, name: 'TransWestern', datastream_id: 14469},
    {id: 4, name: 'Cottonwood', datastream_id: 14470},
    {id: 5, name: 'LFD', datastream_id: 14472},
    {id: 6, name: 'Greenfield', datastream_id: 14477},
    {id: 7, name: 'Berrendo-Smith', datastream_id: 14471},
    {id: 8, name: 'Orchard Park', datastream_id: 14476},
    {id: 9, name: 'Bartlett', datastream_id: 14473},
    {id: 10, name: 'Zumwalt', datastream_id: 14468},
]

export default function MonitoringWellsView(){
    const [wellID, setWellID] = useState<number>()
    const manualWaterLevelMeasurements = useGetWaterLevels({well_id: wellID})
    const st2WaterLevelMeasurements = useGetST2WaterLevels(wellID ? monitoredWells[wellID - 1].datastream_id : undefined)
    const createWaterLevel = useCreateWaterLevel()

    const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] = useState<boolean>(false)
    const handleOpenNewMeasurementModal = () => setIsNewMeasurementModalOpen(true)
    const handleCloseNewMeasurementModal = () => setIsNewMeasurementModalOpen(false)

    function handleSubmitNewMeasurement(measurementData: NewWaterLevelMeasurement) {
        if (wellID) measurementData.well_id = wellID
        createWaterLevel.mutate(measurementData)
        handleCloseNewMeasurementModal()
    }

    return(
        <Box>
            <FormControl sx={{minWidth: '100px'}}>
                <InputLabel id="plot-select-label">Site</InputLabel>
                <Select
                    labelId="plot-select-label"
                    id="plot-select"
                    value={wellID}
                    onChange={(event: any) => setWellID(event.target.value)}
                    label="Site"
                >
                    <MenuItem value={0} disabled sx={{display: 'none'}}>Select a Well</MenuItem>
                    {monitoredWells.map((well: MonitoredWell) => <MenuItem value={well.id} key={well.id}>{well.name}</MenuItem>)}
                </Select>
            </FormControl>
            <Box sx={{ mt: '10px', display: 'flex' }}>
                <WellMeasurementsTable rows={manualWaterLevelMeasurements.data ?? []} isWellSelected={wellID != undefined ? true : false} onOpenModal={handleOpenNewMeasurementModal} />

                <WellObservationsPlot
                    isLoading={manualWaterLevelMeasurements.isLoading || st2WaterLevelMeasurements.isLoading}
                    manual_dates={manualWaterLevelMeasurements.data?.map(measurement => measurement.timestamp) ?? []}
                    manual_vals={manualWaterLevelMeasurements.data?.map(measurement => measurement.value) ?? []}
                    logger_dates={st2WaterLevelMeasurements.data?.map(measurement => measurement.resultTime) ?? []}
                    logger_vals={st2WaterLevelMeasurements.data?.map(measurement => measurement.result) ?? []} />

            </Box>

            <NewMeasurementModal
                isNewMeasurementModalOpen={isNewMeasurementModalOpen}
                handleCloseNewMeasurementModal={handleCloseNewMeasurementModal}
                handleSubmitNewMeasurement={handleSubmitNewMeasurement} />
        </Box>
    )
}
