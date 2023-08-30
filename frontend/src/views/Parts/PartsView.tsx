import React, { useEffect, useState } from 'react'
import PartsTable from './PartsTable'
import { Box, Chip, Grid, TextField } from '@mui/material'
import PartDetailsCard from './PartDetailsCard'
import SearchIcon from '@mui/icons-material/Search';

function TristateToggle({ label, onToggle }: any) {
    const [toggleState, setToggleState] = useState<boolean>()

    useEffect(() => {
        onToggle(toggleState)
    }, [toggleState])

    function getColor() {
        switch (toggleState) {
            case true:
                return "success"
            case false:
                return "error"
            default:
                return undefined
        }
    }

    function getLabel() {
        switch (toggleState) {
            case true:
                return "Is " + label
            case false:
                return "Is Not " + label
            default:
                return label
        }
    }

    return (
        <Chip
            sx={{ml: 2}}
            label={getLabel()}
            color={getColor()}
            onDelete={toggleState != undefined ? () => setToggleState(undefined) : undefined}
            onClick={() => setToggleState(!toggleState)}
        />
    )
}

// need to handle part/meter_type associations
// need to have part type management
// need to connect search box to filterModel of table

export default function PartsView() {
    const [selectedPartID, setSelectedPartID] = useState<number>()
    const [partAddMode, setPartAddMode] = useState<boolean>(false)
    const [partSearchQuery, setPartSearchQuery] = useState<string>()

    useEffect(() => {setPartAddMode(false)}, [selectedPartID]) // Exit add mode when part is selected from table

    return (
        <Box sx={{m: 2, mt: 0, width: '100%'}}>
            <h2>Parts</h2>

            <Grid container spacing={2}>
                <Grid container item xs={6} sx={{mb: 1}} spacing={2}>
                    <Grid item xs={5}>
                        <TextField
                            label={<div style={{display: 'inline-flex', alignItems: 'center'}}><SearchIcon sx={{fontSize: '1.2rem'}}/> <span style={{marginTop: 1}}>&nbsp;Search Parts</span></div>}
                            variant="outlined"
                            size="small"
                            value={partSearchQuery}
                            onChange={(event: any) => setPartSearchQuery(event.target.value)}
                        />
                    </Grid>
 {/*
                    <Grid item xs={7}>
                        <div style={{float: 'right'}}>
                            <TristateToggle
                                label="Retired"
                                onToggle={(state: boolean | undefined) => {console.log("STATE: ", state)}}
                            />
                            <TristateToggle
                                label="Commonly Used"
                                onToggle={(state: boolean | undefined) => {console.log("STATE: ", state)}}
                            />
                        </div>
                    </Grid>
     */}
                </Grid>
            </Grid>

            {/*  Have this height match card height */}
            <Grid container sx={{height: '40%'}} spacing={2}>
                <Grid item xs={7}>
                    <PartsTable
                        setSelectedPartID={setSelectedPartID}
                        setPartAddMode={setPartAddMode}
                        partSearchQuery={partSearchQuery}
                    />
                </Grid>
                <Grid item xs={4}>
                    <PartDetailsCard
                        selectedPartID={selectedPartID}
                        partAddMode={partAddMode}
                    />
                </Grid>
            </Grid>

            {/*  Add part type table here? */}
        </Box>
    )
}
