import React from 'react'
import { useState } from 'react'

import MeterSelectionTable from './MeterSelectionTable'
import MeterSelectionMap from './MeterSelectionMap'
import TabPanel from '../../../components/TabPanel'

import { Box, Tabs, Tab, TextField, Grid, Autocomplete } from '@mui/material'

interface MeterSelectionProps {
  onMeterSelection: Function
}

export default function MeterSelection({onMeterSelection}: MeterSelectionProps) {
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => setCurrentTabIndex(newTabIndex)

    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')

    return (
            <Box sx={{height: '100%'}}>
                <Box>
                    <Grid container>
                        <Grid item xs={9}>
                        <Tabs value={currentTabIndex} onChange={handleTabChange} >
                            <Tab label="Meter List" />
                            <Tab label="Meter Map" />
                        </Tabs>
                        </Grid>
                        <Grid item xs={3}>
                            {currentTabIndex == 0 &&
                                <TextField
                                    label="Search Meter"
                                    variant="outlined"
                                    size="small"
                                    value={meterSearchQuery}
                                    onChange={(e) => {setMeterSearchQuery(e.target.value)}}
                                />}
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{height: '89%'}}>
                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                        <MeterSelectionTable onMeterSelection={onMeterSelection} meterSearchQuery={meterSearchQuery} />
                    </TabPanel>

                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                        {/*  <MeterSelectionMap onMeterSelection={onMeterSelection}/> */}
                        Disabled until locations is fixed
                    </TabPanel>
                </Box>
            </Box>
        )
}
