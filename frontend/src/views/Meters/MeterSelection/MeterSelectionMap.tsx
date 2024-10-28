import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { MeterMapDTO } from '../../../interfaces'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetMeterLocations } from '../../../service/ApiServiceNew';

// The leaflet map needs this for some reason
const icon = require('leaflet/dist/images/marker-icon.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');
const DefaultIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow})

L.Marker.prototype.options.icon = DefaultIcon

interface MeterSelectionMapProps {
    meterSearch: string
    onMeterSelection: Function
}

export default function MeterSelectionMap({onMeterSelection, meterSearch}: MeterSelectionMapProps) {
     
    const [meterSearchDebounced] = useDebounce(meterSearch, 250)
    const [meterMarkersMap, setMeterMarkersMap] = useState<any>([])

    // Define marker colors which are based on the year of the last PM
    const pm_colors: { [key: string]: string } = {
        '2020': 'brown',
        '2021': 'green',
        '2022': 'purple',
        '2023': 'turquoise',
        '2024': 'red',
        '2025': 'white',
        '2026': 'yellow',
        '2027': 'brown',
        '2028': 'blue'
    }

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
                        pathOptions={ meter.last_pm == null ? {color: 'black', fillOpacity: 0.8} : {fillColor: pm_colors[meter.last_pm], fillOpacity: 0.8} }
                        radius={6}
                        eventHandlers={{
                            click: () => {onMeterSelection({meter_id: meter.id, meter_serialnumber: meter.serial_number})}
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
            </MapContainer>
        )
}
