//Modal for merging one well into another. Used on Wells Detail Component

import {
    Box,
    Modal,
    Button,
    Grid
} from "@mui/material";
import { useState } from 'react'
import React from 'react'
import { useMergeWells } from "../service/ApiServiceNew";
import WellSelection from "./WellSelection";
import { Well } from '../interfaces'

//Interface for Modal
//Errors are handled by the API service
//handleSuccess is passed from parent and is likely used for a snackbar message
interface NewMeasurementModalProps {
    isWellMergeModalOpen: boolean
    handleCloseMergeModal: () => void
    handleSuccess: () => void
    mergeWell_raNumber: string
  }

export function MergeWellModal({isWellMergeModalOpen, handleCloseMergeModal, handleSuccess, mergeWell_raNumber}: NewMeasurementModalProps) {
    //Create state variable targetWell
    const [targetWell, setTargetWell] = useState<Well | null>(null)

    const mergeWells = useMergeWells(handleSuccess)

    //Create function to handle submit
    const handleSubmit = () => {
        let targetWell_raNumber = targetWell?.ra_number ?? ''
        console.log('Merging well: ' + mergeWell_raNumber + ' into ' + targetWell_raNumber)
        mergeWells.mutate({merge_well: mergeWell_raNumber, target_well: targetWell_raNumber})
        setTargetWell(null)
        handleCloseMergeModal()
    }

    //Clear targetWell on cancel button
    const handleCancelMergeModal = () => {
        setTargetWell(null)
        handleCloseMergeModal()
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
                        Merge all meter history from {mergeWell_raNumber} into target well:
                    </Grid>
                    <Grid container item xs={12} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <WellSelection selectedWell={targetWell} onSelection={setTargetWell} />
                    </Grid>
                    <Grid container item xs={6} sx={{mr: 'auto', ml: 'auto'}}>
                        <Button type="submit" variant="contained" onClick={handleSubmit}>Merge</Button>
                        <Button variant="contained" onClick={handleCancelMergeModal}>Cancel</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}
