import React, { useEffect } from 'react'
import { useState } from 'react'

import MeterSelection from './MeterSelection/MeterSelection'
import MeterDetailsFields from './MeterDetailsFields'
import MeterHistory from './MeterHistory/MeterHistory'

import { Grid, Box } from '@mui/material'

type MeterInfo = {
    meter_serialnumber: string
    meter_id: number
}

export default function MetersView() {
    const [selectedMeter, setSelectedMeter] = useState<MeterInfo>()
    const [meterAddMode, setMeterAddMode] = useState<boolean>(false)

    useEffect(() => {
        if (selectedMeter) setMeterAddMode(false)
        console.log(selectedMeter)
    }, [selectedMeter])

    return (
            <Box sx={{height: '100%', m: 2, mt: 0}}>
                <h2 style={{color: "#292929", fontWeight: '500'}}>Meter Information</h2>

                {/* Top half of page: MeterSelection, MeterDetails */}
                <Grid container item spacing={2} sx={{minHeight: {xs: '100vh', lg: '60vh'}}}>
                    <Grid item xs={6}>
                        <MeterSelection onMeterSelection={setSelectedMeter} setMeterAddMode={setMeterAddMode}/>
                    </Grid>
                    <Grid item xs={6}>
                        <MeterDetailsFields selectedMeterID={selectedMeter?.meter_id} meterAddMode={meterAddMode}/>
                    </Grid>
                </Grid>

                {/* Bottom half of page: MeterHistory */}
                <Grid container item xs={12} sx={{pt: 2}}>
                    <MeterHistory selectMeterSerialNumber={selectedMeter?.meter_serialnumber} selectedMeterID={selectedMeter?.meter_id}/>
                </Grid>
            </Box>

    )
}
