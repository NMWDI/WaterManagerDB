import React from 'react'
import { Box, FormControl, Select, MenuItem, InputLabel, Card, CardContent, CardHeader } from "@mui/material";
import { useState } from "react";
import { useAuthUser } from 'react-auth-kit'

import { MonitoringWellsTable } from './MonitoringWellsTable';
import { MonitoringWellsPlot } from './MonitoringWellsPlot';
import { NewMeasurementModal, UpdateMeasurementModal } from '../../components/WellMeasurementModals'
import { NewWellMeasurement, PatchWellMeasurement, SecurityScope } from '../../interfaces';
import { useCreateWaterLevel, useGetST2WaterLevels, useGetWaterLevels, useUpdateWaterLevel, useDeleteWaterLevel } from '../../service/ApiServiceNew';
import dayjs from 'dayjs'

interface MonitoredWell {
    id: number
    name: string
    datastream_id: number
}

const monitoredWells: MonitoredWell[] = [
    {id: 1515, name: 'Poe Corn', datastream_id: 25089},
    {id: 1516, name: 'TransWestern', datastream_id: 25083},
    {id: 1517, name: 'Berrendo-Smith', datastream_id: 25086},
    {id: 1518, name: 'LFD', datastream_id: 25087},
    {id: 1519, name: 'Orchard Park', datastream_id: 25091},
    {id: 1520, name: 'Greenfield', datastream_id: 25092},
    {id: 1521, name: 'Bartlett', datastream_id: 25084},
    {id: 1522, name: 'Cottonwood', datastream_id: 25085},
    {id: 1523, name: 'Zumwalt', datastream_id: 25082},
    {id: 1524, name: 'Artesia A', datastream_id: 25090},
    {id: 2596, name: 'Kelly Kids', datastream_id: -999},
    {id: 2597, name: 'Marley/Whitney Far West Well', datastream_id: -999},
    {id: 2598, name: 'Marley/Whitney East Well', datastream_id: -999},
    {id: 2599, name: 'S.P. Johnson', datastream_id: -999},
    {id: 2600, name: 'Hope', datastream_id: -999},
    {id: 2601, name: 'J.P. White', datastream_id: -999},
    {id: 2602, name: 'Mesa Park', datastream_id: -999},
]

function getDatastreamID(input_wellID: number | undefined): number | undefined {
    let welldetails = monitoredWells.find(x => x.id == input_wellID)
    if (welldetails)
        if (welldetails.datastream_id == -999)
            return undefined
        else
            return welldetails.datastream_id
    else
        return welldetails
}

export default function MonitoringWellsView(){
    const [wellID, setWellID] = useState<number>()
    const manualWaterLevelMeasurements = useGetWaterLevels({well_id: wellID})
    const st2WaterLevelMeasurements = useGetST2WaterLevels(getDatastreamID(wellID))
    const createWaterLevel = useCreateWaterLevel()

    function afterUpdateWaterLevel() { manualWaterLevelMeasurements.refetch() }

    const updateWaterLevel = useUpdateWaterLevel(afterUpdateWaterLevel)
    const deleteWaterLevel = useDeleteWaterLevel()
    const [selectedMeasurement, setSelectedMeasurement] = useState<PatchWellMeasurement>(
        {levelmeasurement_id: 0, timestamp: dayjs(), value: 0, submitting_user_id: 0}
    )

    const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] = useState<boolean>(false)
    const [isUpdateMeasurementModalOpen, setIsUpdateMeasurementModalOpen] = useState<boolean>(false)
    const handleOpenNewMeasurementModal = () => setIsNewMeasurementModalOpen(true)
    const handleCloseNewMeasurementModal = () => setIsNewMeasurementModalOpen(false)
    const handleCloseUpdateMeasurementModal = () => setIsUpdateMeasurementModalOpen(false)

    //Limit update and delete access to admin users
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    function handleSubmitNewMeasurement(measurementData: NewWellMeasurement) {
        if (wellID) measurementData.well_id = wellID
        createWaterLevel.mutate(measurementData)
        handleCloseNewMeasurementModal()
    }

    function handleMeasurementSelect(rowdata: any) {

        if (!hasAdminScope) {
            return
        }
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
    }

    function handleDeleteMeasurement() {
        setIsUpdateMeasurementModalOpen(false)

        //Confirm deletion before proceeding
        if (window.confirm("Are you sure you want to delete this measurement?")){
            deleteWaterLevel.mutate(selectedMeasurement.levelmeasurement_id)
        }
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
                    onDeleteMeasurement={handleDeleteMeasurement} />

            </CardContent>
            </Card>
        </Box>
    )
}
