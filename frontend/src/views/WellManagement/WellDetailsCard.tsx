import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

import { useCreateWell, useGetUseTypes, useUpdateWell } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import { SubmitWellCreate, SubmitWellUpdate, Well, WellUseLU } from '../../interfaces'
import { ControlledSelect } from '../../components/RHControlled/ControlledSelect';
import ControlledDMS from '../../components/RHControlled/ControlledDMS_v2';
import { GCSdimension } from '../../enums';

const WellResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    name: Yup.string().required('Please enter a well name.'),
    use_type: Yup.object().required('Please select a use type.'),
    location: Yup.object().shape({
        name: Yup.string().required('Please enter a location name.'),
        trss: Yup.string().required('Please enter the TRSS.'),
        longitude: Yup.number().typeError('Only numbers may be entered.').required('Please enter the longitude.'),
        latitude: Yup.number().typeError('Only numbers may be entered.').required('Please enter the latitude.'),
    })
})

interface WellDetailsCardProps {
    selectedWell: Well | undefined,
    wellAddMode: boolean
}

export default function WellDetailsCard({selectedWell, wellAddMode}: WellDetailsCardProps) {
    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<SubmitWellUpdate | SubmitWellCreate>({
        resolver: yupResolver(WellResolverSchema)
    })

    const useTypeList = useGetUseTypes()

    function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Well!', {variant: 'success'}) }
    function onSuccessfulCreate() {
        enqueueSnackbar('Successfully Created Well!', {variant: 'success'})
        reset()
    }
    const createWell = useCreateWell(onSuccessfulCreate)
    const updateWell = useUpdateWell(onSuccessfulUpdate)

    const onSaveChanges: SubmitHandler<any> = data => console.log(data)//updateWell.mutate(data)
    const onAddWell: SubmitHandler<any> = data => console.log(data)//createWell.mutate(data)
    const onErr = (data: any) => console.log("ERR: ", data)

    // Populate the form with the selected well's details
    useEffect(() => {
        console.log(selectedWell)
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

    useEffect(() => {
        console.log("Location.latitude: " + watch("location.latitude"))
    }, [watch("location.latitude")])

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

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
                                name="name"
                                control={control}
                                label="Well Name"
                                error={errors?.name?.message != undefined}
                                helperText={errors?.name?.message}
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
                            <ControlledTextbox
                                name="owners"
                                control={control}
                                label="Owners"
                                error={errors?.owners?.message != undefined}
                                helperText={errors?.owners?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <h4 style={{color: "#292929", fontWeight: '500', marginBottom: 0}}>Well Location</h4>
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="location.name"
                                control={control}
                                label="Name"
                                error={errors?.location?.name?.message != undefined}
                                helperText={errors?.location?.name?.message}
                                value={watch("location.name") ?? ''}
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
                    </Grid>
                    <Grid container item xs={12} sx={{mt: 2}}>
                        {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                            wellAddMode ?
                            <Button color="success" variant="contained" onClick={handleSubmit(onAddWell, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New Well</Button> :
                            <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                        }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
