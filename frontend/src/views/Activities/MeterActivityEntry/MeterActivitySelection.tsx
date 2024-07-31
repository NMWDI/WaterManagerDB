import React, { useEffect } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Grid } from '@mui/material'

import { SecurityScope } from '../../../interfaces'
import ControlledMeterSelection from '../../../components/RHControlled/ControlledMeterSelection'
import ControlledActivitySelect from '../../../components/RHControlled/ControlledActivitySelect'
import ControlledUserSelect from '../../../components/RHControlled/ControlledUserSelect'
import ControlledDatepicker from '../../../components/RHControlled/ControlledDatepicker'
import ControlledTimepicker from '../../../components/RHControlled/ControlledTimepicker'
import ControlledCheckbox from '../../../components/RHControlled/ControlledCheckbox'
import { ControlledWorkOrderSelect } from '../../../components/RHControlled/ControlledWorkOrderSelect'

{/* Controls the selection of the meter, activity, user, and other fields from 'Activity Details' */}
export function MeterActivitySelection({control, errors, watch, setValue}: any) {
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    // Clear the work order selection when the user changes
    useEffect(() => {
        setValue('activity_details.work_order_id', null)
    }, [watch('activity_details.user')])

    return (
        <Grid container item>
        <h4 className="custom-card-header-small" style={{marginTop: 0, marginBottom: '20px', width: '100%'}}>Activity Details</h4>

            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <ControlledMeterSelection
                        name="activity_details.selected_meter"
                        control={control}
                        error={errors?.activity_details?.selected_meter?.message}
                    />
                </Grid>

                <Grid item xs={4}>
                    <ControlledActivitySelect
                        name="activity_details.activity_type"
                        control={control}
                        error={errors?.activity_details?.activity_type?.message}
                    />
                </Grid>

                <Grid item xs={4}>
                    <ControlledUserSelect
                        name="activity_details.user"
                        control={control}
                        errors={errors}
                        //hideAndSelectCurrentUser={!hasAdminScope}
                        hideAndSelectCurrentUser={false}  //Temporary disable of this admin feature
                        setValue={setValue}
                        error={errors?.activity_details?.user?.message}
                    />
                </Grid>
            </Grid>

            <Grid container item xs={12} sx={{mt: 1}} spacing={2}>
                <Grid item xs={4}>
                    <ControlledDatepicker
                        label="Date"
                        name="activity_details.date"
                        control={control}
                        error={errors?.activity_details?.date?.message}
                        sx={{width: '100%'}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTimepicker
                        label="Start Time"
                        name="activity_details.start_time"
                        control={control}
                        error={errors?.activity_details?.start_time?.message}
                        sx={{width: '100%'}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTimepicker
                        label="End Time"
                        name="activity_details.end_time"
                        control={control}
                        error={errors?.activity_details?.end_time?.message}
                        sx={{width: '100%'}}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={12} sx={{mt: 1}} spacing={2}>
                <Grid item xs={4}>
                    <ControlledWorkOrderSelect
                        name="activity_details.work_order_id"
                        control={control}
                        option_filters={{assigned_user_id: watch('activity_details.user')?.id}}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={12} sx={{mt: 1}} spacing={2}>
                <Grid item xs={4}>
                    <ControlledCheckbox
                        name="activity_details.share_ose"
                        control={control}
                        label="Share activity with OSE"
                        labelPlacement="start"
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}
