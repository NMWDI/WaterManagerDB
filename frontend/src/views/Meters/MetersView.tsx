import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MeterSelection from './MeterSelection/MeterSelection'
import MeterDetailsFields from './MeterDetailsFields'
import MeterHistory from './MeterHistory/MeterHistory'

import { Grid, Box } from '@mui/material'

type MeterInfo = {
    meter_serialnumber: string
    meter_id: number
}

// Main view for the Meters page
// Can pass state to this view to pre-select a meter and meter history using React Router useLocation
export default function MetersView() {
    const location = useLocation()  
    const [selectedMeter, setSelectedMeter] = useState<MeterInfo>()
    const [meterAddMode, setMeterAddMode] = useState<boolean>(false)

    // If the page is loaded with state from WorkOrder, I need to get the meter ID using the serial number provided in the state
    useEffect(() => {
        console.log(location.state)
    }, [location.state])

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
                <Grid id="history_section" container item xs={12} sx={{pt: 2}}>
                    <MeterHistory selectMeterSerialNumber={selectedMeter?.meter_serialnumber} selectedMeterID={selectedMeter?.meter_id}/>
                </Grid>
            </Box>

    )
}
