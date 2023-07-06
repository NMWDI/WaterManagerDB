import React from 'react'
import { useState, useEffect } from 'react'

import MeterSelection from './MeterSelection/MeterSelection'
import MeterDetailsFields from './MeterDetailsFields'
import MeterHistory from './MeterHistory/MeterHistory'

import { Grid, Box } from '@mui/material'

export default function MetersView() {

    const [selectedMeterID, setSelectedMeterID] = useState(null)

    return (
            <Box sx={{width: '100vw', height: '100%', m: 2, mt: 0}}>
                <h2>Meters</h2>

                {/* Top half of page: MeterSelection, MeterDetails */}
                <Grid container spacing={6} sx={{}}>
                    <Grid item xs={5}>
                        <MeterSelection onMeterSelection={setSelectedMeterID}/>
                    </Grid>
                    <Grid item xs={7}>
                        <MeterDetailsFields selectedMeterID={selectedMeterID} />
                    </Grid>
                </Grid>

                {/* Bottom half of page: MeterHistory */}
                <Grid container item xs={12} sx={{pt: 2}}>
                    <MeterHistory selectedMeterID={selectedMeterID}/>
                </Grid>
            </Box>

    )
}
