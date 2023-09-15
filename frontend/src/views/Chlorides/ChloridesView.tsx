import React from 'react'
import { Box, FormControl, Select, MenuItem, InputLabel, Card, CardContent, CardHeader } from "@mui/material";
import { useState } from "react";

import { ChloridesPlot } from './ChloridesPlot'
import { ChloridesTable } from './ChloridesTable'
import { NewMeasurementModal } from '../../components/NewMeasurementModal'
import { NewWellMeasurement } from '../../interfaces.js';
import { useCreateChlorideMeasurement, useCreateWaterLevel, useGetChloridesLevels } from '../../service/ApiServiceNew';

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
    {id: 9, name: 'Bartlett', datastream_id: 24951},
    {id: 10, name: 'Zumwalt', datastream_id: 14468},
]

export default function ChloridesView(){
    const [wellID, setWellID] = useState<number>()
    const manualChlorideLevelMeasurements = useGetChloridesLevels({well_id: wellID})
    const createChlorideMeasurement = useCreateChlorideMeasurement()

    const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] = useState<boolean>(false)
    const handleOpenNewMeasurementModal = () => setIsNewMeasurementModalOpen(true)
    const handleCloseNewMeasurementModal = () => setIsNewMeasurementModalOpen(false)

    function handleSubmitNewMeasurement(measurementData: NewWellMeasurement) {
        if (wellID) measurementData.well_id = wellID
        createChlorideMeasurement.mutate(measurementData)
        handleCloseNewMeasurementModal()
    }

    return(
        <Box>
        <h2 style={{color: "#292929", fontWeight: '500'}}>Chlorides</h2>
        <Card sx={{width: '95%', height: '75%'}}>
            <CardContent>
                <FormControl sx={{minWidth: '100px'}}>
                    <InputLabel id="plot-select-label">Site</InputLabel>
                    <Select
                        labelId="plot-select-label"
                        id="plot-select"
                        value={wellID ?? ''}
                        onChange={(event: any) => setWellID(event.target.value)}
                        label="Site"
                    >
                        <MenuItem value={0} disabled sx={{display: 'none'}}>Select a Well</MenuItem>
                        {monitoredWells.map((well: MonitoredWell) => <MenuItem value={well.id} key={well.id}>{well.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box sx={{ mt: '10px', display: 'flex' }}>
                    <ChloridesTable rows={manualChlorideLevelMeasurements.data ?? []} isWellSelected={wellID != undefined ? true : false} onOpenModal={handleOpenNewMeasurementModal} />

                    <ChloridesPlot
                        isLoading={manualChlorideLevelMeasurements.isLoading}
                        manual_dates={manualChlorideLevelMeasurements.data?.map(measurement => measurement.timestamp) ?? []}
                        manual_vals={manualChlorideLevelMeasurements.data?.map(measurement => measurement.value) ?? []}
                    />

                </Box>

                <NewMeasurementModal
                    isNewMeasurementModalOpen={isNewMeasurementModalOpen}
                    handleCloseNewMeasurementModal={handleCloseNewMeasurementModal}
                    handleSubmitNewMeasurement={handleSubmitNewMeasurement} />
                </CardContent>
            </Card>
        </Box>
    )
}
