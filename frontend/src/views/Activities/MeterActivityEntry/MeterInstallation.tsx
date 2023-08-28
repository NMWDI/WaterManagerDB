import React from 'react'
import {
    Grid,
} from '@mui/material'

import { gridBreakpoints } from '../ActivitiesView'
import { ActivityType } from '../../../enums'
import ControlledTextbox from '../../../components/RHControlled/ControlledTextbox'
import ControlledWellSelection from '../../../components/RHControlled/ControlledWellSelection'

{/* Controls fields of the current meter and well, also allows changing the current well if applicable */}
export default function MeterInstallation({control, errors, watch, setValue}: any) {
    function isActivity(activitiesList: ActivityType[]) {
        return activitiesList.some((type: ActivityType) => type == watch("activity_details.activity_type")?.name)
    }

    return (
        <Grid container item {...gridBreakpoints} sx={{mt: 6}}>
            <h4>Current Installation</h4>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.meter.status.status_name"
                        control={control}
                        label={"Current Meter Status"}
                        disabled={true}
                        error={errors?.current_installation?.meter?.status?.status_name?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledWellSelection
                        name="current_installation.well"
                        control={control}
                        disabled={!isActivity([ActivityType.Install])}
                        error={errors?.current_installation?.well.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.location.name"
                        control={control}
                        label={"Location Name"}
                        value={watch("current_installation.well")?.location?.name ?? ''} // Watch the highest level of the form that can change this value
                        disabled
                    />
                </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.ra_number"
                        control={control}
                        label={"RA Number"}
                        value={watch("current_installation.well")?.ra_number ?? ''}
                        disabled
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.osepod"
                        control={control}
                        label={"OSE Tag"}
                        value={watch("current_installation.well")?.osepod ?? ''}
                        disabled
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.location.trss"
                        control={control}
                        label={"TRSS"}
                        value={watch("current_installation.well")?.location?.trss ?? ''}
                        disabled
                    />
                </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.meter.contact_name"
                        control={control}
                        label={"Contact Name"}
                        value={watch("current_installation.meter")?.contact_name ?? ''}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.meter.contact_phone"
                        control={control}
                        label={"Contact Phone"}
                        value={watch("current_installation.meter")?.contact_phone ?? ''}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.meter.well_distance_ft"
                        control={control}
                        label={"Well Distance"}
                        value={watch("current_installation.meter")?.well_distance_ft ?? ''}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
                <ControlledTextbox
                    name="current_installation.meter.notes"
                    control={control}
                    label={"Meter Notes"}
                    value={watch("current_installation.meter")?.notes ?? ''}
                    rows={3}
                    multiline
                />
            </Grid>
        </Grid>
    )
}
