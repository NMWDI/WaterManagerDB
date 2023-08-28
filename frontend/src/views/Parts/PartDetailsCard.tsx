import { Alert, Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useGetPart } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import ControlledPartTypeSelect from '../../components/RHControlled/ControlledPartTypeSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from "yup"

const PartResolverSchema = Yup.object().shape({
    part_number: Yup.string().required('Please enter a part number.'),
    count: Yup.number().typeError('Please enter a number.').required('Please enter a count.'),
    part_type: Yup.mixed().required('Please select a part type.')
})

export default function PartDetailsCard({selectedPartID, partAddMode}: any) {
    const partDetails = useGetPart({part_id: selectedPartID})
    const { handleSubmit, control, setValue, reset, formState: { errors }} = useForm({
        resolver: yupResolver(PartResolverSchema)
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

    const onSaveChanges: SubmitHandler<any> = data => console.log("SAVE: ", data)
    const onAddPart: SubmitHandler<any> = data => console.log("ADD: ", data)
    const onErr = (data: any) => console.log("ERR: ", data)

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
                    title={partAddMode ? 'Add Part' : 'Edit Part'}
                    sx={{m: 0, p: 0}}
                />

                <Grid container>
                    <Grid container item xs={12}>
                        <Grid item xs={12} xl={5} sx={{mt: 2}}>
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
                        <Grid item xs={12} xl={5} sx={{mt: 2}}>
                            <ControlledPartTypeSelect
                                name="part_type"
                                control={control}
                                error={errors?.part_type?.message}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} xl={5} sx={{mt: 2}}>
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
                        <Grid item xs={12} xl={10} sx={{mt: 2}}>
                            <ControlledTextbox
                                name="description"
                                control={control}
                                label="Description"
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} xl={10} sx={{mt: 2}}>
                            <ControlledTextbox
                                name="note"
                                control={control}
                                label="Notes"
                                rows={3}
                                multiline
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sx={{mt: 2}}>
                        {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                            partAddMode ?
                            <Button color="success" variant="contained" onClick={handleSubmit(onAddPart, onErr)}>Save New Part</Button> :
                            <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}>Save Changes</Button>
                        }
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    )
}
