import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { useAuthUser } from 'react-auth-kit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import GradingIcon from '@mui/icons-material/Grading'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';

import {
    Button,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Alert
} from '@mui/material'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'

import {  SecurityScope, Meter } from '../../interfaces'
import { useCreateMeter, useGetMeter, useUpdateMeter } from '../../service/ApiServiceNew'
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import ControlledMeterTypeSelect from '../../components/RHControlled/ControlledMeterTypeSelect'
import ControlledWellSelection from '../../components/RHControlled/ControlledWellSelection'

import { formatLatLong } from '../../conversions'

interface MeterDetailsProps {
    selectedMeterID: number | undefined
    meterAddMode: boolean
}

const MeterResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    serial_number: Yup.string().required('Please enter a serial number.'),
    meter_type: Yup.mixed().required('Please select a meter type.'),
})

export default function MeterDetailsFields({selectedMeterID, meterAddMode}: MeterDetailsProps) {
    const meterDetails = useGetMeter({meter_id: selectedMeterID})
    const navigate = useNavigate()
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')
    const [isInitialLoad, setIsInitialLoad] = useState(true) //Use to disable fields on initial load

    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<Meter>({
        resolver: yupResolver(MeterResolverSchema)
    })

    function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Meter!', {variant: 'success'}) }
    function onSuccessfulCreate() {
        enqueueSnackbar('Successfully Created Meter!', {variant: 'success'})
        reset()
    }
    const updateMeter = useUpdateMeter(onSuccessfulUpdate)
    const createMeter = useCreateMeter(onSuccessfulCreate)

    const onSaveChanges: SubmitHandler<any> = data => {
        data.well_distance_ft = data.well_distance_ft == "" ? null : parseFloat(data.well_distance_ft)
        updateMeter.mutate(data)
    }
    const onAddMeter: SubmitHandler<any> = data => {
        data.well_distance_ft = data.well_distance_ft == "" ? null : parseFloat(data.well_distance_ft)
        createMeter.mutate(data)
    }
    const onErr = (data: any) => console.log("ERR: ", data)

    // Populate the form with the selected meter's details
    useEffect(() => {
        if (meterDetails.data != undefined) {
            reset()
            setIsInitialLoad(false)
            Object.entries(meterDetails.data).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [meterDetails.data])

    // Empty form if entering add mode
    useEffect(() => {
        if (meterAddMode){
            reset()
            setIsInitialLoad(false)
        }
    }, [meterAddMode])

    function navigateToNewActivity() {
        navigate({
            pathname: '/activities',
            search: createSearchParams({
                meter_id: selectedMeterID?.toString() ?? '',
                serial_number: meterDetails.data?.serial_number ?? '',
                meter_status: meterDetails.data?.status?.status_name ?? ''
            }).toString()
        })
    }

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

    return (
        <Card>
            <CardHeader
                title={
                    meterAddMode ?
                        <div className="custom-card-header"><span>Add New Meter</span><AddIcon style={{fontSize: '1.5rem'}}/> </div> :
                        <div className="custom-card-header"><span>Selected Meter Details</span><GradingIcon style={{fontSize: '1.5rem'}}/> </div>
                    }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent>
                <Grid container spacing={2}>

                    {/* Serial number, meter type, and well entry */}
                    <Grid container item xs={12}>
                        <Grid item xs={12} lg={5}>
                            <ControlledTextbox
                                name="serial_number"
                                control={control}
                                label="Serial Number"
                                error={errors?.serial_number?.message != undefined}
                                helperText={errors?.serial_number?.message}
                                disabled={!hasAdminScope || isInitialLoad}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} lg={5}>
                            <ControlledMeterTypeSelect
                                name="meter_type"
                                control={control}
                                errors={errors?.meter_type?.message}
                                disabled={!hasAdminScope || isInitialLoad}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} lg={5}>
                            <ControlledWellSelection
                                name="well"
                                control={control}
                                errors={errors?.meter_type?.message}
                                disabled={!hasAdminScope || isInitialLoad}
                            />
                        </Grid>
                    </Grid>

                    {/* Read-only details table */}
                    <Grid item xs={12}>
                        <TableContainer sx={{ mb:3, mt: 2}}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '25%' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '25%' }}>TRSS</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '50%' }}>Lat/Long</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '1rem' }}>{ meterDetails.data?.status?.status_name == null ? 'N/A' : meterDetails.data?.status?.status_name }</TableCell>
                                        <TableCell sx={{ fontSize: '1rem' }}>{ watch("well")?.location?.trss == null ? '--' : watch("well")?.location?.trss}</TableCell>
                                        <TableCell sx={{ fontSize: '1rem' }}>
                                            { watch("well")?.location?.latitude == null ? '--': formatLatLong(watch("well")?.location?.latitude, watch("well")?.location?.longitude) }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Other meter details */}
                    <Grid item xs={4}>
                        <ControlledTextbox
                            name="contact_name"
                            control={control}
                            label="Contact Name"
                            error={errors?.contact_name?.message != undefined}
                            helperText={errors?.contact_name?.message}
                            disabled={!hasAdminScope || isInitialLoad}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ControlledTextbox
                            name="contact_phone"
                            control={control}
                            label="Contact Phone"
                            error={errors?.contact_phone?.message != undefined}
                            helperText={errors?.contact_phone?.message}
                            disabled={!hasAdminScope || isInitialLoad}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ControlledTextbox
                            name="well_distance_ft"
                            control={control}
                            label="Well Distance"
                            error={errors?.well_distance_ft?.message != undefined}
                            helperText={errors?.well_distance_ft?.message}
                            disabled={!hasAdminScope || isInitialLoad}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ControlledTextbox
                            name="notes"
                            control={control}
                            label="Installation Notes"
                            error={errors?.notes?.message != undefined}
                            helperText={errors?.notes?.message}
                            disabled={!hasAdminScope || isInitialLoad}
                            rows={3}
                            multiline
                        />
                    </Grid>

                    {/* Buttons */}
                    <Grid container item xs={12} spacing={2}>
                        {hasAdminScope &&
                            <Grid item >
                                {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                                    meterAddMode ?
                                    <Button color="success" variant="contained" onClick={handleSubmit(onAddMeter, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New Meter</Button> :
                                    <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                                }
                            </Grid>
                        }
                        <Grid item >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={meterDetails.data?.status?.status_name == 'Sold' || meterDetails.data?.status?.status_name == 'Scrapped' || isInitialLoad}
                                onClick={navigateToNewActivity}
                            >New Activity</Button>
                        </Grid>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    )
}
