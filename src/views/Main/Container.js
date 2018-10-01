import React, { PropTypes as T } from 'react'
import { Nav, Navbar, NavItem, Header, Brand } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import AuthService from 'utils/AuthService'

const auth = new AuthService()

export class Container extends React.Component {
  static contextTypes = {
    router: T.object
  }

  logout(){
    auth.logout()
    this.context.router.push('/login')
  }

  render() {
    let children = null
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance to children
      })
    }

    return (
      <div>
        <Navbar fluid={true}>
          <Navbar.Header>
            <Navbar.Brand>
                ERM FrontEnd
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            { (auth.isSupervisor() || auth.isAdmin()) &&
              <LinkContainer to={'/Supervisor'}>
                <NavItem>Supervisor Report</NavItem>
              </LinkContainer>
            }
            { auth.isAuthenticated() &&
              <LinkContainer to={'/Covert'}>
                <NavItem>Covert Report</NavItem>
              </LinkContainer>              
            }
            { (auth.isTsm() || auth.isAdmin())  &&
              <LinkContainer to={'/Tsm'}>
                <NavItem>TSM Report</NavItem>
              </LinkContainer>              
            }
            { auth.isAdmin() &&
              <LinkContainer to={'/Admin'}>
                <NavItem>Admin</NavItem>
              </LinkContainer>              
            }
          </Nav>
          <Nav pullRight>
            { auth.isAuthenticated() && 
              <LinkContainer to={'/login'}>
                <NavItem onClick={this.logout.bind(this)}>Log Out</NavItem>
              </LinkContainer>
            }
          </Nav>
        </Navbar>
        <div className="container">
          { children }
        </div>
      </div>
    )
  }
}

export default Container
