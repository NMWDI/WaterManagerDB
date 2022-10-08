import * as React from 'react'
import {GridValueGetterParams} from "@mui/x-data-grid";
import TableView from "./tableView";
import {useEffect, useRef, useState} from "react";
import MapView from "./MapView";
import {useMap} from "react-leaflet";

// function useCenter(row){
//             console.log('asfdasdfasfd', row, [row.longitude, row.latitude])
//             const map = useMap();
//             // map.setView([row.longitude, row.latitude], 10);
//         }
const defaultZoom = 10
const defaultCenter = [34,-105.5]
export default function WellsView(){
    const [availableMeters, setavailableMeters] = useState([])
    const [availableOwners, setavailableOwners] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [zoom, setZoom] = useState(10)

    const mapRef = useRef();
    function handleOnSetView(params){
        const { current = {} } = mapRef;

        let center = [params.latitude, params.longitude]
        L.marker(center).addTo(current);
        current.setView(center, zoom);
    }

    useEffect(()=>{
        if (!loaded){
            setLoaded(true)
            let url = 'http://'+process.env.REACT_APP_API_URL+'/meters'
            fetch(url).then((data)=>data.json()).then((data)=>{
                let meters = data.map((d)=>({value: d.id, label: d.serialnumber}))
                setavailableMeters(meters)
            })

            url = 'http://'+process.env.REACT_APP_API_URL+'/owners'
            fetch(url).then((data)=>data.json()).then((data)=>{
                let owners = data.map((d)=>({value: d.id, label: d.name}))
                setavailableOwners(owners)
            })
        }
    })
    return (
        <div>
        <TableView
            onRowSelect={handleOnSetView}
        urltag={'/wells'}
        tag = {'Well'}
        fields= {[{ field: 'id', headerName: 'ID', width: 90},
                { field: 'osepod', headerName: 'OSE POD', width: 120 },
                // { field: 'name', headerName: 'Name', width: 90 },
                { field: 'location', headerName: 'Location', width: 120 },
                // { field: 'ownername', headerName: 'Owner', width: 90 ,
                // valueGetter: (params: GridValueGetterParams) => `${params.row.owner?params.row.owner.name: ""}`},

                {field: 'owner_id', headerName: 'Owner', editable:true,
                type: 'singleSelect', valueOptions: availableOwners,
                    valueFormatter: (params)=>{
                        let m = availableOwners.filter((m)=>(m.value===params.value))[0]
                        return m?m.label:''
                    },
                    width: 120
                },
                {field: 'meter_id', headerName: 'Meter', editable:true,
                type: 'singleSelect', valueOptions: availableMeters,
                    valueFormatter: (params)=>{
                        // console.log(availableMeters, params.value)
                        let m = availableMeters.filter((m)=>(m.value===params.value))[0]
                        return m?m.label:''
                    }
                }
                // {field: 'metername', headerName: 'Meter', width: 90,
                // valueGetter: (params: GridValueGetterParams) => `${params.row.meter?params.row.meter.name: ""}`
                // }
                ]}
        />
            <div>
                <MapView
                    mapRef={mapRef}
                    center={defaultCenter} zoom={defaultZoom}/>
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