import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CancelIcon from '@mui/icons-material/Cancel'
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useFieldArray } from 'react-hook-form'

import { useCreateRole, useGetSecurityScopes, useUpdateRole } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import { SecurityScope, UserRole, Well } from '../../interfaces'

// const RoleResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
//     name: Yup.string().required('Please enter a name.'),
// })

interface WellDetailsCardProps {
    selectedWell: Well | undefined,
    wellAddMode: boolean
}

export default function WellDetailsCard({selectedWell, wellAddMode}: WellDetailsCardProps) {
    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<Well>({
    })

    // const { append, remove } = useFieldArray({
    //     control, name: "security_scopes"
    // })

    // const securityScopeList = useGetSecurityScopes()

    // function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Role!', {variant: 'success'}) }
    // function onSuccessfulCreate() {
    //     enqueueSnackbar('Successfully Created Role!', {variant: 'success'})
    //     reset()
    // }
    // const createRole = useCreateRole(onSuccessfulCreate)
    // const updateRole = useUpdateRole(onSuccessfulUpdate)

    const onSaveChanges: SubmitHandler<any> = data => console.log("SAVE: ", data)
    const onAddWell: SubmitHandler<any> = data => console.log("ADD: ", data)
    const onErr = (data: any) => console.log("ERR: ", data)

    // Populate the form with the selected wells's details
    useEffect(() => {
        console.log(selectedWell)
        if (selectedWell != undefined) {
            reset()
            Object.entries(selectedWell).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [selectedWell])

    // Empty the form if entering role add mode
    useEffect(() => {
        if (wellAddMode) reset()
    }, [wellAddMode])

    // function removeSecurityScope(securityScopeIndex: number) {
    //     remove(securityScopeIndex)
    // }

    // function addSecurityScope(securityScopeID: number) {
    //     const newType = securityScopeList.data?.find(x => x.id === securityScopeID)
    //     if (newType) append(newType)
    // }

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
                            <ControlledTextbox
                                name="use_type.use_type"
                                control={control}
                                label="Use Type"
                                error={errors?.use_type?.message != undefined}
                                helperText={errors?.use_type?.message}
                                value={watch("use_type.use_type")}
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
                                name="osepod"
                                control={control}
                                label="OSE POD"
                                error={errors?.osepod?.message != undefined}
                                helperText={errors?.osepod?.message}
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
                            <ControlledTextbox
                                name="location.longitude"
                                control={control}
                                label="Longitude"
                                error={errors?.location?.longitude?.message != undefined}
                                helperText={errors?.location?.longitude?.message}
                                value={watch("location.longitude") ?? ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ControlledTextbox
                                name="location.latitude"
                                control={control}
                                label="Latitude"
                                error={errors?.location?.latitude?.message != undefined}
                                helperText={errors?.location?.latitude?.message}
                                value={watch("location.latitude") ?? ''}
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
