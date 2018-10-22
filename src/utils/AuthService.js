import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import { browserHistory } from 'react-router'
import jwtDecode from 'jwt-decode'

import { API_URL } from './constants'

import { LOGIN_API_PATH } from './constants'

import { StubAPI } from './Stub'

export default class AuthService   {
  constructor() { 
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication(endpoint, values) {
    let stubResponse = StubAPI(endpoint)
    if(stubResponse)
      return Promise.resolve(stubResponse)
    return this.fetch(`${API_URL}${endpoint}`, {
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'X-Auth-Username': values.user,
        'X-Auth-Password': values.password
      } 
    })
  }

  login(user, password) {
    let response =  this._doAuthentication(LOGIN_API_PATH, { user, password })
    return response
  }

  signup(username, email, password) {
    return this._doAuthentication('users', { username, email, password })
  }

  isAuthenticated() {
    // Checks if there is a saved token and it's still valid
    const loggedInUser = this.getLoggedInUser()
    if (loggedInUser) {
      return true
    } else {
      return false
    }
  }

  saveLoggedInUser(userObj) {
    localStorage.setItem('loggedInUser', JSON.stringify(userObj))
  }

  getLoggedInUser() {
    return localStorage.getItem('loggedInUser')
  }

  isAdmin() {
    return this.hasRole('Admin')
  }

  isSupervisor() {
    return this.hasRole('Supervisor')
  }

  isTsm() {
    return this.hasRole('Tsm')
  }

  isCovert() {
    return this.hasRole('Covert')
  }

  hasRole (role){
    let loggedInUser = localStorage.getItem('loggedInUser')
    if(loggedInUser){
      loggedInUser = JSON.parse(loggedInUser)
      return loggedInUser.roles.includes(role)
    }else{
      return false
    }
  }

  logout() {
    localStorage.removeItem('loggedInUser')
  } 

  fetch(url,options) {    
    let response = fetch(url, options)
    .then(response => response.json())

    return response
  }
}
