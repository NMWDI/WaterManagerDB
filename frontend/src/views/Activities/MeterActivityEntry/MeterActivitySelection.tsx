import React from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Grid } from '@mui/material'

import { gridBreakpoints } from '../ActivitiesView'
import { SecurityScope, ActivityFormControl } from '../../../interfaces'
import { FieldErrors, FieldValues, UseFormWatch } from 'react-hook-form'
import ControlledMeterSelection from '../../../components/RHControlled/ControlledMeterSelection'
import ControlledActivitySelect from '../../../components/RHControlled/ControlledActivitySelect'
import ControlledUserSelect from '../../../components/RHControlled/ControlledUserSelect'
import ControlledDatepicker from '../../../components/RHControlled/ControlledDatepicker'
import ControlledTimepicker from '../../../components/RHControlled/ControlledTimepicker'

interface MeterActivitySelectionProps {
    control: FieldValues
    errors: FieldErrors
    watch: UseFormWatch<ActivityFormControl>
    setValue: Function
}

// Child component as ref so that parent can call submit function
export function MeterActivitySelection({control, errors, watch, setValue}: MeterActivitySelectionProps) {
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    return (
        <Grid container item {...gridBreakpoints}>
            <h4>Activity Details</h4>

            {/* Start First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <ControlledMeterSelection
                        name="activity_details.meter"
                        control={control}
                        errors={errors}
                    />
                </Grid>

                <Grid item xs={4}>
                    <ControlledActivitySelect
                        name="activity_details.activity_type"
                        control={control}
                        errors={errors}
                    />
                </Grid>

                <Grid item xs={4}>
                    <ControlledUserSelect
                        name="activity_details.user"
                        control={control}
                        errors={errors}
                        hideAndSelectCurrentUser={!hasAdminScope}
                        setValue={setValue}
                    />
                </Grid>
            </Grid>
            {/* End First Row */}

            {/* Start Second Row */}
            <Grid container item xs={12} sx={{mt: 1}} spacing={2}>
                <Grid item xs={4}>
                    <ControlledDatepicker
                        label="Date"
                        name="activity_details.date"
                        control={control}
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTimepicker
                        label="Start Time"
                        name="activity_details.start_time"
                        control={control}
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTimepicker
                        label="End Time"
                        name="activity_details.end_time"
                        control={control}
                        errors={errors}
                    />
                </Grid>
            </Grid>
            {/* End Second Row */}

        </Grid>
    )
}
