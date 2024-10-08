import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MeterSelection from './MeterSelection/MeterSelection'
import MeterDetailsFields from './MeterDetailsFields'
import MeterHistory from './MeterHistory/MeterHistory'

import { Grid, Box } from '@mui/material'


// Main view for the Meters page
// Can pass state to this view to pre-select a meter and meter history using React Router useLocation
export default function MetersView() {
    const location = useLocation()  
    const [selectedMeter, setSelectedMeter] = useState<number>()
    const [meterAddMode, setMeterAddMode] = useState<boolean>(false)

    //Load page with a pre-selected meter as determined by query string
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const meter_id = searchParams.get('meter_id') as number | null
        const activity_id = searchParams.get('activity_id') as number | null
        console.log('activity_id: ', activity_id)

        if (meter_id !== null) {
            setSelectedMeter(meter_id)
        }

    }, [location.search])

    //Always set the meterAddMode to false when a new meter is selected 
    useEffect(() => {
        if (selectedMeter) {
            setMeterAddMode(false)
        }
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
                        <MeterDetailsFields selectedMeterID={selectedMeter} meterAddMode={meterAddMode}/>
                    </Grid>
                </Grid>

                {/* Bottom half of page: MeterHistory */}
                <Grid id="history_section" container item xs={12} sx={{pt: 2}}>
                    <MeterHistory selectedMeterID={selectedMeter}/>
                </Grid>
            </Box>

    )
}
