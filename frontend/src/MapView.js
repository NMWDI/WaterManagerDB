import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import './css/leaflet.css'
// import 'leaflet/dist/leaflet.css'
// function ChangeView({ center, zoom }) {
//   const map = useMap();
//   map.setView(center, zoom);
//   return null;
// }
export default function MapView(props){
    console.log(props)
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                crossOrigin=""
            />
            <MapContainer
            center={props.center} zoom={props.zoom} scrollWheelZoom={false}>
                {/*<ChangeView {props.center} zoom={props.zoom}/>*/}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
        </div>

    )
}