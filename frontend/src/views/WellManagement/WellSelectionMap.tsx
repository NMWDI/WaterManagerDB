import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGetWellLocations } from "../../service/ApiServiceNew";
import { Well } from "../../interfaces";
const icon = require("leaflet/dist/images/marker-icon.png");
const iconShadow = require("leaflet/dist/images/marker-shadow.png");
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });

L.Marker.prototype.options.icon = DefaultIcon;

export default function WellSelectionMap({
  setSelectedWell,
  wellSearchQueryProp,
}: {
  wellSearchQueryProp: string;
  setSelectedWell: Function;
}) {
  const [wellSearchDebounced] = useDebounce(wellSearchQueryProp, 250);
  const [wellMarkersMap, setwellMarkersMap] = useState<any>([]);

  const mapStyle = {
    height: "500px",
  };

  const wellMarkers: any = useGetWellLocations(wellSearchDebounced);
  const onClickMarker = (well: Well) => {
    setSelectedWell(well);
  };

  useEffect(() => {
    setwellMarkersMap(
      wellMarkers.data?.map((well: Well) => {
        return (
          <Marker
            key={well.id}
            position={[
              well.location?.latitude ?? 0,
              well.location?.longitude ?? 0,
            ]}
            eventHandlers={{
              click: () => {
                onClickMarker(well);
              },
            }}
          ></Marker>
        );
      }),
    );
  }, [wellMarkers.data]);

  return (
    <MapContainer center={[33, -104.0]} zoom={8} style={mapStyle} maxZoom={18}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {wellMarkersMap}
    </MapContainer>
  );
}
