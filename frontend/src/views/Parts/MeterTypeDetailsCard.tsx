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

import { useCreateMeterType, useUpdateMeterType } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import { MeterTypeLU } from '../../interfaces'
import { ControlledSelectNonObject } from '../../components/RHControlled/ControlledSelect';

const MeterTypeResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    brand: Yup.string().required('Please enter a brand.'),
    model_number: Yup.string().required('Please enter a model number.'),
    size: Yup.number().typeError('Please enter a number.').required('Please enter a size.'),
    in_use: Yup.boolean().typeError('Please indicate if part is in use.').required('Please indicate if part is in use.')
})

export default function MeterTypeDetailsCard({selectedMeterType, meterTypeAddMode}: any) {
    function onSuccessfulUpdate() {
        enqueueSnackbar('Successfully Updated Meter Type!', {variant: 'success'})
    }
    function onSuccessfulCreate() {
        enqueueSnackbar('Successfully Created Meter Type!', {variant: 'success'})
    }

    // Part details form
    const { handleSubmit, control, setValue, reset, formState: { errors }} = useForm<MeterTypeLU>({
        resolver: yupResolver(MeterTypeResolverSchema)
    })

    const updateMeterType = useUpdateMeterType(onSuccessfulUpdate)
    const createMeterType = useCreateMeterType(onSuccessfulCreate)

    const onSaveChanges: SubmitHandler<any> = data => updateMeterType.mutate(data)
    const onAddPart: SubmitHandler<any> = data => createMeterType.mutate(data)
    const onErr = (data: any) => console.log("ERR: ", data)

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

    // Populate the form with the selected meter type's details
    useEffect(() => {
        if (selectedMeterType != undefined) {
            reset()
            Object.entries(selectedMeterType).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [selectedMeterType])

    // Empty the form if entering meter type add mode
    useEffect(() => {
        if (meterTypeAddMode) reset()
    }, [meterTypeAddMode])

    return (
        <Card>
            <CardContent>
                <CardHeader
                    title={meterTypeAddMode ? <><AddIcon style={{fontSize: '1rem'}}/> Create Meter Type</> : <><EditIcon style={{fontSize: '1rem'}}/> Edit Meter Type</>}
                    sx={{m: 0, p: 0, color: '#A0A0A0'}}
                />

                <Grid container>
                    <Grid container item xs={12} spacing={2} sx={{mt: 2}}>
                        <Grid item xs={12} xl={6}>
                            <ControlledTextbox
                                name="brand"
                                control={control}
                                label="Brand"
                                error={errors?.brand?.message != undefined}
                                helperText={errors?.brand?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <ControlledTextbox
                                name="model_number"
                                control={control}
                                label="Model Number"
                                error={errors?.model_number?.message != undefined}
                                helperText={errors?.model_number?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <ControlledTextbox
                                name="size"
                                control={control}
                                label="Size"
                                error={errors?.size?.message != undefined}
                                helperText={errors?.size?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6} >
                            <ControlledSelectNonObject
                                name="in_use"
                                control={control}
                                label="In Use"
                                options={[true, false]}
                                getOptionLabel={(label: boolean) => label ? "True" : "False"}
                                error={errors?.in_use?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container xs={12} sx={{mt: 2}}>
                        <ControlledTextbox
                            name="description"
                            control={control}
                            label="Description"
                        />
                    </Grid>
                    <Grid container item xs={12} sx={{mt: 2}}>
                        {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                            meterTypeAddMode ?
                            <Button color="success" variant="contained" onClick={handleSubmit(onAddPart, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New Meter Type</Button> :
                            <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                        }
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    )
}
