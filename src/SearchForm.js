import React, {Component} from 'react';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            location: ''
        };
    };

    onChangeHandler = (e) => {
        const {id, value} = e.target;

        this.setState({
            [id]: value
        });
    };

    onSubmitHandler = (e) => {
        const query = this.state.search;
        const {location} = this.state;
        e.preventDefault();
        // we're interacting with the App state to change the places key of the state object based on the value we get from the form
        this.props.fetchPlacesData(query, location);
    };

    render() {
        const {location, search} = this.state;
        const locationProp = this.props.location;
        const {fetchGeoDataNavigator} = this.props;
        const {country, road, city} = locationProp;
        const query = `${road ? road + ', ' : ''}${city}, ${country}`;
        return (
            <div onSubmit={this.onSubmitHandler} className="form-container">
                <button onClick={fetchGeoDataNavigator}>Get Current Location</button>
                <form id="search-form">
                    <label>Where do you want to look?</label>
                    <input onChange={this.onChangeHandler} value={location || query} type="text" id="location" placeholder="Leave blank for current location."></input>
                    <label>What do you want to find?</label>
                    <input onChange={this.onChangeHandler} value={search} type="text" id="search" placeholder="ex. Cafe"></input>
                    <button className="btn">Search</button>
                </form>
            </div>
        );
    };
};

export default SearchForm;