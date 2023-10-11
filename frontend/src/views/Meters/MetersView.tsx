import React, { useEffect } from 'react'
import { useState } from 'react'

import MeterSelection from './MeterSelection/MeterSelection'
import MeterDetailsFields from './MeterDetailsFields'
import MeterHistory from './MeterHistory/MeterHistory'

import { Grid, Box } from '@mui/material'

export default function MetersView() {
    const [selectedMeterID, setSelectedMeterID] = useState<number>()
    const [meterAddMode, setMeterAddMode] = useState<boolean>(false)

    useEffect(() => {
        if (selectedMeterID) setMeterAddMode(false)
    }, [selectedMeterID])

    return (
            <Box sx={{height: '100%', m: 2, mt: 0}}>
                <h2 style={{color: "#292929", fontWeight: '500'}}>Meter Information</h2>

                {/* Top half of page: MeterSelection, MeterDetails */}
                <Grid container item spacing={2} sx={{minHeight: {xs: '100vh', lg: '60vh'}}}>
                    <Grid item xs={6}>
                        <MeterSelection onMeterSelection={setSelectedMeterID} setMeterAddMode={setMeterAddMode}/>
                    </Grid>
                    <Grid item xs={6}>
                        <MeterDetailsFields selectedMeterID={selectedMeterID} meterAddMode={meterAddMode}/>
                    </Grid>
                </Grid>

                {/* Bottom half of page: MeterHistory */}
                <Grid container item xs={12} sx={{pt: 2}}>
                    <MeterHistory selectedMeterID={selectedMeterID}/>
                </Grid>
            </Box>

    )
}
