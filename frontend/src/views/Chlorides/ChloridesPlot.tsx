import { Box } from "@mui/material";
import Plot from 'react-plotly.js';
import React from 'react'

interface ChloridesPlotProps {
    manual_dates: Date[]
    manual_vals: number[]
    isLoading: boolean
}

export function ChloridesPlot({manual_dates, manual_vals, isLoading} : ChloridesPlotProps){
    return(
        <Box sx={{ height: 600, width: 700 }}>
            {isLoading ?
                <div>LOADING...</div> :
                <Plot
                    data={[
                        {
                            x: manual_dates,
                            y: manual_vals,
                            type: 'scatter',
                            mode: 'markers',
                            marker: {color: 'red'},
                            name: 'Manual'
                        }
                    ]}
                    layout={{
                        width: 800,
                        height: 600,
                        title: "Micrograms Per Liter (ug/L)",
                        titlefont: {size: 18},
                        legend: {
                            title: {
                                text: 'Datastreams',
                                font: {size: 14}
                            },
                        },
                        xaxis: {
                            title: {
                                text: 'Date',
                                font: {size: 16}
                            }
                        },
                        yaxis: {
                            title: {
                                text: 'Micrograms Per Liter (ug/L)',
                                font: {size: 16}
                            }
                        }
                    }}
                />
            }
        </Box>
    )
}
