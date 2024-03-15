import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
// import { wellMapDTO } from '../../../interfaces'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetWellLocations, useGetWells } from '../../service/ApiServiceNew';
import { Well, WellListQueryParams } from '../../interfaces';
import { SortDirection, WellSortByField } from '../../enums';

// The leaflet map needs this for some reason
const icon = require('leaflet/dist/images/marker-icon.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');
const DefaultIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow})

L.Marker.prototype.options.icon = DefaultIcon

interface WellSelectionMapProps {
    wellSearchQueryProp: string
    setSelectedWell: Function
}

export default function WellSelectionMap({setSelectedWell, wellSearchQueryProp}: WellSelectionMapProps) {
     
    const [wellSearchDebounced] = useDebounce(wellSearchQueryProp, 250);
    const [wellListQueryParams, setWellListQueryParams] = useState<WellListQueryParams>()
    const [wellMarkersMap, setwellMarkersMap] = useState<any>([]);

    const mapStyle = {
        height: '100%',
        width: '100%'
    }

    const wellMarkers:any = useGetWellLocations(wellSearchDebounced)

 
    useEffect(() => {

        setwellMarkersMap(
            wellMarkers.data?.map((well:Well) => {
                return (
                    <Marker
                        key={well.id}
                        position={[well.location?.latitude, well.location?.longitude]}
                        eventHandlers={{
                            click: () => {setSelectedWell(wellMarkers.data?.find((well: Well) => well.id == well.id))}
                        }}
                    ></Marker>
                )
            })
        )
    }, [wellMarkers.data])

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
                {wellMarkersMap}
            </MapContainer>
        )
}
