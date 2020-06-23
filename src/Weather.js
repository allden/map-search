import React, {Component} from 'react';

class WeatherComponent extends Component {
    constructor(props) {
        super(props);
        this.interval = '';
        this.state = {
            currentTime: new Date(new Date().toLocaleString("en-US"))
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
        return date.toLocaleString("en-US");
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

    capitalizeText(text) {
        return text.toUpperCase();
    };

    // this will reflect the passing of time on the current time in the UI
    refreshTime = () => {
        const localTime = new Date().toLocaleString("en-US");        
        this.setState({
            currentTime: new Date(localTime)
        });
    };

    componentDidMount() {
        this.interval = setInterval(this.refreshTime, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    };

    render() {
        const {sunrise, sunset, temp, feels_like, visibility, humidity, wind_deg, wind_speed, weather} = this.props.weather.current || {};
        const {country, road, city, town} = this.props.location;
        const {units} = this.props;
        const {currentTime} = this.state;

        if(this.props.weather && this.props.location) {
            return (
                <div id="weather-container">
                    <div id="weather" className="text-center gradient text-light p-bal">
                        <h3 className="m-0 display-2">
                            {road ? road + ', ' : ''}
                            {city || town ? city + ', ' || town + ', ' : ''}
                            {country}
                        </h3>
                        <h4 className="m-0">{weather ? this.capitalizeText(weather[0].description) : this.capitalizeText('no data available')}</h4>
                        <p className="display-3 m-0">{this.getTime(currentTime)}</p>
                        <hr className="border-bottom border-light w-90"></hr>
                        <ul className="list-unstyled d-grid" id="weather-data">
                            <li><b>Temperature</b>: {this.formatTemp(temp, units)}</li>
                            <li><b>Feels Like</b>:{this.formatTemp(feels_like, units)}</li>
                            <li><b>Wind Direction</b>: {wind_deg}&deg;</li>
                            <li><b>Wind Speed</b>: {wind_speed}m/s</li>
                            <li><b>Humidity</b>: {humidity}&#37;</li>
                            <li><b>Visibility</b>: {this.convertToKilometers(visibility)}km</li>
                            <li><b>Sunrise</b>: {this.getTime(this.formatDate(sunrise))}</li>
                            <li><b>Sunset</b>: {this.getTime(this.formatDate(sunset))}</li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return null;
        };
    };
};

export default WeatherComponent;