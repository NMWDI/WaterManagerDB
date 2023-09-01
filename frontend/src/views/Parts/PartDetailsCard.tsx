import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, FormControl, Grid, InputLabel, MenuItem, Select, makeStyles } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import HelpIcon from '@mui/icons-material/Help';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useFieldArray } from 'react-hook-form'

import { useCreatePart, useGetMeterTypeList, useGetPart, useUpdatePart } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import ControlledPartTypeSelect from '../../components/RHControlled/ControlledPartTypeSelect'
import { MeterTypeLU, Part } from '../../interfaces'

const PartResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    part_number: Yup.string().required('Please enter a part number.'),
    count: Yup.number().typeError('Please enter a number.').required('Please enter a count.'),
    part_type: Yup.mixed().required('Please select a part type.')
})

const emptyDetails = {
    id: 0,
    part_number: '',
    part_type_id: null,
    vendor: '',
    note: '',
    description: '',
    count: '',
    part_type: null
}


export default function PartDetailsCard({selectedPartID, partAddMode}: any) {
    function onSuccessfulUpdate() {
        enqueueSnackbar('Successfully Updated Part!', {variant: 'success'})
    }
    function onSuccessfulCreate() {
        enqueueSnackbar('Successfully Created Part!', {variant: 'success'})
    }

    // Part details RHF
    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<Part>({
        resolver: yupResolver(PartResolverSchema)
    })

    // Associated meter types RHF
    const { fields, append, remove } = useFieldArray({
        control, name: "meter_types"
    })

    const partDetails = useGetPart({part_id: selectedPartID})
    const meterTypeList = useGetMeterTypeList()
    const updatePart = useUpdatePart(onSuccessfulUpdate)
    const createPart = useCreatePart(onSuccessfulCreate)

    const onSaveChanges: SubmitHandler<any> = data => updatePart.mutate(data)
    const onAddPart: SubmitHandler<any> = data => createPart.mutate(data)
    const onErr = (data: any) => console.log("ERR: ", data)

    // Convert the form to the structure expected on the backend (PartForm)
    // function correctForm(data: Part) {
    //     if (data.part_type) {
    //         data.part_type_id = data.part_type.id
    //     }
    //     if(data.meter_types) {

    //     }
    //     return data
    // }

    function removeMeterType(meterTypeIndex: number) {
        remove(meterTypeIndex)
    }

    function addMeterType(meterTypeID: number) {
        const newType = meterTypeList.data?.find(x => x.id === meterTypeID)

        if (newType) {
            append(newType)
        }
    }

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

    // Populate the form with the selected part's details
    useEffect(() => {
        if (partDetails.data != undefined) {
            reset()
            Object.entries(partDetails.data).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [partDetails.data])

    // Empty the form if entering part add mode
    useEffect(() => {
        if (partAddMode) {
            Object.entries(emptyDetails).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [partAddMode])

    return (
        <Card sx={{height: '100%'}}>
            <CardContent>
                <CardHeader
                    title={partAddMode ? <><AddIcon style={{fontSize: '1rem'}}/> Create Part</> : <><EditIcon style={{fontSize: '1rem'}}/> Edit Part</>}
                    sx={{m: 0, p: 0, color: '#A0A0A0'}}
                />

                <Grid container>
                    <Grid container item xs={12}>
                        <Grid item xs={12} xl={6} sx={{mt: 2}}>
                            <ControlledTextbox
                                name="part_number"
                                control={control}
                                label="Part Number"
                                error={errors?.part_number?.message != undefined}
                                helperText={errors?.part_number?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} xl={6} sx={{mt: 2}}>
                            <ControlledPartTypeSelect
                                name="part_type"
                                control={control}
                                error={errors?.part_type?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} xl={6} sx={{mt: 2}}>
                            <ControlledTextbox
                                name="count"
                                control={control}
                                label="Count"
                                error={errors?.count?.message != undefined}
                                helperText={errors?.count?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <ControlledTextbox
                                name="description"
                                control={control}
                                label="Description"
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <ControlledTextbox
                                name="note"
                                control={control}
                                label="Notes"
                                rows={3}
                                multiline
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <Box border={1} padding={1} style={{borderColor: '#C4C4C4', position: 'relative'}} borderRadius={4}>
                                <InputLabel shrink={true} style={{ position: 'absolute', left: 10, top: true ? -8 : 8, backgroundColor: 'white', padding: '0 5px' }}>
                                    Associated Meter Types
                                </InputLabel>

                                {/* Start meter type selectbox  */}
                                <Chip
                                    sx={{mr: 1, mt: 1, p: 0}}
                                    label={
                                        <>
                                        <FormControl size="small" variant="standard" sx={{width: '150px', marginBottom: '13px'}}>
                                        <InputLabel>Add Meter Type</InputLabel>
                                            <Select
                                                disableUnderline
                                                onChange={(event: any) => addMeterType(event.target.value)}
                                                value={''}
                                            >
                                                <MenuItem value="" hidden disabled></MenuItem>

                                                {/* Meter type list (with selected meter types filtered out)  */}
                                                {meterTypeList.data?.
                                                    filter(x => !watch("meter_types")?.map(type => type.id).includes(x.id))
                                                        .map((type: MeterTypeLU) => <MenuItem value={type.id}>{`${type.brand} - ${type.model_number}`}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        </>
                                    }
                                    variant="outlined"
                                    onClick={() => {}}
                                />
                                {/* End meter type select box  */}

                                {/* Show all current meter types as chips */}
                                {watch("meter_types")?.map((type: MeterTypeLU, index: number) =>
                                    <Chip
                                        key={type.id}
                                        sx={{mr: 1, mt: 1}}
                                        label={ `${type.brand} - ${type.model_number}` }
                                        onDelete={() => {removeMeterType(index)}}
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sx={{mt: 2}}>
                        {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                            partAddMode ?
                            <Button color="success" variant="contained" onClick={handleSubmit(onAddPart, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New Part</Button> :
                            <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                        }
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    )
}
