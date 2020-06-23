import React, {Component} from 'react';
import MapComponent from './Map';
import SearchForm from './SearchForm';
import WeatherComponent from './Weather';
import Nav from './Nav';

class App extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            lat: '',
            long: '',
            places: [],
            nearest: '',
            weather: '',
            location: '',
            units: 'metric',
            queryError: ''
        };
    };

    componentDidMount = async() => {
        await this.fetchGeoData()
        .then(() => {
            this.fetchGeoDataNavigator();
        });
    };

    success = async (pos) => {
        const {coords} = pos;
        const {latitude, longitude} = coords;
        const location = await this.reverseGeoCode({lat: latitude, long: longitude});
        this.setState({
            lat: latitude,
            long: longitude,
            location
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

        return fetch(url)
        .then(res => res.json())
        .then(weather => {
            return this.setState({
                weather
            });
        });
    };

    fetchGeoDataNavigator = () => {
        navigator.geolocation.getCurrentPosition(this.success, this.error);
    };

    fetchGeoData = () => {
        let url = `https://infinite-dusk-92659.herokuapp.com/iplookup`;

        return fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let lat, long;
            [lat, long] = [data.ll[0], data.ll[1]];
            // we're waiting for the state to change and then we fetch the weather data, otherwise lat and long are not guaranteed to have a value.
            return this.setState({
                lat, 
                long,
                location: data
            }, () => {
                return this.setStateCallback();
            });
        });
    };

    setStateCallback = () => {
        return this.fetchWeatherData();
    };
    
    fetchPlacesData = (query, location) => {
        const {country, road, city} = this.state.location;
        const locationQuery = `${road ? road + ', ' : ''}${city}, ${country}`;

        // don't make the call if the location is already the same, this is so that i don't waste my limited API requests
        if(location && location !== locationQuery) {
            this.forwardGeoCode(location, () => this.fetchPlacesRequest(query));
        } else {
            this.fetchPlacesRequest(query);
        };
    };

    fetchPlacesRequest = (query) => {
        const {limit, lat, long} = this.state;
        let ll = `${lat},${long}`;
        let url = `https://infinite-dusk-92659.herokuapp.com/foursquare/?&ll=${ll}&query=${query}&v=20180323&limit=${limit}`;

        fetch(url)
        .then(res => res.json())
        .then(async data => {
            // places is just an array of all points of interest, just had to format the data a bit.
            const places = data.response.groups[0].items;
            if(places.length > 0) {
                // nearest is used when setting the Map markers, the orange one will be the one that is closest to the visitor.
                const nearest = this.getNearest(places);
                this.setState({
                    queryError: '',
                    places,
                    nearest
                });
            } else {
                this.setState({
                    queryError: 'There were no results for your search.'
                });
            };
        });
    };

    reverseGeoCode(coords) {
        const {lat, long} = coords;
        const url = `https://infinite-dusk-92659.herokuapp.com/opencagedata/?q=${lat},${long}+`;

        return fetch(url)
        .then(res => res.json())
        .then(data => {
            const location = data.results[0].components;
            return location;
        });
    };

    forwardGeoCode(query, cb) {
        const formattedQuery = query.trim().replace(/\s/g, '+');
        const url = `https://infinite-dusk-92659.herokuapp.com/opencagedata/?q=${formattedQuery}`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            const result = data.results[0];
            // what happens if there is no result
            if(!result) {
                return;
            };
            const {components, geometry} = result;
            const lat = geometry.lat;
            const long = geometry.lng;

            if(cb) {
                this.setState({
                    lat,
                    long,
                    location: components
                }, cb);
            } else {
                this.setState({
                    lat,
                    long,
                    location: components
                });
            };
        });
    };

    render() {
        const {lat, long, places, nearest, weather, location, units, queryError} = this.state;
        const content = lat && long ? (
            <div className="vh-100 d-flex flex-column">
                <Nav />
                <SearchForm fetchPlacesData={this.fetchPlacesData}/>
                <MapComponent lat={lat} long={long} zoom="12" places={places} nearest={nearest} queryError={queryError}/>
                <WeatherComponent weather={weather} location={location} units={units}/>
            </div>
        ) : (
            <div className="d-flex vh-100 flex-column">
                <Nav />
                <div className="loading-screen d-grid flex-grow-1">
                    <div className="content align-self justify-self">
                        <div className="loader"></div>
                        <h3 className="text-center display-1">Loading...</h3>
                    </div>
                </div>
            </div>
        );
        return content;
    };
};

export default App;