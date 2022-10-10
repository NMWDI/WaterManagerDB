import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import './css/leaflet.css'
// import 'leaflet/dist/leaflet.css'
// function ChangeView({ center, zoom }) {
//   const map = useMap();
//   map.setView(center, zoom);
//   return null;
// }
export default function MapView(props){
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                crossOrigin=""
            />
            <MapContainer
                ref={props.mapRef}
                center={props.center}
                zoom={props.zoom} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

                {props.markers.map((position,idx)=> <Marker key={`marker-${idx}`} position={{lat: position[0],
                lng: position[1]}}></Marker>)}
            </MapContainer>
        </div>
    )
}