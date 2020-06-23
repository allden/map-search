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

        return (
            <div onSubmit={this.onSubmitHandler} className="form-container d-grid py-1">
                <form id="search-form" className="d-flex flex-column justify-self w-75 p-1">
                    <input onChange={this.onChangeHandler} value={location} type="text" id="location" placeholder="e.g. st Fake Street, Manchester, UK (Optional)"></input>
                    <input onChange={this.onChangeHandler} value={search} type="text" id="search" placeholder="Point of Interest: e.g. Cafe"></input>
                    <button className="btn btn-primary">Search</button>
                </form>
            </div>
        );
    };
};

export default SearchForm;