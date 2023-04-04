import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Smerre
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/temperatures/list" className="nav-link">
                                View data
                            </Link>
                        </Item>

                        <Item>
                            <Link to="/component/control" className="nav-link">
                                Component control
                            </Link>
                        </Item>

                        <Item>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        </Item>
                        
                        <Item>
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </Item>
                                                
                        <Item>
                            <Link to="/automation" className="nav-link">
                                Automation
                            </Link>
                        </Item>

                        <Item>
                            <Link to="/testAutomation" className="nav-link">
                                Drag Automation
                            </Link>
                        </Item>


                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links