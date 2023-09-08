import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

import { useCreateMeterType, useGetRoles, useUpdateMeterType } from '../../service/ApiServiceNew'
import ControlledTextbox from '../../components/RHControlled/ControlledTextbox'
import { MeterTypeLU, User, UserRole } from '../../interfaces'
import { ControlledSelect, ControlledSelectNonObject } from '../../components/RHControlled/ControlledSelect';

const UserResolverSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    brand: Yup.string().required('Please enter a name.'),
})

function SetNewPasswordAccordion({control, errorMessage, handleSubmit}: any) {
    return (
        <Accordion sx={{backgroundColor: '#e6e6e6'}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                sx={{m: 0, ml: 1, mr: 1, p: 0, color: '#595959'}}
            >
                <LockResetIcon style={{fontSize: '1.2rem', marginTop: '2px'}}/> &nbsp;
                <Typography>Set New Password for User</Typography>
            </AccordionSummary>
            <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <ControlledTextbox
                                    name="new_password"
                                    control={control}
                                    label="New Password"
                                    error={errorMessage != undefined}
                                    helperText={errorMessage}
                                    sx={{backgroundColor: 'white'}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Button color="primary" variant="contained" onClick={handleSubmit}><LockResetIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Set Password</Button>
                            </Grid>
                        </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

interface UserDetailsCardProps {
    selectedUser: User | undefined,
    userAddMode: boolean
}

export default function UserDetailsCard({selectedUser, userAddMode}: UserDetailsCardProps) {
    const { handleSubmit, control, setValue, reset, formState: { errors }} = useForm<User>({
        resolver: yupResolver(UserResolverSchema)
    })

    function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Meter Type!', {variant: 'success'}) }
    function onSuccessfulCreate() { enqueueSnackbar('Successfully Created Meter Type!', {variant: 'success'}) }
    const updateMeterType = useUpdateMeterType(onSuccessfulUpdate)
    const createMeterType = useCreateMeterType(onSuccessfulCreate)

    const rolesList = useGetRoles()

    const onSaveChanges: SubmitHandler<any> = data => updateMeterType.mutate(data)
    const onAddPart: SubmitHandler<any> = data => createMeterType.mutate(data)
    const onErr = (data: any) => console.log("ERR: ", data)

    // Populate the form with the selected user's details
    useEffect(() => {
        if (selectedUser != undefined) {
            reset()
            Object.entries(selectedUser).forEach(([field, value]) => {
                setValue(field as any, value)
            })
        }
    }, [selectedUser])

    // Empty the form if entering user add mode
    useEffect(() => {
        if (userAddMode) reset()
    }, [userAddMode])

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors() {
        return Object.keys(errors).length > 0
    }

    return (
        <Card>
            <CardContent>
                <CardHeader
                    title={userAddMode ? <><AddIcon style={{fontSize: '1rem'}}/> Create User</> : <><EditIcon style={{fontSize: '1rem'}}/> Edit User</>}
                    sx={{m: 0, p: 0, color: '#A0A0A0'}}
                />

                <Grid container>
                    <Grid container item xs={12} spacing={2} sx={{mt: 2}}>
                        <Grid container item>
                            <Grid item xs={6}>
                                <ControlledTextbox
                                    name="full_name"
                                    control={control}
                                    label="Full Name"
                                    error={errors?.full_name?.message != undefined}
                                    helperText={errors?.full_name?.message}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <ControlledTextbox
                                name="username"
                                control={control}
                                label="Username"
                                error={errors?.username?.message != undefined}
                                helperText={errors?.username?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <ControlledTextbox
                                name="email"
                                control={control}
                                label="Email"
                                error={errors?.email?.message != undefined}
                                helperText={errors?.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6} >
                            <ControlledSelectNonObject
                                name="disabled"
                                control={control}
                                label="Active"
                                options={[false, true]}
                                getOptionLabel={(label: boolean) => label ? "False" : "True"}
                                error={errors?.disabled?.message}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6} >
                            <ControlledSelect
                                name="user_role"
                                label="Role"
                                options={rolesList.data ?? []}
                                getOptionLabel={(role: UserRole) => role.name}
                                control={control}
                                error={errors?.user_role?.message}
                            />
                        </Grid>

                        {/* Show 'Set New Password for User' accordion if editing a user, show regular textfield if adding user */}
                            <Grid item xs={12} sx={{mt: 2, mb: 1}}>
                            {userAddMode ?
                                <ControlledTextbox
                                    name="new_password"
                                    control={control}
                                    label="Password"
                                    error={errors?.new_password?.message != undefined}
                                    helperText={errors?.new_password?.message}
                                /> :
                                <SetNewPasswordAccordion
                                    control={control}
                                    errorMessage={errors?.new_password?.message}
                                    handleSubmit={handleSubmit(onAddPart, onErr)}
                                />
                            }
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sx={{mt: 2}}>
                        {hasErrors() ? <Alert severity="error" sx={{width: '50%'}}>Please correct any errors before submission.</Alert> :
                            userAddMode ?
                            <Button color="success" variant="contained" onClick={handleSubmit(onAddPart, onErr)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save New User</Button> :
                            <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges, onErr)}><SaveAsIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                        }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
