import * as React from 'react'
import {GridValueGetterParams} from "@mui/x-data-grid";
import TableView from "./tableView";
import {useEffect, useRef, useState} from "react";
import MapView from "./MapView";
import {useMap} from "react-leaflet";
import L from 'leaflet'
import {fetchAPI, makeAPIPath} from './util'

const defaultZoom = 10
const defaultCenter = [34,-105.5]
export default function WellsView(){
    const [availableMeters, setavailableMeters] = useState([])
    const [availableOwners, setavailableOwners] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [zoom, setZoom] = useState(10)
    const [markers, setMarkers] = useState([])

    const mapRef = useRef();
    function handleOnSetView(params){
        const { current = {} } = mapRef;
        //
        let cen = [params.latitude, params.longitude]
        // console.log('center',center)
        // L.marker(center).addTo(current);
        // setMarkers([L.latLng(cen[0], cen[1])])
        setMarkers([cen])
        current.setView(cen, zoom);

    }

    useEffect(()=>{
        if (!loaded){
            setLoaded(true)

            fetchAPI('/meters', (data)=>{
                let meters = data.map((d)=>({value: d.id, label: d.serial_number}))
                setavailableMeters(meters)
            })

            fetchAPI('/owners', (data)=>{
                let owners = data.map((d)=>({value: d.id, label: d.name}))
                setavailableOwners(owners)
            })
        }
    })
    return (
        <div className='flex-container'>
            <div className='flex-child'>
                <TableView
                    onRowSelect={handleOnSetView}
                    urltag={'/wells'}
                    tag={'Well'}
                    fields={[{field: 'id', headerName: 'ID', width: 90},
                        {field: 'osepod', headerName: 'OSE POD', width: 120},
                        // { field: 'name', headerName: 'Name', width: 90 },
                        {field: 'location', headerName: 'Location', width: 120},
                        // { field: 'ownername', headerName: 'Owner', width: 90 ,
                        // valueGetter: (params: GridValueGetterParams) => `${params.row.owner?params.row.owner.name: ""}`},

                        {
                            field: 'owner_id', headerName: 'Owner', editable: true,
                            type: 'singleSelect', valueOptions: availableOwners,
                            valueFormatter: (params) => {
                                let m = availableOwners.filter((m) => (m.value === params.value))[0]
                                return m ? m.label : ''
                            },
                            width: 120
                        },
                        {
                            field: 'meter_id', headerName: 'Meter', editable: true,
                            width: 120,
                            type: 'singleSelect', valueOptions: availableMeters,
                            valueFormatter: (params) => {
                                // console.log(availableMeters, params.value)
                                let m = availableMeters.filter((m) => (m.value === params.value))[0]
                                return m ? m.label : ''
                            }
                        }
                        // {field: 'metername', headerName: 'Meter', width: 90,
                        // valueGetter: (params: GridValueGetterParams) => `${params.row.meter?params.row.meter.name: ""}`
                        // }
                    ]}
                />
            </div>
            <div className="flex-child">
                <MapView
                    markers={markers}
                    mapRef={mapRef}
                    center={defaultCenter}
                    zoom={defaultZoom}/>
            </div>
        </div>

    )
}

// import {Component} from "react";
// import WellTable from "./WellTable";
// import ReadingsTable from "./ReadingsTable";
// import {Box} from "@mui/material";
//
//
// class WellView extends Component{
//     constructor(props) {
//         super(props);
//         this.state = {readings: []}
//         this.handleRowSelect = this.handleRowSelect.bind(this)
//     }
//
//     handleRowSelect(row){
//         let url = 'http://'+process.env.REACT_APP_API_URL+'/wellreadings/'+row.id
//         fetch(url).then((data)=>data.json()).then((data) =>
//         this.setState({readings: data})
//         )
//     }
//
//     render(){
//         return (<Box sx={{ height: 400, width: '100%' }}>
//                    <h2>Wells</h2>
//                     <WellTable onRowSelect={this.handleRowSelect}/>
//                     <div>
//                         <h2>Readings</h2>
//                         <ReadingsTable readings={this.state.readings}/>
//                     </div>
//         </Box>)
//
//     }
// }
//
// export default WellView;