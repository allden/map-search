import React, {Component} from 'react';
import MapComponent from './Map';
import SearchForm from './SearchForm';
import WeatherComponent from './Weather';

class App extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            lat: '',
            long: '',
            places: '',
            nearest: '',
            weather: '',
            country: '',
            units: 'metric'
        };
    };

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(this.success, this.error)
    };

    success = (pos) => {
        const {coords} = pos;
        const {latitude, longitude} = coords;
        this.setState({
            lat: latitude,
            long: longitude
        }, this.setStateCallback);
    };

    error = (err) => {
        this.fetchGeoData();
    };

    getNearest = (places) => {
        let result = '';
        let shortestDistance = Number.POSITIVE_INFINITY;
        for(let i = 0; i < places.length; i++) {
            const current = places[i];
            const distance = current.venue.location.distance;
            // if it is lower than the shortestDistance, set shortestDistance to the new lowest value and keep doing so until we've reached the top
            if(distance < shortestDistance) {
                shortestDistance = distance;
                result = current;
            };
        };
        return result;
    };

    fetchWeatherData = () => {
        const {lat, long, units} = this.state;
        let url = `https://infinite-dusk-92659.herokuapp.com/openweathermap/?lat=${lat}&lon=${long}&exclude=hourly,daily,minutely&units=${units}`;

        fetch(url)
        .then(res => res.json())
        .then(weather => {
            this.setState({
                weather
            });
        });
    };

    fetchGeoData = () => {
        let url = `https://infinite-dusk-92659.herokuapp.com/iplookup`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            let lat, long;
            [lat, long] = [data.ll[0], data.ll[1]];
            // we're waiting for the state to change and then we fetch the weather data, otherwise lat and long are not guaranteed to have a value.
            this.setState({
                lat, 
                long
            }, this.setStateCallback);
        });
    };

    setStateCallback = () => {
        this.reverseGeoCode();
        this.fetchWeatherData();
    };
    
    fetchPlacesData = (query) => {
        const {limit, lat, long} = this.state;
        let ll = `${lat},${long}`;
        let url = `https://infinite-dusk-92659.herokuapp.com/foursquare/?&ll=${ll}&query=${query}&v=20180323&limit=${limit}`;

        fetch(url)
        .then(res => res.json())
        .then(async data => {
            // places is just an array of all points of interest, just had to format the data a bit.
            const places = data.response.groups[0].items;
            // nearest is used when setting the Map markers, the orange one will be the one that is closest to the visitor.
            const nearest = this.getNearest(places);
            this.setState({
                places,
                nearest
            });
        });
    };

    reverseGeoCode() {
        const {lat, long} = this.state;
        const url = `https://infinite-dusk-92659.herokuapp.com/opencagedata/?q=${lat},${long}+`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            const country = data.results[0].components;

            this.setState({
                country
            });
        });
    };

    render() {
        const {lat, long, places, nearest, weather, country, units} = this.state;
        return (
            <div>
                <SearchForm fetchPlacesData={this.fetchPlacesData}/>
                <MapComponent lat={lat} long={long} zoom="12" places={places} nearest={nearest}/>
                <WeatherComponent weather={weather} country={country} units={units}/>
            </div>
        );
    };
};

export default App;