import React from 'react'
import { useState } from 'react'

import MeterSelectionTable from './MeterSelectionTable'
import MeterSelectionMap from './MeterSelectionMap'
import TabPanel from '../../../components/TabPanel'

import { Box, Tabs, Tab, TextField, Grid, Card, CardContent, CardHeader, Button, ToggleButtonGroup, ToggleButton } from '@mui/material'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

interface MeterSelectionProps {
  onMeterSelection: Function
  setMeterAddMode: Function
}

export default function MeterSelection({onMeterSelection, setMeterAddMode}: MeterSelectionProps) {
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => setCurrentTabIndex(newTabIndex)

    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')

    return (
        <Card sx={{height: '100%'}}>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>All Meters</span>
                        <FormatListBulletedOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent sx={{height: '100%'}}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={4}>
                        <Tabs value={currentTabIndex} onChange={handleTabChange} >
                            <Tab label="Meter List" />
                            <Tab label="Meter Map" />
                        </Tabs>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{mt: 1}}
                            label="Search Meter"
                            variant="outlined"
                            size="small"
                            value={meterSearchQuery}
                            onChange={(e) => {setMeterSearchQuery(e.target.value)}}
                        />
                    </Grid>
                    <Grid item sx={{mt: 1}}>
                        <ToggleButtonGroup
                            value={[true, false, false]}
                            exclusive={false}
                            onChange={() => {console.log('clicked')}}
                            size='small'
                            aria-label="button group"
                        >
                            <ToggleButton value="installed" aria-label="installed">
                                Installed
                            </ToggleButton>
                            <ToggleButton value="stored" aria-label="stored">
                                Stored
                            </ToggleButton>
                            <ToggleButton value="other" aria-label="other">
                                Other
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Box sx={{height: '89%'}}>
                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                        <MeterSelectionTable onMeterSelection={onMeterSelection} meterSearchQuery={meterSearchQuery} setMeterAddMode={setMeterAddMode}/>
                    </TabPanel>

                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                        <MeterSelectionMap onMeterSelection={onMeterSelection} meterSearch={meterSearchQuery}/>
                    </TabPanel>
                </Box>
                </CardContent>
            </Card>
        )
}
