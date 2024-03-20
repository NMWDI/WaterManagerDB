//Details card for selected history item. This version is used to patch the history.

import React from 'react'
import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuthUser } from 'react-auth-kit'
import { Box, TextField, Grid, Card, CardContent, CardHeader, Stack, Button } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { MeterHistoryType } from '../../../enums'
import { PatchMeterActivity, SecurityScope } from '../../../interfaces'


import ControlledDatepicker from '../../../components/RHControlled/ControlledDatepicker'
import ControlledTimepicker from '../../../components/RHControlled/ControlledTimepicker'
import ControlledActivitySelect from '../../../components/RHControlled/ControlledActivitySelect'
import ControlledUserSelect from '../../../components/RHControlled/ControlledUserSelect'
import ControlledWellSelection from '../../../components/RHControlled/ControlledWellSelection'
import ControlledTextbox from '../../../components/RHControlled/ControlledTextbox';

interface SelectedActivityProps {
    selectedActivity: PatchMeterActivity
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

//There will be separate components for activity and observation history items
export default function SelectedActivityDetails({selectedActivity}: SelectedActivityProps) {

    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<PatchMeterActivity>()
    const onSaveChanges: SubmitHandler<any> = data => console.log(data)

    console.log(selectedActivity)

    //Update the form when selectedActivity changes
    useEffect(() => {
        if(selectedActivity != undefined){
            reset()
            setValue('activity_date', selectedActivity.activity_date)
            setValue('activity_start_time', selectedActivity.activity_start_time)
            setValue('activity_end_time', selectedActivity.activity_end_time)
            setValue('activity_type', selectedActivity.activity_type)
            setValue('submitting_user', selectedActivity.submitting_user)
            setValue('well', selectedActivity.well)
            setValue('water_users', selectedActivity.water_users)
        }
        
    }, [selectedActivity])

    //User must have admin scope to edit history items
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')
    

    return (
            <Card>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>Selected History Details V2 Testing</span>
                        <InfoOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent>
                <Grid container item xs={10}>

                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4}>
                            <ControlledUserSelect
                                name="submitting_user"
                                control={control}
                                errors={''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={4}>
                            <ControlledDatepicker
                                label="Date"
                                name="activity_date"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="Start Time"
                                name="activity_start_time"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="End Time"
                                name="activity_end_time"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={4}>
                            <ControlledActivitySelect
                                name="activity_type"
                                control={control}
                                error={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledWellSelection
                                name="well"
                                control={control}
                                error={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTextbox
                                name="water_users"
                                control={control}
                                errors={''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <TextField 
                            label="Description" 
                            variant="outlined" 
                            size="small" 
                            multiline 
                            rows={2} 
                            fullWidth 
                            value={''}
                        />
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <TextField
                            label="Services Performed"
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                            fullWidth
                            value={''}
                        />
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <TextField
                            label="Notes"
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                            fullWidth
                            value={''}
                        />
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <TextField
                            label="Parts Used"
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                            fullWidth
                            value={''}
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



