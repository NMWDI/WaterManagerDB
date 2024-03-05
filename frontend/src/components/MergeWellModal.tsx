//Modal for merging one well into another. Used on Wells Detail Component

import {
    Box,
    Modal,
    Button,
    Grid
} from "@mui/material";
import { useState } from 'react'
import React from 'react'

interface NewMeasurementModalProps {
    isWellMergeModalOpen: boolean
    handleCloseMergeModal: () => void
    handleMergeError: (error: string) => void
    raNumber: string
  }

export function MergeWellModal({isWellMergeModalOpen, handleCloseMergeModal, handleMergeError, raNumber}: NewMeasurementModalProps) {
    //Create state variable targetWell
    const [targetWell, setTargetWell] = useState<string>('RA456-test')

    //Create function to handle submit
    const handleSubmit = () => {
        console.log('Merging well: ' + raNumber + ' into ' + targetWell)
        handleCloseMergeModal()

        //Simulate an error
        handleMergeError('Error merging well: ' + raNumber + ' into ' + targetWell)
    }

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
                <Grid item xs={12}>
                    <h2>Well Merge</h2>
                    <Grid container item xs={12} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        Merge all meter history from {raNumber} into target well:
                    </Grid>
                    <Grid container item xs={12} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        {targetWell}
                    </Grid>
                    <Grid container item xs={6} sx={{mr: 'auto', ml: 'auto'}}>
                        <Button type="submit" variant="contained" onClick={handleSubmit}>Merge</Button>
                        <Button variant="contained" onClick={handleCloseMergeModal}>Cancel</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}
