import React, {Component} from 'react';
import { render } from '@testing-library/react';

class WeatherComponent extends Component {
    constructor(props) {
        super(props);
        this.interval = '';
        this.state = {
            currentTime: new Date(new Date().toLocaleString())
        };
    };

    formatTemp(temp, units) {
        switch(units) {
            case 'metric':
                return `${temp}${String.fromCharCode(176)}C`
        };
    };
    
    formatDate(date) {
        const newDate = new Date(date * 1000);
        return newDate || new Date();
    };

    convertToLocale(date) {
        return date.toLocaleString();
    };
    
    getTime(date) {
        const hours = this.prependZero(date.getHours());
        const minutes = this.prependZero(date.getMinutes());
        const seconds = this.prependZero(date.getSeconds());
    
        return `${hours}:${minutes}:${seconds}`;
    };
    
    prependZero(number) {
        if(number < 10) {
            return '0' + number;
        } else {
            return number;
        };
    };
    
    convertToKilometers(meters) {
        const result = (meters * 0.001).toFixed(2);
        return result;
    };
    
    convertToMiles(meters) {
        const result = (meters * 0.000621371192).toFixed(2);
        return result;
    };

    // this will reflect the passing of time on the current time in the UI
    refreshTime = () => {
        this.setState({
            currentTime: new Date(new Date().toLocaleString())
        });
    };

    componentDidMount() {
        this.interval = setInterval(this.refreshTime, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    };

    render() {
        const {clouds, sunrise, sunset, temp, feels_like, visibility, dt, humidity, wind_deg, wind_speed, weather} = this.props.weather.current || {};
        const {country, city} = this.props.country;
        const {units} = this.props;
        const {currentTime} = this.state;

        if(this.props.weather && this.props.country) {
            return (
                <div id="weather">
                    <h3>{city}, {country}</h3>
                    <ul>
                        <li>Weather: {weather ? weather[0].description : undefined}</li>
                        <li>Temperature: {this.formatTemp(temp, units)}</li>
                        <li>Feels Like:{this.formatTemp(feels_like, units)}</li>
                        <li>Wind Direction: {wind_deg}&deg;</li>
                        <li>Wind Speed: {wind_speed}</li>
                        <li>Humidity: {humidity}</li>
                        <li>Visibility: {this.convertToKilometers(visibility)}km / {this.convertToMiles(visibility)}mi</li>
                        <li>Current Time: {this.getTime(currentTime)}</li>
                        <li>Sunrise: {this.getTime(this.formatDate(sunrise))}</li>
                        <li>Sunset: {this.getTime(this.formatDate(sunset))}</li>
                    </ul>
                </div>
            );
        } else {
            return null;
        };
    };
};

export default WeatherComponent;