//Blank card to display when no history item is selected

import React from 'react'
import { Grid, Card, CardContent, CardHeader } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

//A blank card to display when no history item is selected
export default function SelectedBlankCard() {
    
    return (
            <Card>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>Selected Details</span>
                        <InfoOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent>
                <Grid container item xs={10}>

                    <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                        Select a history item to view details
                    </Grid>
                  
                </Grid>
            </CardContent>
            </Card>
        )
}



