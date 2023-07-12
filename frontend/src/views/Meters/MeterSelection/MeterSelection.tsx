import React from 'react'
import { useState } from 'react'

import MeterSelectionTable from './MeterSelectionTable'
import MeterSelectionMap from './MeterSelectionMap'

import { Box, Tabs, Tab, TextField, Grid } from '@mui/material'

interface TabPanelProps {
    children?: React.ReactNode
    tabIndex: number
    currentTabIndex: number
}

interface MeterSelectionProps {
  onMeterSelection: Function
}

function TabPanel({children, tabIndex, currentTabIndex}: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={currentTabIndex !== tabIndex}
            id={`simple-tabpanel-${tabIndex}`}
            style={{height: '100%'}}
        >
            {currentTabIndex == tabIndex && (
                <>
                    {children}
                </>
            )}
        </div>
    )
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
                        <MeterSelectionMap onMeterSelection={onMeterSelection}/>
                    </TabPanel>
                </Box>
            </Box>
        )
}
