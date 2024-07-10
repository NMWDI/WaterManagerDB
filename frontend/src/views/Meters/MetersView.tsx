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
    const [selectedMeter, setSelectedMeter] = useState<MeterInfo>(location.state)
    const [meterAddMode, setMeterAddMode] = useState<boolean>(false)

    useEffect(() => {
        // Check if there is a hash in the URL
        if (location.hash) {
        console.log('should be scrolling to history section')
          // Remove the '#' from the hash
          const id = location.hash.replace('#', '');
          // Find the element with the corresponding 'id'
          const element = document.getElementById(id);
          if (element) {
            // Scroll to the element
            element.scrollIntoView({ behavior: 'smooth' });
          }else{
            console.log('element not found')
          }
        }
      }, []); // Re-run the effect if the location changes

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
