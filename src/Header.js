import React from 'react';

function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <li className="nav-item">
            <a className="nav-link" >
                <i className="fa fa-globe">
                    <span className="badge badge-danger">Logout</span>
                </i>
                {props.user.name}
            </a>
        </li>;
    }
    return <li className="nav-item">
        <a className="nav-link" >
            <i className="fa fa-globe">
                <span className="badge badge-success"></span>
            </i>
        </a>
    </li>;
}

export default function Header(props) {
    return  <nav className="navbar navbar-icon-top navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" >{props.appName}</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" >
                        <i className="fa fa-home"></i>
                        Home
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link disabled" >

                        About Us
                    </a>
                </li>


            </ul>
            <ul className="navbar-nav ">
                <Greeting user={props.user} isLoggedIn={!!(props.user.id)} />,
            </ul>

        </div>
    </nav>;
}
