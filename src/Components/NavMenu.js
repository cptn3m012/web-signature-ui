import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, NavLink as RRNavLink } from 'react-router-dom';
import './NavMenu.css';
import DarkModeToggle from './DarkModeToggle';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            isLoggedIn: false,
            firstName: '',
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(atob(base64));
            const decodedFirstName = decodeURIComponent(escape(decodedToken.FirstName));
            this.setState({
                isLoggedIn: true,
                firstName: decodedFirstName,
            });
        }
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload(false);
        this.setState({
            isLoggedIn: false,
            firstName: '',
        });
    };

    render() {
        const { isLoggedIn, firstName } = this.state;

        return (
            <header>
                <Navbar
                    className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 dark:bg-gray-800"
                    container
                    light
                >
                    <div className="navbar-brand dark:text-white" tag={Link} to="/">
                        <NavbarBrand className="dark:text-white" tag={Link} to="/">
                            WebSignature
                        </NavbarBrand>
                        <DarkModeToggle />
                    </div>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow justify-content-end dark:">
                            <NavItem>
                                <NavLink tag={RRNavLink} className="dark:text-white" exact to="/" activeClassName="active">
                                    Home
                                </NavLink>
                            </NavItem>
                            {isLoggedIn ? (
                                <React.Fragment>
                                    <NavItem>
                                        <span className="nav-link dark:text-white">Witaj, {firstName}</span>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag={RRNavLink}
                                            className="dark:text-white"
                                            to="#"
                                            onClick={this.handleLogout}
                                        >
                                            Wyloguj
                                        </NavLink>
                                    </NavItem>
                                </React.Fragment>
                            ) : (
                                <NavItem>
                                    <NavLink
                                        tag={RRNavLink}
                                        className="dark:text-white"
                                        to="/login"
                                        activeClassName="active"
                                    >
                                        Zaloguj się
                                    </NavLink>
                                </NavItem>
                            )}
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
