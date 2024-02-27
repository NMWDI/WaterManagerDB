//Modal for merging one well into another. Used on Wells Detail Component

import {
    Box,
    Modal,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid
} from "@mui/material";
import { useState } from 'react'
import React from 'react'

interface NewMeasurementModalProps {
    isWellMergeModalOpen: boolean
    handleCloseMergeModal: () => void
    handleSubmit: () => void
  }

export function MergeWellModal({isWellMergeModalOpen, handleCloseMergeModal, handleSubmit}: NewMeasurementModalProps) {
    //TODO: Add functionality to merge wells


    return (
        <Modal
            open={isWellMergeModalOpen}
            onClose={handleCloseMergeModal}
        >
            <Box style={{
                position: 'absolute' ,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                paddingRight: 20,
                paddingBottom: 20,
                boxShadow: '24',
                borderRadius: 15,
                paddingLeft: 25}}
            >
                <Grid item xs={6}>
                    <h1>Test the Modal</h1>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        Testing
                    </Grid>
                    
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                       Testing
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        Testing
                    </Grid>
                    <Grid container item xs={3} sx={{mr: 'auto', ml: 'auto'}}>
                        <Button type="submit" variant="contained" onClick={handleSubmit}>Merge</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}
