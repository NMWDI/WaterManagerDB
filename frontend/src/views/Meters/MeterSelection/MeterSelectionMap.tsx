import React from 'react'

import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import { useApiGET } from '../../../service/ApiService';
import { MeterMapDTO } from '../../../interfaces'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = require('leaflet/dist/images/marker-icon.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');
const DefaultIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow})
L.Marker.prototype.options.icon = DefaultIcon

interface MeterSelectionMapProps {
    onMeterSelection: Function
}

export default function MeterSelectionMap({onMeterSelection}: MeterSelectionMapProps) {

    {/* Probably better to call this meters, or meters with locations or something, meterlocation.id below is confusing */}
    const [meterLocations, setMeterLocations] = useApiGET<MeterMapDTO[]>('/meters_locations', [])

    const mapStyle = {
        height: '100%',
        width: '100%'
    }

    const meterMarkers = meterLocations.map((meterLocation: any) => {
            return (
                <Marker
                    key={meterLocation.id}
                    position={[meterLocation.meter_location.latitude, meterLocation.meter_location.longitude]}
                    eventHandlers={{
                        click: () => {onMeterSelection(meterLocation.id)}
                    }}
                ></Marker>
                )
        })

    return (
            <MapContainer
                center={[34.5199, -105.8701]}
                zoom={7}
                style={mapStyle}
                maxBounds={L.latLngBounds([30.38, -110.76], [38.56, -101.79])}
                maxZoom={13}
                >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {meterMarkers}
            </MapContainer>
        )
}
