import { Box } from "@mui/material";
import Plot from 'react-plotly.js';
import React from 'react'

interface MonitoringWellsPlotProps {
    manual_dates: Date[]
    manual_vals: number[]
    logger_dates: Date[]
    logger_vals: number[]
    isLoading: boolean
}

export function MonitoringWellsPlot({manual_dates, manual_vals, logger_dates, logger_vals, isLoading} : MonitoringWellsPlotProps){
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
                        },
                        {
                            x: logger_dates,
                            y: logger_vals,
                            type: 'scatter',
                            marker: {color: 'blue'},
                            name: 'Continuous'
                        }
                    ]}
                    layout={{
                        width: 800,
                        height: 600,
                        title: "Depth to Water Over Time",
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
                            autorange: 'reversed',
                            title: {
                                text: 'Depth to Water (ft)',
                                font: {size: 16}
                            }
                        }
                    }}
                />
            }
        </Box>
    )
}
