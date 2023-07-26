import React from 'react'
import { useState, forwardRef } from 'react'
import { produce } from 'immer'
import {
    Box,
    TextField,
    Grid,
} from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'

import { gridBreakpoints, toggleStyle } from '../ActivitiesView'
import { ActivityForm, ServiceTypeLU } from '../../../interfaces'
import { useApiGET } from '../../../service/ApiService'

interface MaintenanceRepairSelectionProps {
    activityForm: React.MutableRefObject<ActivityForm>
    meterID: number | null
}

export const MaintenanceRepairSelection = forwardRef(({activityForm, meterID}: MaintenanceRepairSelectionProps, submitRef) => {

    // Exposed submit function to allow parent to request the form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.maintenance_repair = {
                    service_type_ids: selectedIDs,
                    description: description
                }
            }
        }
    })

    const [serviceTypes, setServiceTypes] = useApiGET<ServiceTypeLU[]>('/service_types', [])
    const [description, setDescription] = useState<string>('')
    const [selectedIDs, setSelectedIDs] = useState<number[]>([])

    function isSelected(ID: number) {
        return selectedIDs.some(x => x == ID)
    }

    function unselectItem(ID: number) {
        setSelectedIDs(produce(selectedIDs, newIDs => {return newIDs.filter(x => x != ID)}))
    }

    function selectItem(ID: number) {
        setSelectedIDs(produce(selectedIDs, newIDs => {newIDs.push(ID)}))
    }

    function MaintanenceToggleButton({item}: any) {
        return (
            <Grid item xs={4} key={item.id}>
                <ToggleButton
                    value="check"
                    color="primary"
                    selected={isSelected(item.id)}
                    fullWidth
                    onChange={() => {isSelected(item.id) ? unselectItem(item.id) : selectItem(item.id)}}
                    sx={toggleStyle}
                >
                    {item.service_name}
                </ToggleButton>
            </Grid>
        )
    }

    return (
        <Box sx={{mt: 6}}>
            <h4>Maintanence/Repair</h4>
            <Grid container>

                <Grid container item xs={12}>
                    <Grid container item {...gridBreakpoints} spacing={2}>

                        {serviceTypes.map((item: any) => {
                                return <MaintanenceToggleButton item={item} />
                        })}
                    </Grid>
                </Grid>

                <Grid container item {...gridBreakpoints} sx={{mt: 2}}>
                    <TextField
                        label={'Description'}
                        value={description}
                        onChange={(event: any) => {setDescription(event.target.value)}}
                        multiline
                        fullWidth
                        rows={3}
                    />
                </Grid>

            </Grid>
        </Box>
    )
})
