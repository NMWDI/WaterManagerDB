import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
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
    const meters = useGetMeterLocations(meterSearchDebounced)
    

    // // Re-load map when search is changed
    // useEffect(() => {
    //     setMeterListQueryParams(newParams)
    // }, [meterSearchQueryDebounced, gridSortModel, gridPage, gridPageSize])

    const mapStyle = {
        height: '100%',
        width: '100%'
    }

    const meterMarkers = meters.data?.map((meter: MeterMapDTO) => {
            return (
                <Marker
                    key={meter.id}
                    position={[meter.location?.latitude, meter.location?.longitude]}
                    eventHandlers={{
                        click: () => {onMeterSelection(meter.id)}
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
