import { Box } from '@mui/material'
import { GridPagination } from '@mui/x-data-grid'
import React, { ReactNode } from 'react'

interface GridFooterWithButtonProps {
    button: ReactNode
}

export default function GridFooterWithButton({button}: GridFooterWithButtonProps) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{my: 'auto'}}>
                {button}
            </Box>
            <GridPagination />
        </Box>
    )
}
