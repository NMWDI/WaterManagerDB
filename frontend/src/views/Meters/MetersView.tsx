import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MeterSelection from './MeterSelection/MeterSelection'
import MeterDetailsFields from './MeterDetailsFields'
import MeterHistory from './MeterHistory/MeterHistory'

import { Grid, Box } from '@mui/material'

type MeterInfo = {
    meter_sn: string
    meter_id: number
}

// Main view for the Meters page
// Can pass state to this view to pre-select a meter and meter history using React Router useLocation
export default function MetersView() {
    const location = useLocation()  
    const [selectedMeter, setSelectedMeter] = useState<MeterInfo>()
    const [meterAddMode, setMeterAddMode] = useState<boolean>(false)

    // Load page in different ways depending on if/how location.state is defined
    // If meter_sn and meter_id are defined, pre-select the meter and load the history
    // if activity_id is defined... todo
    useEffect(() => {
        if (location.state) {
            const { meter_sn, meter_id } = location.state as MeterInfo
            if (meter_sn && meter_id) {
                setSelectedMeter({ meter_sn, meter_id })
            }
            // Handle other cases like activity_id here
            //TODO
        }
    }, [location.state])



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
                    <MeterHistory selectMeterSerialNumber={selectedMeter?.meter_sn} selectedMeterID={selectedMeter?.meter_id}/>
                </Grid>
            </Box>

    )
}
