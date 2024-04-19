import React from 'react'
import { Box, FormControl, Select, MenuItem, InputLabel, Card, CardContent, CardHeader } from "@mui/material";
import { useState } from "react";

import { MonitoringWellsTable } from './MonitoringWellsTable';
import { MonitoringWellsPlot } from './MonitoringWellsPlot';
import { NewMeasurementModal, UpdateMeasurementModal } from '../../components/WellMeasurementModals'
import { NewWellMeasurement, PatchWellMeasurement } from '../../interfaces.js';
import { useCreateWaterLevel, useGetST2WaterLevels, useGetWaterLevels, useUpdateWaterLevel } from '../../service/ApiServiceNew';
import dayjs from 'dayjs'

interface MonitoredWell {
    id: number
    name: string
    datastream_id: number
}

const monitoredWells: MonitoredWell[] = [
    {id: 1515, name: 'Poe Corn', datastream_id: 14474},
    {id: 1524, name: 'Artesia', datastream_id: 14475},
    {id: 1516, name: 'TransWestern', datastream_id: 14469},
    {id: 1522, name: 'Cottonwood', datastream_id: 14470},
    {id: 1518, name: 'LFD', datastream_id: 14472},
    {id: 1520, name: 'Greenfield', datastream_id: 14477},
    {id: 1517, name: 'Berrendo-Smith', datastream_id: 14471},
    {id: 1519, name: 'Orchard Park', datastream_id: 14476},
    {id: 1521, name: 'Bartlett', datastream_id: 24951},
    {id: 1523, name: 'Zumwalt', datastream_id: 14468},
]

function getDatastreamID(input_wellID: number | undefined): number | undefined {
    let welldetails = monitoredWells.find(x => x.id == input_wellID)
    if (welldetails)
        return welldetails.datastream_id
    else
        return welldetails
}

export default function MonitoringWellsView(){
    const [wellID, setWellID] = useState<number>()
    const manualWaterLevelMeasurements = useGetWaterLevels({well_id: wellID})
    const st2WaterLevelMeasurements = useGetST2WaterLevels(getDatastreamID(wellID))
    const createWaterLevel = useCreateWaterLevel()
    const updateWaterLevel = useUpdateWaterLevel()
    const [selectedMeasurement, setSelectedMeasurement] = useState<PatchWellMeasurement>(
        {levelmeasurement_id: 0, timestamp: dayjs(), value: 0, submitting_user_id: 0}
    )

    const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] = useState<boolean>(false)
    const [isUpdateMeasurementModalOpen, setIsUpdateMeasurementModalOpen] = useState<boolean>(false)
    const handleOpenNewMeasurementModal = () => setIsNewMeasurementModalOpen(true)
    const handleCloseNewMeasurementModal = () => setIsNewMeasurementModalOpen(false)
    const handleCloseUpdateMeasurementModal = () => setIsUpdateMeasurementModalOpen(false)

    function handleSubmitNewMeasurement(measurementData: NewWellMeasurement) {
        if (wellID) measurementData.well_id = wellID
        createWaterLevel.mutate(measurementData)
        handleCloseNewMeasurementModal()
    }

    function handleMeasurementSelect(rowdata: any) {
        console.log(rowdata)
        let measure_data: PatchWellMeasurement = {
            levelmeasurement_id: rowdata.row.id,
            timestamp: dayjs.utc(rowdata.row.timestamp).tz('America/Denver'),
            value: rowdata.row.value,
            submitting_user_id: rowdata.row.submitting_user.id
        }
        setSelectedMeasurement(measure_data)
        setIsUpdateMeasurementModalOpen(true)
    }

    // Function for updating selected measurement values
    function handleUpdateMeasurement(updateValue: Partial<PatchWellMeasurement>){
        setSelectedMeasurement({...selectedMeasurement, ...updateValue})
    }

    function handleSubmitMeasurementUpdate() {
        updateWaterLevel.mutate(selectedMeasurement)
        setIsUpdateMeasurementModalOpen(false)

        //Refresh data in the table
        setWellID(wellID)
    }

    return(
        <Box>
            <h2 style={{color: "#292929", fontWeight: '500'}}>Monitored Well Values</h2>
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
                    <MonitoringWellsTable 
                        rows={manualWaterLevelMeasurements.data ?? []} 
                        isWellSelected={wellID != undefined ? true : false} 
                        onOpenModal={handleOpenNewMeasurementModal} 
                        onMeasurementSelect={handleMeasurementSelect}
                    />

                    <MonitoringWellsPlot
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

                <UpdateMeasurementModal
                    isMeasurementModalOpen={isUpdateMeasurementModalOpen}
                    handleCloseMeasurementModal={handleCloseUpdateMeasurementModal}
                    measurement={selectedMeasurement}
                    onUpdateMeasurement={handleUpdateMeasurement}
                    onSubmitUpdate={handleSubmitMeasurementUpdate}
                    onDeleteMeasurement={() => {}} />

            </CardContent>
            </Card>
        </Box>
    )
}
