import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Box, Button, Card, CardContent, CardHeader, Grid, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

import { useCreateWell, useGetUseTypes, useGetWaterSources, useUpdateWell } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import { SubmitWellCreate, SubmitWellUpdate, WaterSource, Well, WellUseLU } from '../../interfaces'
import { ControlledSelect } from '../../components/RHControlled/ControlledSelect';
import ControlledDMS from '../../components/RHControlled/ControlledDMS';
import { GCSdimension } from '../../enums';
import { MergeWellModal } from '../../components/MergeWellModal';
import { isMainThread } from 'worker_threads';

import { useAuthUser } from 'react-auth-kit';
import { SecurityScope } from '../../interfaces';
import ControlledCheckbox from '../../components/RHControlled/ControlledCheckbox';

const WellResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    use_type: Yup.object().required('Please select a use type.'),
    water_source: Yup.object().required('Please select a water source.'),
    location: Yup.object().shape({
        trss: Yup.string().required('Please enter the TRSS.'),
    })
})

interface WellDetailsCardProps {
    selectedWell: Well | undefined,
    wellAddMode: boolean
}

export default function WellDetailsCard({selectedWell, wellAddMode}: WellDetailsCardProps) {
    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<SubmitWellUpdate | SubmitWellCreate>({
        resolver: yupResolver(WellResolverSchema),
        defaultValues: {
            location: {latitude: 0, longitude: 0}
        }
    })

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    const useTypeList = useGetUseTypes()
    const waterSources = useGetWaterSources()

    function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Well!', {variant: 'success'}) }
    function onSuccessfulCreate() {
        enqueueSnackbar('Successfully Created Well!', {variant: 'success'})
        reset()
    }
    function onSuccessfulMerge() {
        enqueueSnackbar('Successfully Merged Well!', {variant: 'success'})
        reset()
    }
    const createWell = useCreateWell(onSuccessfulCreate)
    const updateWell = useUpdateWell(onSuccessfulUpdate)

    const onSaveChanges: SubmitHandler<any> = data => updateWell.mutate(data)
    const onAddWell: SubmitHandler<any> = data => createWell.mutate(data)
    const onErr = (data: any) => console.log("ERR: ", data)

    // Populate the form with the selected well's details
    useEffect(() => {
       
        if (selectedWell != undefined) {
            reset()
            Object.entries(selectedWell).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [selectedWell])

    // Empty the form if entering well add mode
    useEffect(() => {
        if (wellAddMode) reset()
    }, [wellAddMode])

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

    // Modal related functions
    const [isWellMergeModalOpen, setIsWellMergeModalOpen] = React.useState(false)
    const handleOpenMergeModal = () => setIsWellMergeModalOpen(true)
    const handleCloseMergeModal = () => setIsWellMergeModalOpen(false)

    return (
        <Card>
            <CardHeader
                title={
                    wellAddMode ?
                        <div className="custom-card-header"><span>Create Well</span><AddIcon style={{fontSize: '1rem'}}/> </div> :
                        <div className="custom-card-header"><span>Edit Well</span><EditIcon style={{fontSize: '1rem'}}/> </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid container item spacing={2}>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="ra_number"
                                control={control}
                                label="RA Number"
                                error={errors?.ra_number?.message != undefined}
                                helperText={errors?.ra_number?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="osetag"
                                control={control}
                                label="OSE Tag"
                                error={errors?.osetag?.message != undefined}
                                helperText={errors?.osetag?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <ControlledSelect
                                name="water_source"
                                label="Status"
                                options={waterSources.data ?? []}
                                getOptionLabel={(source: WaterSource) => source.name}
                                control={control}
                                error={errors?.water_source?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledSelect
                                name="use_type"
                                label="Use Type"
                                options={useTypeList.data ?? []}
                                getOptionLabel={(use: WellUseLU) => use.use_type}
                                control={control}
                                error={errors?.use_type?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <ControlledSelect
                                name="water_source"
                                label="Water Source"
                                options={waterSources.data ?? []}
                                getOptionLabel={(source: WaterSource) => source.name}
                                control={control}
                                error={errors?.water_source?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2} display={watch("use_type").id != 11 ? 'none' : 'flex'}>
                        <Grid item xs={12}>
                            <h4 style={{color: "#292929", fontWeight: '500', marginBottom: 0}}>Well Properties</h4>
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="name"
                                control={control}
                                label="Name"
                                //error={errors?.name?.message != undefined}
                                //helperText={errors?.ra_number?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        <ControlledTextbox
                                name="total_depth"
                                control={control}
                                label="Total Depth"
                                //error={errors?.name?.message != undefined}
                                //helperText={errors?.ra_number?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2} display={watch("use_type").id != 11 ? 'none' : 'flex'}>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="casing"
                                control={control}
                                label="Casing"
                                //error={errors?.name?.message != undefined}
                                //helperText={errors?.ra_number?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledCheckbox
                                name="outside_recorder"
                                control={control}
                                label="Outside Recorder"
                                labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <h4 style={{color: "#292929", fontWeight: '500', marginBottom: 0}}>Well Location</h4>
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledDMS
                                name="location.latitude"
                                control={control}
                                dimension_type={GCSdimension.Latitude}
                                value={watch("location.latitude") ?? 0}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledDMS
                                name="location.longitude"
                                control={control}
                                dimension_type={GCSdimension.Longitude}
                                value={watch("location.longitude") ?? 0}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="location.trss"
                                control={control}
                                label="TRSS"
                                error={errors?.location?.trss?.message != undefined}
                                helperText={errors?.location?.trss?.message}
                                value={watch("location.trss") ?? ''}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sx={{mt: 2}}>
                        <Stack direction="row" spacing={2}>
                            {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                                wellAddMode ?
                                <Button color="success" variant="contained" onClick={handleSubmit(onAddWell, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New Well</Button> :
                                <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                            }
                            {// If in edit mode, show the merge button
                                !wellAddMode ? <Button variant="contained" onClick={handleOpenMergeModal} disabled={!hasAdminScope}>Merge Well</Button> : ''
                            }
                        </Stack>
                    </Grid>
                </Grid>
            <MergeWellModal 
                isWellMergeModalOpen={isWellMergeModalOpen} 
                handleCloseMergeModal={handleCloseMergeModal} 
                handleSuccess={onSuccessfulMerge}
                mergeWell_raNumber = {selectedWell?.ra_number ?? ''}
            />
            </CardContent>
        </Card>
    )
}
