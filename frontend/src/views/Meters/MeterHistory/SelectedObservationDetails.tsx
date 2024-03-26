//Details card for selected "observation".

import React from 'react'
import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuthUser } from 'react-auth-kit'
import { Box, TextField, Grid, Card, CardContent, CardHeader, Stack, Button } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { PatchObservationForm, SecurityScope } from '../../../interfaces'

import ControlledDatepicker from '../../../components/RHControlled/ControlledDatepicker'
import ControlledTimepicker from '../../../components/RHControlled/ControlledTimepicker'
import ControlledUserSelect from '../../../components/RHControlled/ControlledUserSelect'
import ControlledWellSelection from '../../../components/RHControlled/ControlledWellSelection'
import ControlledTextbox from '../../../components/RHControlled/ControlledTextbox';
import { ControlledSelect } from '../../../components/RHControlled/ControlledSelect';
import ControlledCheckbox from '../../../components/RHControlled/ControlledCheckbox';



interface SelectedObservationProps {
    selectedObservation: PatchObservationForm
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

//There will be separate components for activity and observation history items
export default function SelectedObservationDetails({selectedObservation}: SelectedObservationProps) {

    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<PatchObservationForm>(
        {defaultValues: selectedObservation}
    )
    const onSaveChanges: SubmitHandler<any> = data => console.log(data)

    //Update the form when selectedActivity changes
    // useEffect(() => {
    //     if(selectedActivity != undefined){
    //         reset()
    //         setValue('activity_date', selectedActivity.activity_date)
    //         setValue('activity_start_time', selectedActivity.activity_start_time)
    //         setValue('activity_end_time', selectedActivity.activity_end_time)
    //         setValue('activity_type', selectedActivity.activity_type)
    //         setValue('submitting_user', selectedActivity.submitting_user)
    //         setValue('well', selectedActivity.well)
    //         setValue('water_users', selectedActivity.water_users)
    //     }
        
    // }, [selectedActivity])

    //User must have admin scope to edit history items
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')
    

    return (
            <Card>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>Selected Observation Details</span>
                        <InfoOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent>
                <Grid container item xs={10}>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={4}>
                            <ControlledDatepicker
                                label="Date"
                                name="observation_date"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="Time"
                                name="observation_time"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                    </Grid>

                    {/* <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={3}>
                            <ControlledSelect
                                name={'property_type'}
                                control={control}
                                label={"Reading Type"}
                                options={''}//{propertyTypes.data ?? []}
                                //getOptionLabel={(p: ObservedPropertyTypeLU) => p.name}
                                //error={errors?.observations?.at(index)?.property_type?.message}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledTextbox
                                name={'value'}
                                control={control}
                                label={"Value"}
                                //error={errors?.observations?.at(index)?.reading?.message != undefined}
                                //helperText={errors?.observations?.at(index)?.reading?.message}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ControlledSelect
                                name={'unit'}
                                control={control}
                                label={"Unit"}
                                options={''}//{watch(`observations.${index}.property_type`)?.units ?? []}
                                //getOptionLabel={(p: ObservedPropertyTypeLU) => p.name}
                                //error={errors?.observations?.at(index)?.unit?.message}
                            />
                        </Grid>
                    </Grid> */}

                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4}>
                            <ControlledUserSelect
                                name="submitting_user"
                                control={control}
                                errors={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledWellSelection
                                name="well"
                                control={control}
                                errors={''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <ControlledTextbox
                            name="notes"
                            control={control}
                            label="Notes"
                            rows={2}
                            multiline
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <ControlledCheckbox
                            name="activity_details.share_ose"
                            control={control}
                            label="Share activity with OSE"
                            labelPlacement="start"
                        />
                    </Grid>

                    <Grid container item xs={12} sx={{mt: 2}}>
                        <Stack direction="row" spacing={2}>
                            <Button color="success" variant="contained" onClick={handleSubmit(onSaveChanges)}><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                            <Button variant="contained">Delete</Button>
                        </Stack>
                    </Grid>
                  
                </Grid>
            </CardContent>
            </Card>
        )
}



