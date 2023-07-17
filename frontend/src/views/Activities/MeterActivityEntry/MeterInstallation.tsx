import React from 'react'

import {
    TextField,
    Grid,
} from '@mui/material'
import { gridBreakpoints } from '../ActivitiesView'

export default function MeterInstallation() {
    return (
        <Grid container item {...gridBreakpoints} sx={{mt: 6}}>
            <h4>Current Installation</h4>

            {/*  First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"Contact Name"}
                        variant="outlined"
                        size="small"
                        value={'Jake Smith'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"Contact Phone"}
                        variant="outlined"
                        size="small"
                        value={'(938) 993-9409'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"Organization"}
                        variant="outlined"
                        size="small"
                        value={'ROGERS'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/*  Second Row */}
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"Latitude"}
                        variant="outlined"
                        size="small"
                        value={'105.98'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"Longitude"}
                        variant="outlined"
                        size="small"
                        value={'34.988'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"TRSS"}
                        variant="outlined"
                        size="small"
                        value={'trss2'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/*  Third Row */}
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"RA Number"}
                        variant="outlined"
                        size="small"
                        value={'8837-gdd'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"OSE Tag"}
                        variant="outlined"
                        size="small"
                        value={'tag2'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        key={1}
                        label={"Well Distance"}
                        variant="outlined"
                        size="small"
                        value={'506 ft'}
                        onChange={() => {}}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}
