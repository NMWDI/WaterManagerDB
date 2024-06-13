import React from 'react'
import { useState } from 'react'

import MeterSelectionTable from './MeterSelectionTable'
import MeterSelectionMap from './MeterSelectionMap'
import TabPanel from '../../../components/TabPanel'

import { Box, Tabs, Tab, TextField, Grid, Card, CardContent, CardHeader, Button, ToggleButtonGroup, ToggleButton } from '@mui/material'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { MeterStatusNames } from '../../../enums'

interface MeterSelectionProps {
  onMeterSelection: Function
  setMeterAddMode: Function
}

export default function MeterSelection({onMeterSelection, setMeterAddMode}: MeterSelectionProps) {
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterFilterButtons, setMeterFilterButtons] = useState<string[]>(['installed'])
    const [meterFilters, setMeterFilters] = useState<MeterStatusNames[]>([MeterStatusNames.Installed])

    const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => setCurrentTabIndex(newTabIndex)

    function handleFilterSelect(event: React.MouseEvent<HTMLElement>, newFilters: string[]) {
        console.log(newFilters)
        //If nothing selected, force the installed filter to be selected
        if (newFilters.length === 0) {
            newFilters.push('installed')
        }

        setMeterFilterButtons(newFilters)

        //Update the meterFilters based on the selected filter buttons
        let updatedMeterFilters: MeterStatusNames[] = []
        if (newFilters.includes('installed')) {
            updatedMeterFilters.push(MeterStatusNames.Installed)
        }
        if (newFilters.includes('stored')) {
            updatedMeterFilters.push(MeterStatusNames.Warehouse)
        }
        if (newFilters.includes('sold')) {
            updatedMeterFilters.push(MeterStatusNames.Sold)
        }
        if (newFilters.includes('other')) {
            updatedMeterFilters.push(MeterStatusNames.Scrapped)
            updatedMeterFilters.push(MeterStatusNames.Returned)
            updatedMeterFilters.push(MeterStatusNames.Unknown)
        }
        setMeterFilters(updatedMeterFilters)
    }

    

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
                            value={meterFilterButtons}
                            exclusive={false}
                            onChange={handleFilterSelect}
                            size='small'
                            aria-label="button group"
                        >
                            <ToggleButton value="installed" aria-label="Installed">
                                Installed
                            </ToggleButton>
                            <ToggleButton value="stored" aria-label="Stored">
                                Stored
                            </ToggleButton>
                            <ToggleButton value="sold" aria-label="Sold">
                                Sold
                            </ToggleButton>
                            <ToggleButton value="other" aria-label="Other">
                                Other
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Box sx={{height: '89%'}}>
                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                        <MeterSelectionTable onMeterSelection={onMeterSelection} meterSearchQuery={meterSearchQuery} meterStatusFilter={meterFilters} setMeterAddMode={setMeterAddMode}/>
                    </TabPanel>

                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                        <MeterSelectionMap onMeterSelection={onMeterSelection} meterSearch={meterSearchQuery}/>
                    </TabPanel>
                </Box>
                </CardContent>
            </Card>
        )
}
