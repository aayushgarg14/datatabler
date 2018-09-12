import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    Yuhuu Lavarel!
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))