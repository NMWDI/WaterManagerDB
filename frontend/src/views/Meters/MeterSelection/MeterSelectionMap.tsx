import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { CircleMarker, MapContainer, TileLayer, Tooltip, GeoJSON } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { MeterMapDTO } from '../../../interfaces'

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import '../../../css/map.css';
import { useGetMeterLocations } from '../../../service/ApiServiceNew';
import trss_data from '../../../data/RoswellTR_test2.geojson';
import { FeatureCollection, Feature, Geometry } from 'geojson';

// The leaflet map needs this for some reason
const icon = require('leaflet/dist/images/marker-icon.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');
const DefaultIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow})

L.Marker.prototype.options.icon = DefaultIcon

interface MeterSelectionMapProps {
    meterSearch: string
    onMeterSelection: Function
}

// Define marker colors which are based on the year of the last PM (July - June)
const pm_colors: { [key: string]: string } = {
    '2020/2021': 'brown',
    '2021/2022': 'green',
    '2022/2023': 'purple',
    '2023/2024': 'turquoise',
    '2024/2025': 'red',
    '2025/2026': 'white',
    '2026/2027': 'yellow',
    '2027/2028': 'brown',
    '2028/2029': 'blue'
}

// Map legend for PM colors
function ColorLegend() {
    const context = useLeafletContext()

    useEffect(() => {
        const legend = new L.Control({ position: 'bottomleft' });
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            const seasons = Object.keys(pm_colors);

            // Add title to legend
            div.innerHTML = '<h4>PM Season</h4>';
    
            // loop through PM seasons and generate a label with a colored square for each interval
            for (var i = 0; i < seasons.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + pm_colors[seasons[i]] + '"></i> ' + seasons[i] + '<br>';
                }
        
            return div;
        };

        const container = context.map
        container.addControl(legend)
    
        return () => {
          container.removeControl(legend)
        }
    })

    return null;
};

// Function for getting color from last PM which is based on year and month
function getMeterColor(last_pm: string) {
    // The string has the format "YYYY-MM-DDTHH:MM:SSZ" Use month and year to determine color
    //Convert string to a date object
    const last_pm_date = new Date(last_pm)

    // Test if the date is in or after July
    if (last_pm_date.getMonth() >= 7) {
        return pm_colors[last_pm_date.getFullYear() + '/' + (last_pm_date.getFullYear() + 1)]
    }else{
        return pm_colors[(last_pm_date.getFullYear() - 1) + '/' + last_pm_date.getFullYear()]
    }
}
//Test Geojson
const trssData: FeatureCollection = trss_data
console.log(trss_data)
// const trss_data: FeatureCollection = 
// {
//     "type": "FeatureCollection",
//     "features": [
//     { "type": "Feature", "properties": { "OBJECTID": 776, "TWNSHPLAB": "23S 18E" }, "geometry": { 
//         "type": "Polygon", "coordinates": [ 
//             [ 
//                 [ -105.150910258647997, 32.253371742509103 ], 
//                 [ -105.047748440584996, 32.253371742509103 ], 
//                 [ -105.047748440584996, 32.340619201250099 ], 
//                 [ -105.150910258647997, 32.340619201250099 ], 
//                 [ -105.150910258647997, 32.253371742509103 ] 
//             ] 
//         ] } }
//     ]
// }

export default function MeterSelectionMap({onMeterSelection, meterSearch}: MeterSelectionMapProps) {
     
    const [meterSearchDebounced] = useDebounce(meterSearch, 250)
    const [meterMarkersMap, setMeterMarkersMap] = useState<any>([])

    const mapStyle = {
        height: '100%',
        width: '100%'
    }

    const meterMarkers = useGetMeterLocations(meterSearchDebounced)

    useEffect(() => {
        setMeterMarkersMap(
            meterMarkers.data?.map((meter: MeterMapDTO) => {
                return (
                    <CircleMarker
                        key={meter.id}
                        center={[meter.location?.latitude, meter.location?.longitude]}
                        pathOptions={ meter.last_pm == null ? {color: 'black', fillOpacity: 0} : {color:'black', weight: 2, fillColor: getMeterColor(meter.last_pm), fillOpacity: 0.9} }
                        radius={6}
                        eventHandlers={{
                            click: () => {onMeterSelection(meter.id)}
                        }}>
                        <Tooltip>{meter.serial_number}</Tooltip>
                    </CircleMarker>
                )
            })
        )
    }, [meterMarkers.data])

    return (
            <MapContainer
                center={[33, -104.0]}
                zoom={8}
                style={mapStyle}
                //maxBounds={L.latLngBounds([30.38, -110.76], [38.56, -101.79])}
                maxZoom={18}
                >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {meterMarkersMap}
                <GeoJSON data={trssData} />
                <ColorLegend />
            </MapContainer>
        )
}


