import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import WellsTable from './WellsTable'
import { Well } from '../../interfaces'
import WellDetailsCard from './WellDetailsCard'

export default function WellManagementView() {
    const [wellAddMode, setWellAddMode] = useState<boolean>(true)
    const [selectedWell, setSelectedWell] = useState<Well>()

    // Exit add mode when table row is selected
    useEffect(() => {
        if(selectedWell) setWellAddMode(false)
    }, [selectedWell])

    return (
        <Box sx={{m: 2, mt: 0, width: '100%'}}>

        <h2 style={{color: "#292929", fontWeight: '500'}}>Manage Wells</h2>

            <Grid container spacing={2}>
                <Grid container item spacing={2} sx={{minHeight: {xs: '100vh', lg: '70vh'}}}>
                    <Grid item xs={7}>
                        <WellsTable
                            setSelectedWell={setSelectedWell}
                            setWellAddMode={setWellAddMode}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <WellDetailsCard
                            selectedWell={selectedWell}
                            wellAddMode={wellAddMode}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}
