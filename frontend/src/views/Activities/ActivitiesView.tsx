import React from 'react'
import { useState } from 'react'
import { Box, Tabs, Tab, Grid } from '@mui/material'
import TabPanel from '../../components/TabPanel'

import MeterActivitySelection from './MeterActivityEntry/MeterActivitySelection'
import ObservationSelection from './MeterActivityEntry/ObservationsSelection'
import NotesSelection from './MeterActivityEntry/NotesSelection'
import MeterInstallation from './MeterActivityEntry/MeterInstallation'
import MaintenenceRepairSelection from './MeterActivityEntry/MaintenanceRepairSelection'
import PartsSelection from './MeterActivityEntry/PartsSelection'

export const gridBreakpoints = {xs: 12, md: 10, xl:5}
export const toggleStyle = { '&.Mui-selected':{'borderColor':'blue','border': 1}}

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

                {/*  Activities Form */}
                <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                    <MeterActivitySelection />
                    <MeterInstallation />
                    <ObservationSelection />
                    <MaintenenceRepairSelection />
                    <NotesSelection />
                    <PartsSelection />
                </TabPanel>

                {/*  Work Order Form */}
                <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                    <div>Not Yet Implemented</div>
                </TabPanel>
            </Box>
        </Box>
    )
}
