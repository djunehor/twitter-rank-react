import React, {Component} from "react";
// Add bootstrap

const pageOptions = [
    {id: 10, name: '10 rows per page'},
    {id: 20, name: '20 rows per page'},
    {id: 50, name: '50 rows per page'},
    {id: 100, name: '100 rows per page'},
];
const SimpleList = (props) => {
    return props.items.map(function (item) {
        return <option key={item.id} value={item.id}>{item.name}</option>;
    })
};

const encodeQuery = (data) => {
    let query = data.url
    for (let d in data.params) {
        if (!data.params[d]) continue;
        query += encodeURIComponent(d) + '='
            + encodeURIComponent(data.params[d]) + '&';
    }
    return query.slice(0, -1)
}

const SingleTweep = (props) => {
    let {page,perPage,items} = props;

    let multiplier = (page ? page - 1 : 0) * (perPage || 0)

    return items.map(function (tweep, index) {
        return <tr key={tweep.id} className="clickable-row" data-href="#"
                   data-toggle="tooltip" title="View Record Details">
            <td>
                <small>
                    {multiplier + (index + 1)}
                </small>
            </td>
            <td>
                <small>
                    <span>{tweep.name}</span>
                    ({`@${tweep.screen_name}`})
                </small>
            </td>
            <td>
                {tweep.location}
            </td>
            <td>
                {tweep.points}
            </td>

            <td>
                {tweep.followers_count}
            </td>
            <td>
                                                <span className={"badge "+ (tweep.verified ? 'badge-success' : '')}>
                                                {tweep.verified ? 'Yes' : 'No'}
                        </span>
            </td>
        </tr>;
    })
};

class TweepsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moreParams: {
                country_id: null,
                state_id: null,
                city_id: null,
                per_page: 10,
            },
            countries: [],
            regions: [],
            cities: [],
            tweeps: [],
            pagination: {},
        };

        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handlePerPageChange = this.handlePerPageChange.bind(this);

    }

    componentWillMount() {
        this.fetchCountries()
        this.fetchTweeps()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Typical usage (don't forget to compare props):
        if (this.state.moreParams !== prevState.moreParams) {
            console.log('state has changed', this.state.moreParams)
            this.fetchTweeps();
        }
    }

    fetchCountries() {
        var request = new Request(`${this.props.api}/countries`, {
            method: 'GET',
            headers: new Headers()
        });
        fetch(request) // Call the fetch function passing the url of the API as a parameter
            .then(function (response) {
                // Your code for handling the data you get from the API
                return response.json();
            }).then(data => {
            this.setState({countries: data});
        })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    fetchRegions(id) {
        var request = new Request(`${this.props.api}/countries/${id}/regions`, {
            method: 'GET',
            headers: new Headers()
        });
        fetch(request) // Call the fetch function passing the url of the API as a parameter
            .then(function (response) {
                // Your code for handling the data you get from the API
                return response.json();
            }).then(data => {
            this.setState({regions: data});
        })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    fetchCities(id) {
        var request = new Request(`${this.props.api}/regions/${id}/cities`, {
            method: 'GET',
            headers: new Headers()
        });
        fetch(request) // Call the fetch function passing the url of the API as a parameter
            .then(function (response) {
                // Your code for handling the data you get from the API
                return response.json();
            }).then(data => {
            this.setState({cities: data});
        })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    fetchTweeps() {
        var request = new Request(encodeQuery({
            url: `${this.props.api}/?`,
            params: this.state.moreParams
        }), {
            method: 'GET',
            headers: new Headers()
        });
        fetch(request) // Call the fetch function passing the url of the API as a parameter
            .then(function (response) {
                // Your code for handling the data you get from the API
                return response.json();
            }).then(data => {
            let tweepData = data.data;
            this.setState({tweeps: tweepData});
            delete data.data;
            this.setState({
                is_api_change:true,
                pagination: {
                    perPage: data.perPage,
                    page: data.page,
                    lastPage: data.lastPage,
                    total: data.total
                }
            });
        })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    handleCountryChange(e) {
        var moreParams = {...this.state.moreParams}
        moreParams.country_id = e.target.value;
        this.setState({moreParams})
        this.fetchRegions(e.target.value)
    }

    handleStateChange(e) {
        var moreParams = {...this.state.moreParams};
        moreParams.region_id = e.target.value;
        this.setState({moreParams})
        this.fetchCities(e.target.value)
    }

    handlePerPageChange(e) {
        var moreParams = {...this.state.moreParams};
        moreParams.per_page = e.target.value;
        this.setState({moreParams})
    }

    changePage(page) {
        var moreParams = {...this.state.moreParams}
        moreParams.page = page;
        this.setState({moreParams})
    }

    handleCityChange(e) {
        var moreParams = {...this.state.moreParams}
        moreParams.city_id = e.target.value;
        this.setState({moreParams})
    }

    filteredStates = (country_id) => {
        return this.state.regions.filter((s) => s.country_id === country_id)
    }

    filteredCities = (state_id) => {
        return this.state.cities.filter((s) => s.state_id === state_id)
    }

    render() {
        return (
            <div className="container-fluid">
                <form action="#" method="get">
                    <div className="row mb-3">

                        <div className="col-12 col-sm-4 col-lg-2 mb-2">
                            <select defaultValue={0} className="form-control" onChange={this.handleCountryChange}>
                                <SimpleList items={this.state.countries}/>
                            </select>
                        </div>
                        <div className="col-12 col-sm-4 col-lg-2 mb-2">
                            <select defaultValue={0} className="form-control" onChange={this.handleStateChange}>
                                <SimpleList items={this.filteredStates(this.state.country_id)}/>
                            </select>
                        </div>
                        <div className="col-12 col-sm-4 col-lg-2 mb-2">
                            <select defaultValue={0} className="form-control" onChange={this.handleCityChange}>
                                <SimpleList items={this.filteredCities(this.state.state_id)}/>
                            </select>
                        </div>
                        <div className="col-12 col-sm-4 col-lg-2 mb-2">
                            <select className="form-control"
                                    onChange={this.handlePerPageChange}>
                                <SimpleList items={pageOptions}/>
                            </select>
                        </div>
                        <div className="row col-sm-4 mb-2">
                            <button type="button" onClick={() => this.setState({moreParams: {}})}
                                    className="col btn btn-warning">Clear Filters
                            </button>
                        </div>
                    </div>
                </form>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card ">
                            <div className="card-header">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>


                    <span>
                        Twitter Rank
                        <small>
                            <sup className="label label-default">
                                {this.state.pagination.total} Accounts
                            </sup>
                        </small>
                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive activity-table">
                                    <table id="twitterTable" style={{width: '100%'}}
                                           className="table table-striped table-condensed table-sm  table-hover  data-table">
                                        <thead>
                                        <tr>
                                            <th>
                                                <i className="fa fa-database fa-fw" aria-hidden="true"></i>
                                                <span className="hidden-sm hidden-xs">
                        Position
                    </span>
                                            </th>

                                            <th>
                                                <i className="fa fa-file-text-o fa-fw" aria-hidden="true"></i>
                                                Name
                                            </th>
                                            <th>
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                Location
                                            </th>
                                            <th>
                                                <i className="fa fa-money" aria-hidden="true"></i>
                                                Points
                                            </th>
                                            <th>
                                                <i className="fa fa-user-o " aria-hidden="true"></i>
                                                Followers
                                            </th>

                                            <th>
                                                <i className="fa fa-tick" aria-hidden="true"></i>
                                                Verified
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <SingleTweep
                                            page={this.state.pagination.page}
                                            perPage={this.state.pagination.perPage}
                                            items={this.state.tweeps}
                                        />
                                        </tbody>
                                    </table>
                                </div>

                                <div className="text-center">
                                    <div className="d-flex justify-content-center">

                                    </div>

                                    <ul className="pagination">

                                        <li className={"page-item "+ (this.state.pagination.page === 1 ? 'disabled' : '')}
                                            aria-label="&laquo; Previous">
                                            <button onClick={(e) => this.changePage(this.state.pagination.page - 1)}
                                               className="page-link" rel="prev"
                                               aria-label="&laquo; Prev">&laquo; Prev</button>
                                        </li>


                                        <li className="page-item active" aria-current="page">
                                            <span className="page-link">{this.state.pagination.page}</span>
                                        </li>

                                        <li className={"page-item "+ (this.state.pagination.page === this.state.pagination.lastPage ? 'disabled' : '')}
                                            aria-label="Next &raquo;">
                                            <button type="button" onClick={(e) => this.changePage(this.state.pagination.page + 1)}
                                               className="page-link" rel="next"
                                               aria-label="Next &raquo;">Next &rsaquo;</button>
                                        </li>
                                    </ul>

                                    <small>({this.state.pagination.perPage} per page)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TweepsList
