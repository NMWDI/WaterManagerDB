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
    raNumber: string
  }

export function MergeWellModal({isWellMergeModalOpen, handleCloseMergeModal, handleSuccess, raNumber}: NewMeasurementModalProps) {
    //Create state variable targetWell
    const [targetWell, setTargetWell] = useState<string>('')

    const mergeWells = useMergeWells(handleSuccess)

    //Create function to handle submit
    const handleSubmit = () => {
        console.log('Merging well: ' + raNumber + ' into ' + targetWell)
        mergeWells.mutate({merge_well: raNumber, target_well: targetWell})
        handleCloseMergeModal()
    }

    //Handle well selection
    function handleWellSelection(selectedWell: Well) {
        console.log('Selected well: ' + selectedWell)
        setTargetWell(selectedWell.ra_number)
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
                        <WellSelection selectedWell={targetWell} onSelection={handleWellSelection} />
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
