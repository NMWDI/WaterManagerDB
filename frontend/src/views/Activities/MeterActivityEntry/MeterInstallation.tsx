import React from 'react'
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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
            <h4 className="custom-card-header-small" style={{marginTop: 0, marginBottom: '20px', width: '100%'}}>Current Installation</h4>
            <Grid item xs={12}>
                <TableContainer sx={{ mb:3, mt: 2}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '25%' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '25%' }}>TRSS</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '50%' }}>Lat/Long</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontSize: '1rem' }}>{ watch("current_installation.meter.status.status_name") ?? '' }</TableCell>
                                <TableCell sx={{ fontSize: '1rem' }}>{ watch("current_installation.well")?.location?.trss ?? '' }</TableCell>
                                <TableCell sx={{ fontSize: '1rem' }}>
                                    { watch("current_installation.well").location.latitude == null ? '--': watch("current_installation.well").location.latitude.toFixed(6)+', '+ watch("current_installation.well").location.longitude.toFixed(6) }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                    <ControlledTextbox
                        name="current_installation.meter.contact_name"
                        control={control}
                        label={"Contact Name"}
                        value={watch("current_installation.meter")?.contact_name ?? ''}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ControlledTextbox
                        name="current_installation.meter.contact_phone"
                        control={control}
                        label={"Contact Phone"}
                        value={watch("current_installation.meter")?.contact_phone ?? ''}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ControlledWellSelection
                        name="current_installation.well"
                        control={control}
                        disabled={!isActivity([ActivityType.Install])}
                        error={errors?.current_installation?.well.message}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ControlledTextbox
                        name="current_installation.meter.well_distance_ft"
                        control={control}
                        label={"Well Distance (in)"}
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
