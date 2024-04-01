//Details card for selected "Activity".

import React from 'react'
import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuthUser } from 'react-auth-kit'
import { Box, TextField, Grid, Card, CardContent, CardHeader, Stack, Button } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { PatchActivityForm, PatchActivitySubmit, SecurityScope } from '../../../interfaces'
import { useUpdateActivity } from '../../../service/ApiServiceNew'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'

import ControlledDatepicker from '../../../components/RHControlled/ControlledDatepicker'
import ControlledTimepicker from '../../../components/RHControlled/ControlledTimepicker'
import ControlledActivitySelect from '../../../components/RHControlled/ControlledActivitySelect'
import ControlledUserSelect from '../../../components/RHControlled/ControlledUserSelect'
import ControlledWellSelection from '../../../components/RHControlled/ControlledWellSelection'
import ControlledTextbox from '../../../components/RHControlled/ControlledTextbox';

import NotesChipSelect from '../../../components/RHControlled/NotesChipSelect'
import ControlledCheckbox from '../../../components/RHControlled/ControlledCheckbox'

interface SelectedActivityProps {
    selectedActivity: PatchActivityForm
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

//There will be separate components for activity and observation history items
export default function SelectedActivityDetails({selectedActivity}: SelectedActivityProps) {

    const { handleSubmit, control, setValue, reset, watch, formState: { errors }} = useForm<PatchActivityForm>(
        { defaultValues: selectedActivity }
    )
    
    function onSuccessfulUpdate() { enqueueSnackbar('Successfully Updated Observation!', {variant: 'success'}) }
    const updateActivity = useUpdateActivity(onSuccessfulUpdate)

    const onSaveChanges: SubmitHandler<any> = data => {

        //Timestamp conversion function - Input date and time are 'America/Denver' and should be combined into a UTC timestamp
        function convertTimestamp(date: dayjs.Dayjs, time: dayjs.Dayjs) {
            let dateUTC = date.tz('America/Denver').utc().format('YYYY-MM-DD')
            let timeUTC = time.tz('America/Denver').utc().format('HH:mm')
            return dateUTC + 'T' + timeUTC
        }
        
        //Convert the form data to the PatchObservationSubmit type
        let activity_data: PatchActivitySubmit = {
            activity_id: selectedActivity.activity_id,
            timestamp_start: convertTimestamp(data.activity_date, data.activity_start_time),
            timestamp_end: convertTimestamp(data.activity_date, data.activity_end_time),
            description: data.description,
            submitting_user_id: data.submitting_user.id,
            meter_id: selectedActivity.meter_id,
            activity_type_id: data.activity_type.id,
            location_id: data.well.location_id,
            ose_share: data.ose_share,
            water_users: data.water_users,

            note_ids: [],
            service_ids: [],
            part_ids: [],
        }
        console.log(activity_data)
        updateActivity.mutate(activity_data)
    }

    //Update the form when selectedActivity changes
    useEffect(() => {
        reset(selectedActivity)
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
                                //errors={''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={4}>
                            <ControlledDatepicker
                                label="Date"
                                name="activity_date"
                                control={control}
                                //error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="Start Time"
                                name="activity_start_time"
                                control={control}
                                //error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="End Time"
                                name="activity_end_time"
                                control={control}
                                //error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={4}>
                            <ControlledActivitySelect
                                name="activity_type"
                                control={control}
                                //error={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledWellSelection
                                name="well"
                                control={control}
                                //error={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTextbox
                                name="water_users"
                                control={control}
                                label="Water Users"
                                //errors={''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <ControlledTextbox
                            name="description"
                            control={control}
                            label="Description"
                            rows={2}
                            multiline
                        />
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <NotesChipSelect
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
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

                    <Grid item xs={5}>
                        <ControlledCheckbox
                            name="ose_share"
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



