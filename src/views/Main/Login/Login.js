import React, { PropTypes as T } from 'react'
import {Tabs, Col, Tab, ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, Alert} from 'react-bootstrap'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'

export class Login extends React.Component {
  constructor(context) {
    super()
    this.state = {
      user: '',
      username: '',
      email: '',
      password: '',
      loginError: '',
      signupError: ''
    }
  }
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  onLoginSubmit(event) {
    event.preventDefault()
    const { user, password } = this.state
    if (user && password) {
      this.props.auth.login(user, password)
        .then(result => {
          console.info(result)
          if (result.status && result.state != 200) {
            this.setState({loginError: result.message})
            return
          }
          this.props.auth.saveLoggedInUser(result)
          this.handleRoleBasedNavigation(result.roles)
          console.info('profile')
          
          console.info('profile')
        })
    }else{
      this.setState({loginError: "Please provide username and password"})      
    }
  }

  handleRoleBasedNavigation (roles) {
    if(roles.includes('Admin'))
      this.context.router.push('/Admin')
    else if(roles.includes('Supervisor'))  
      this.context.router.push('/Supervisor')
    else if(roles.includes('Tsm'))  
      this.context.router.push('/Tsm')
    else if(roles.includes('Covert'))  
      this.context.router.push('/Covert')
    else
      this.setState({loginError: "You don't have any roles to login. Please check with admin"})   
  }


  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const { auth } = this.props
    return (
      <Col sm={6} smOffset={3}>
      <h3>Login</h3>
      <form onSubmit={this.onLoginSubmit.bind(this)}>
        <FormGroup controlId="user">
          <ControlLabel>Email</ControlLabel>
          <FormControl 
            type="text"
            placeholder="Enter your username or email" 
            name="user"
            value={this.state.user} 
            onChange={this.handleChange.bind(this)}
          />
        </FormGroup>
        <FormGroup controlId="user">
          <ControlLabel>Password</ControlLabel>
          <FormControl 
            type="password"
            placeholder="Enter your password" 
            name="password" 
            value={this.state.password} 
            onChange={this.handleChange.bind(this)}
          />
        </FormGroup>

        <Button bsStyle="primary" type="submit">Login</Button>
        </form>
        { this.state.loginError && 
          <Alert bsStyle="danger">{this.state.loginError}</Alert>
        }
      </Col>
    )
  }
}

export default Login
