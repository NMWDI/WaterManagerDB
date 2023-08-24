import React from 'react'
import {
    Grid,
} from '@mui/material'

import { gridBreakpoints } from '../ActivitiesView'
import { ActivityForm, ActivityFormControl, Well } from '../../../interfaces'
import { ActivityType } from '../../../enums'
import { FieldErrors, FieldValues, UseFormWatch } from 'react-hook-form'
import ControlledTextbox from '../../../components/RHControlled/ControlledTextbox'
import ControlledWellSelection from '../../../components/RHControlled/ControlledWellSelection'

interface MeterInstallationProps {
    control: FieldValues
    errors: FieldErrors
    watch: UseFormWatch<ActivityFormControl>
    setValue: Function
}

export default function MeterInstallation({control, errors, watch, setValue}: MeterInstallationProps) {
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
                        erorrs={errors}
                        label={"Current Meter Status"}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledWellSelection
                        name="current_installation.well"
                        control={control}
                        errors={errors}
                        disabled={!isActivity([ActivityType.Install])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.location.name"
                        control={control}
                        erorrs={errors}
                        label={"Location Name"}
                        value={watch("current_installation.well")?.location?.name ?? ''}
                        disabled={true}
                    />
                </Grid>
            </Grid>

            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.ra_number"
                        control={control}
                        erorrs={errors}
                        label={"RA Number"}
                        value={watch("current_installation.well")?.ra_number ?? ''}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.osepod"
                        control={control}
                        erorrs={errors}
                        label={"OSE Tag"}
                        value={watch("current_installation.well")?.osepod ?? ''}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextbox
                        name="current_installation.well.location.trss"
                        control={control}
                        erorrs={errors}
                        label={"TRSS"}
                        value={watch("current_installation.well")?.location?.trss ?? ''}
                        disabled={true}
                    />
                </Grid>
            </Grid>

 {/*
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Contact Name"
                        value={contactName}
                        updateCallback={setContactName}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Contact Phone"
                        value={contactPhone}
                        updateCallback={setContactPhone}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Well Distance"
                        value={wellDistance ?? ''}
                        updateCallback={setWellDistance}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{mt: 2}}>
                <InstallationTextField
                    label="Installation Notes"
                    value={notes}
                    updateCallback={setNotes}
                    disabled={isActivity([ActivityType.Uninstall])}
                    rows={3}
                />
            </Grid>
     */}
        </Grid>
    )
}
