import React, {Component} from 'react';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
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
        e.preventDefault();
        // we're interacting with the App state to change the places key of the state object based on the value we get from the form
        this.props.fetchPlacesData(query);
    };

    render() {
        return (
            <div onSubmit={this.onSubmitHandler} className="form-container">
                <form id="search-form">
                    <input value={this.state.search} onChange={this.onChangeHandler} type="text" id="search"></input>
                    <button className="btn">Search</button>
                </form>
            </div>
        );
    };
};

export default SearchForm;