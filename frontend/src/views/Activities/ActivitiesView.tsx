import React from 'react'
import { useState, useEffect } from 'react'
import { Box, Tabs, Tab, TextField, Grid } from '@mui/material'
import TabPanel from '../../components/TabPanel'

import MeterActivitySelection from './MeterActivityEntry/MeterActivitySelection'
import ObservationSelection from './MeterActivityEntry/ObservationsSelection'

export default function ActivitiesView() {
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => setCurrentTabIndex(newTabIndex)

    return (
        <Box sx={{height: '100%', width: '100%', m: 2, mt: 0}}>
            <h2>PVACD Activities</h2>

            <Box>
                <Grid container>
                    <Grid item xs={9}>
                    <Tabs value={currentTabIndex} onChange={handleTabChange} >
                        <Tab label="Meter Activities" />
                        <Tab label="Work Order" />
                    </Tabs>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{height: '89%'}}>
                <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                    <MeterActivitySelection />
                    <ObservationSelection />
                </TabPanel>

                <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                    <div>Not Yet Implemented</div>
                </TabPanel>
            </Box>
        </Box>
    )
}
