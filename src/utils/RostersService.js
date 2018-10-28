import { React,  PropTypes }  from 'react'
import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import { browserHistory } from 'react-router'
import jwtDecode from 'jwt-decode'

import { API_URL } from './constants'

import { 
  GET_ROSTERS_API_PATH,
  MODIFY_ROSTERS_API_PATH  } from './constants'

import { StubAPI } from './Stub'
 

class RostersService { 
 

    constructor() { 
    }

    getAllRosters = () => {
         return this.fetch(`${API_URL}${GET_ROSTERS_API_PATH}`, {
          method: 'GET', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ this._getToken()
          } 
        })
      }

    addRoster = (data) => {
        return this.fetch(`${API_URL}${MODIFY_ROSTERS_API_PATH}`, {
         method: 'POST', 
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': 'Bearer '+ this._getToken()
         },
         body: JSON.stringify(data)
       })
     }

    updateRoster = (data) => {
      return this.fetch(`${API_URL}${MODIFY_EMPLOYEE_API_PATH}`, {
       method: 'PUT', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken()
       },
       body: JSON.stringify(data)
     })
    }

    deleteRoster = (rosterId) => {
      const apiUrl = `${API_URL}${MODIFY_ROSTERS_API_PATH}`+"/"+rosterId
      return this.fetch(apiUrl, {
       method: 'DELETE', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken()
       }
     })
    } 

    _getToken (){
      let loggedInUser = localStorage.getItem('loggedInUser')
      if(loggedInUser){
        loggedInUser = JSON.parse(loggedInUser)
        return loggedInUser.token
      } 
    }

    fetch(url,options) {    
      let response = fetch(url, options)
      .then(response => response.json())    
      return response
    }
}

export default new RostersService()
