//A custom version of MUI select that uses the Chip component to display selected items.

import React, { useEffect } from 'react'

import { Box, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'

interface chipselectitem {
    id: number
    name: string
}

interface chipselectprops {
    selected_values?: chipselectitem[]
    options?: chipselectitem[]
    label: string
    onSelect: (select_item: chipselectitem) => void
    onDelete: (delete_id: number) => void
}

export default function ChipSelect({selected_values, options, label, onSelect, onDelete}: chipselectprops) {
        
        return(
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={selected_values ?? []}
                    onChange={(event: any) => onSelect(event.target.value)}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value, index) => (
                                <Chip
                                    key={value.id}
                                    label={value.name}
                                    clickable
                                    deleteIcon={
                                        <CancelIcon
                                            onMouseDown={(event: any) => event.stopPropagation()}
                                        />
                                    }
                                    onDelete={() => onDelete(value.id)}
                                />
                            ))}
                        </Box>
                    )}
                >

                {/* Option list (with selected values filtered out)  */}
                {options?.map((option: chipselectitem) => 
                    <MenuItem value={option.id}>{option.name}</MenuItem>
                )}
                {/* {meterTypeList.data?.
                    filter(x => !watch("meter_types")?.map(scope => scope.id).includes(x.id))
                    .map((type: MeterTypeLU) =>
                            <MenuItem value={type.id}>{`${type.brand} - ${type.model}`}</MenuItem>
                )} */}
                </Select>
            </FormControl>
        )
}