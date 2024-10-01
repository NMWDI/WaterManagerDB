import React, {  useState } from 'react'

import { Card, CardHeader, CardContent, Grid, TextField, Tab, Tabs, Box } from '@mui/material'

import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SearchIcon from '@mui/icons-material/Search';

import TabPanel from '../../components/TabPanel'
import WellSelectionTable from './WellSelectionTable'
import WellSelectionMap from './WellSelectionMap';

interface WellsTableProps {
    setSelectedWell: Function,
    setWellAddMode: Function
}

export default function WellsTable({setSelectedWell, setWellAddMode}: WellsTableProps) {
    const [wellSearchQuery, setWellSearchQuery] = useState<string>('')
   
    // Start tab view list and map
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => setCurrentTabIndex(newTabIndex)
    // End 

    return (
        <Card sx={{height: '100%'}}>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>All Wells</span>
                        <FormatListBulletedOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent sx={{height: '100%'}}>
                <Grid container >
                <Grid item xs={9}>
                        <Tabs value={currentTabIndex} onChange={handleTabChange} >
                            <Tab label="Well List" />
                            <Tab label="Well Map" />
                        </Tabs>
                        </Grid>
                        <Grid item xs={3}>
                        <TextField
                            label={<div style={{display: 'inline-flex', alignItems: 'center'}}><SearchIcon sx={{fontSize: '1.2rem'}}/> <span style={{marginTop: 1}}>&nbsp;Search Wells</span></div>}
                            variant="outlined"
                            size="small"
                            value={wellSearchQuery}
                            onChange={(event: any) => setWellSearchQuery(event.target.value)}
                            sx={{marginBottom: '10px'}}
                        />
                        </Grid>
                   
                </Grid>
                <Box sx={{height: '89%'}}>
                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                        <WellSelectionTable setSelectedWell={setSelectedWell}  wellSearchQueryProp={wellSearchQuery} setWellAddMode={setWellAddMode}/>
                    </TabPanel>

                    <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                        <WellSelectionMap setSelectedWell={setSelectedWell} wellSearchQueryProp={wellSearchQuery}/>
                    </TabPanel>
                </Box>
               
            </CardContent>
        </Card>
    )
}
