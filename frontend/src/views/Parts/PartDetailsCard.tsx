import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useFieldArray } from 'react-hook-form'

import { useCreatePart, useGetMeterTypeList, useGetPart, useUpdatePart } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import ControlledPartTypeSelect from '../../components/RHControlled/ControlledPartTypeSelect'
import { MeterTypeLU, Part } from '../../interfaces'
import { ControlledSelectNonObject } from '../../components/RHControlled/ControlledSelect';

const PartResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    part_number: Yup.string().required('Please enter a part number.'),
    count: Yup.number().typeError('Please enter a number.').required('Please enter a count.'),
    part_type: Yup.mixed().required('Please select a part type.'),
    in_use: Yup.boolean().typeError('Please indicate if part is in use.').required('Please indicate if part is in use.'),
    commonly_used: Yup.boolean().typeError('Please indicate if part is commonly used.').required('Please indicate if part is commonly_used.')
})

interface PartDetailsCard {
    selectedPartID: number | undefined
    partAddMode: boolean
}

export default function PartDetailsCard({selectedPartID, partAddMode}: PartDetailsCard) {
    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<Part>({
        resolver: yupResolver(PartResolverSchema)
    })

    // Associated meter types as an array
    const { append, remove } = useFieldArray({
        control, name: "meter_types"
    })

    function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Part!', {variant: 'success'}) }
    function onSuccessfulCreate() {
        enqueueSnackbar('Successfully Created Part!', {variant: 'success'})
        reset()
    }

    const updatePart = useUpdatePart(onSuccessfulUpdate)
    const createPart = useCreatePart(onSuccessfulCreate)

    const onSaveChanges: SubmitHandler<any> = data => updatePart.mutate(data)
    const onAddPart: SubmitHandler<any> = data => createPart.mutate(data)
    const onErr = (data: any) => console.log("ERR: ", data)

    const partDetails = useGetPart(selectedPartID ? {part_id: selectedPartID} : undefined)
    const meterTypeList = useGetMeterTypeList()

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
            reset()
        }
    }, [partAddMode])

    function removeMeterType(meterTypeIndex: number) {
        remove(meterTypeIndex)
    }

    function addMeterType(meterTypeID: number) {
        const newType = meterTypeList.data?.find(x => x.id === meterTypeID)
        if (newType) append(newType)
    }

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

    return (
        <Card>
            <CardContent>
                <CardHeader
                    title={partAddMode ? <><AddIcon style={{fontSize: '1rem'}}/> Create Part</> : <><EditIcon style={{fontSize: '1rem'}}/> Edit Part</>}
                    sx={{m: 0, p: 0, color: '#A0A0A0'}}
                />

                <Grid container>
                    <Grid container item xs={12} spacing={2} sx={{mt: 2}}>
                        <Grid item xs={12} xl={6}>
                            <ControlledTextbox
                                name="part_number"
                                control={control}
                                label="Part Number"
                                error={errors?.part_number?.message != undefined}
                                helperText={errors?.part_number?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6} >
                            <ControlledPartTypeSelect
                                name="part_type"
                                control={control}
                                error={errors?.part_type?.message}
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
                        <Grid item xs={12} xl={6} >
                            <ControlledSelectNonObject
                                name="commonly_used"
                                control={control}
                                label="Commonly Used"
                                options={[true, false]}
                                getOptionLabel={(label: boolean) => label ? "True" : "False"}
                                error={errors?.commonly_used?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6} >
                            <ControlledTextbox
                                name="count"
                                control={control}
                                label="Count"
                                error={errors?.count?.message != undefined}
                                helperText={errors?.count?.message}
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
                    <Grid container xs={12} sx={{mt: 2}}>
                        <ControlledTextbox
                            name="note"
                            control={control}
                            label="Notes"
                            rows={3}
                            multiline
                        />
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sx={{mt: 2}}>

                            {/* Custom chip-based meter type association selection */}
                            <Box border={1} padding={1} style={{borderColor: '#C4C4C4', position: 'relative'}} borderRadius={4}>
                                <InputLabel shrink={true} style={{ position: 'absolute', left: 10, top: true ? -8 : 8, backgroundColor: 'white', padding: '0 5px' }}>
                                    Associated Meter Types
                                </InputLabel>
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

                                {/* Show all current meter types as chips */}
                                {watch("meter_types")?.filter((type: MeterTypeLU) => type.in_use).map((type: MeterTypeLU, index: number) =>
                                    <Chip
                                        key={type.id}
                                        sx={{mr: 1, mt: 1}}
                                        label={ `${type.brand} - ${type.model_number}` }
                                        onDelete={() => {removeMeterType(index)}}
                                    />
                                )}
                            </Box>
                            {/* End meter type association selection */}

                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs={12} sx={{mt: 2}}>
                    {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                        partAddMode ?
                        <Button color="success" variant="contained" onClick={handleSubmit(onAddPart, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New Part</Button> :
                        <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}
