import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import Footer from "./Footer";

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        return (
            <div className="d-flex flex-column min-vh-100">
                <NavMenu />
                <Container tag="main" className="flex-grow-1">
                    {this.props.children}
                </Container>
                <Footer/>
            </div>
        );
    }
}