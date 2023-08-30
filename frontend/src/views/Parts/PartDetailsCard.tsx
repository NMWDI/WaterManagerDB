import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, Grid, InputLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import HelpIcon from '@mui/icons-material/Help';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

import { useGetPart, useUpdatePart } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import ControlledPartTypeSelect from '../../components/RHControlled/ControlledPartTypeSelect'
import { MeterTypeLU, Part } from '../../interfaces'

const PartResolverSchema = Yup.object().shape({
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

    const { handleSubmit, control, setValue, reset, formState: { errors }} = useForm({
        resolver: yupResolver(PartResolverSchema)
    })

    const partDetails = useGetPart({part_id: selectedPartID})
    const updatePart = useUpdatePart(onSuccessfulUpdate)

    const onSaveChanges: SubmitHandler<any> = data => updatePart.mutate(correctForm(data))
    const onAddPart: SubmitHandler<any> = data => console.log("ADD: ", data)
    const onErr = (data: any) => console.log("ERR: ", data)

    function correctForm(data: Part) {
        if (data.part_type) {
            data.part_type_id = data.part_type.id
        }
        return data
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
 {/*
                            {partDetails.data?.meter_type_associations?.map((association: any) => <div>{association?.associated_meter_type?.brand} - {association?.commonly_used.toString()}</div>)}
     */}
                            <Box border={1} padding={1} style={{borderColor: '#C4C4C4', position: 'relative'}} borderRadius={4}>
                                <InputLabel shrink={true} style={{ position: 'absolute', left: 10, top: true ? -8 : 8, backgroundColor: 'white', padding: '0 5px' }}>
                                    Associated Meter Types
                                </InputLabel>
                                <Chip
                                    sx={{mr: 1, mt: 1}}
                                    icon={<AddIcon/>}
                                    label="Add Meter Type"
                                    variant="outlined"
                                    onClick={() => {}}
                                />
                                <Chip
                                    sx={{mr: 1, mt: 1}}
                                    label="McCrometer - M0304"
                                    onDelete={() => {}}
                                    onClick={() => {}}
                                />
                                <Chip
                                    sx={{mr: 1, mt: 1}}
                                    label="McCrometer - M0306 (Commonly Used)"
                                    onDelete={() => {}}
                                    onClick={() => {}}
                                />
                                <Chip
                                    sx={{mr: 1, mt: 1}}
                                    label="McCrometer - M0308"
                                    onDelete={() => {}}
                                    onClick={() => {}}
                                />
                                <Chip
                                    sx={{mr: 1, mt: 1}}
                                    label="McCrometer - M0308"
                                    onDelete={() => {}}
                                    onClick={() => {}}
                                />
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
