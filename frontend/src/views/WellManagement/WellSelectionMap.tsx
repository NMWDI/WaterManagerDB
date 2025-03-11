import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import { MapContainer, Marker, TileLayer } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGetWellLocations } from "../../service/ApiServiceNew";
import { Well } from "../../interfaces";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });

L.Marker.prototype.options.icon = DefaultIcon;

interface WellSelectionMapProps {
  wellSearchQueryProp: string;
  setSelectedWell: Function;
}

export default function WellSelectionMap({
  setSelectedWell,
  wellSearchQueryProp,
}: WellSelectionMapProps) {
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
            position={[well.location?.latitude, well.location?.longitude]}
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
  );
}
