import React from 'react'
import {
    Box,
    Grid,
} from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import { useFieldArray } from 'react-hook-form'
import ControlledTextbox from '../../../components/RHControlled/ControlledTextbox'
import { gridBreakpoints, toggleStyle } from '../ActivitiesView'
import { useGetServiceTypes } from '../../../service/ApiServiceNew'

{/* Controls working status and any selected service types  */}
export default function MaintenanceRepairSelection ({control, errors, watch, setValue}: any) {
    const serviceTypes = useGetServiceTypes()

    // React hook formarray
    const { append, remove } = useFieldArray({
        control, name: "maintenance_repair.service_type_ids"
    })

    function isSelected(ID: number) {
        return watch("maintenance_repair.service_type_ids")?.some((x: any) => x == ID)
    }

    function unselectItem(ID: number) {
        const index = watch("maintenance_repair.service_type_ids")?.findIndex((x: any) => x == ID)
        remove(index)
    }

    function selectItem(ID: number) {
        append(ID)
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

                {serviceTypes.isLoading ?
                    <Grid container item xs={12}>
                        Loading items...
                    </Grid> :
                    <Grid container item xs={12}>
                        <Grid container item {...gridBreakpoints} spacing={2}>

                            {serviceTypes.data?.map((item: any) => {
                                return <MaintanenceToggleButton
                                            key={item.id}
                                            item={item}
                                        />
                            })}
                        </Grid>
                    </Grid>
                }

                <Grid container item {...gridBreakpoints} sx={{mt: 2}}>
                    <ControlledTextbox
                        name="maintenance_repair.description"
                        control={control}
                        error={errors?.maintenance_repair?.description?.message}
                        label={'Description'}
                        rows={3}
                        multiline
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
