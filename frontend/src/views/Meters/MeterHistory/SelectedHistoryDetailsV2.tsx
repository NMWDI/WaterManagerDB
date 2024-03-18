//Details card for selected history item. This version is used to patch the history.

import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuthUser } from 'react-auth-kit'
import { Box, TextField, Grid, Card, CardContent, CardHeader, Stack, Button } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { MeterHistoryType } from '../../../enums'
import { NoteTypeLU, PatchMeterActivity, SecurityScope } from '../../../interfaces'
import dayjs from 'dayjs'

import ControlledDatepicker from '../../../components/RHControlled/ControlledDatepicker'
import ControlledTimepicker from '../../../components/RHControlled/ControlledTimepicker'
import ControlledActivitySelect from '../../../components/RHControlled/ControlledActivitySelect'
import ControlledUserSelect from '../../../components/RHControlled/ControlledUserSelect'
import ControlledWellSelection from '../../../components/RHControlled/ControlledWellSelection'

interface SelectedActivityProps {
    selectedActivity: any
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

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    function formatDate(dateIN: any) {
        if (!dateIN) return null 
        return dayjs
                .utc(dateIN)
                .tz('America/Denver')
                .format('MM/DD/YYYY')
    }

    function formatTime(dateIN: any) {
        if (!dateIN) return null
        return dayjs
                .utc(dateIN)
                .tz('America/Denver')
                .format('hh:mm A')
    }

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
                            <ControlledDatepicker
                                label="Date"
                                name="activity_details.date"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="Start Time"
                                name="activity_details.start_time"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledTimepicker
                                label="End Time"
                                name="activity_details.end_time"
                                control={control}
                                error={''}
                                sx={{width: '100%'}}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        <Grid item xs={4}>
                            <ControlledActivitySelect
                                name="activity_details.activity_type"
                                control={control}
                                error={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledWellSelection
                                name="current_installation.well"
                                control={control}
                                error={''}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledUserSelect
                                name="activity_details.user"
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
                            <Button color="success" variant="contained"><SaveIcon sx={{fontSize: '1.2rem'}}/>&nbsp; Save Changes</Button>
                            <Button variant="contained">Delete</Button>
                        </Stack>
                    </Grid>
                  
                </Grid>
            </CardContent>
            </Card>
        )
}



