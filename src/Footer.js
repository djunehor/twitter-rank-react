import React from 'react';

export default function Header(props) {
    return <footer className="footer">
        <div className="row align-items-center justify-content-xl-between">
            <div className="col-xl-6 m-auto text-center">
                <div className="copyright">
                    <p>Created By <a href="https://github.com/djunehor" target="_blank"
                                     rel="noopener noreferrer">{props.appName}</a></p>
                </div>
            </div>
        </div>
    </footer>;
}
