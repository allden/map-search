import React from 'react';
import { Map, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import marker from './images/marker.png';
import markerAlt from './images/marker_alt.png';

const markerIcon = L.icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [30, 45],
    className: 'marker.png'
});

const markerAltIcon = L.icon({
    iconUrl: markerAlt,
    iconRetinaUrl: markerAlt,
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,  
    shadowAnchor: null,
    iconSize: [30, 45],
    className: 'marker_alt.png'
})

function formatAddress(place) {
    const {location} = place.venue;
    const addr = location.formattedAddress;
    return addr.join(', ');
};

function formatCoordinates(place) {
    const {location} = place.venue;
    const placeLat = location.lat;
    const placeLong = location.lng;
    const formattedCoords = [placeLat, placeLong];

    return formattedCoords;
};

function formatToKilometers(meters) {
    const result = (meters * 0.001).toFixed(2);
    return result;
};

function formatToMiles(meters) {
    const result = (meters * 0.000621371192).toFixed(2);
    return result;
};

function createMetricsObj(meters) {
    const miles = formatToMiles(meters);
    const kilometers = formatToKilometers(meters);

    return {
        kilometers,
        miles
    };
};

function MapComponent(props) {
    const {lat, long, zoom, places, nearest} = props;
    const position = [lat, long];
    const markers = places ? places.map(place => {
        const {name, location} = place.venue;
        const placePosition = formatCoordinates(place);
        const placeAddress = formatAddress(place);
        const distance = location.distance;
        const metricsObject = createMetricsObj(distance);
        // boolean that determines what color the marker will be set as
        const isNearest = nearest.referralId === place.referralId;
        return <Marker icon={isNearest ? markerAltIcon : markerIcon} position={placePosition} key={place.referralId}>
            <Popup>
                <div className="popup">
                    <h3>{name}</h3>
                    <p>{placeAddress}</p>
                    <p>{metricsObject.kilometers}km / {metricsObject.miles}mi away.</p>
                </div>
            </Popup>
        </Marker>
    }) : null;

    return (
        <Map center={position} zoom={zoom}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Circle center={position} radius={100}/>
            {markers}
        </Map>
    );
};

export default MapComponent;