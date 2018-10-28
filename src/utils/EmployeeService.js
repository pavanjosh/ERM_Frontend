import { React,  PropTypes }  from 'react'
import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import { browserHistory } from 'react-router'
import jwtDecode from 'jwt-decode'

import { API_URL } from './constants'

import { 
  GET_EMPLOYEES_API_PATH,
  MODIFY_EMPLOYEE_API_PATH,
  GET_LOGIN_API_PATH,
  REG_LOGIN_API_PATH,
  UPDATE_LOGIN_API_PATH } from './constants'

import { StubAPI } from './Stub'
 

class EmployeeService { 
 

    constructor() { 
    }

    getAllEmployees = () => {
         return this.fetch(`${API_URL}${GET_EMPLOYEES_API_PATH}`, {
          method: 'GET', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ this._getToken()
          } 
        })
      }

      addEmployee = (data) => {
        return this.fetch(`${API_URL}${MODIFY_EMPLOYEE_API_PATH}`, {
         method: 'POST', 
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': 'Bearer '+ this._getToken()
         },
         body: JSON.stringify(data)
       })
     }

     updateEmployee = (data) => {
      return this.fetch(`${API_URL}${MODIFY_EMPLOYEE_API_PATH}`, {
       method: 'PUT', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken()
       },
       body: JSON.stringify(data)
     })
    }

    deleteEmployee = (empId) => {
      const apiUrl = `${API_URL}${MODIFY_EMPLOYEE_API_PATH}`+"/"+empId
      return this.fetch(apiUrl, {
       method: 'DELETE', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken()
       }
     })
    }

    registerLogin = (data) => {
       return this.fetch(`${API_URL}${REG_LOGIN_API_PATH}`, {
       method: 'POST', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken()
       },
       body: JSON.stringify(data)
     })
    }

    updateLogin = (data) => {
       return this.fetch(`${API_URL}${UPDATE_LOGIN_API_PATH}`, {
        method: 'POST', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken()
       },
       body: JSON.stringify(data)
     })
    }

    getEmployeeLogin = (selectedEmp) => {
      console.info(selectedEmp)
      let apiPath = API_URL + GET_LOGIN_API_PATH + selectedEmp.loginName
      return this.fetch(apiPath, {
       method: 'GET', 
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ this._getToken(),
         'X-Employee-Id': selectedEmp.id,
       } 
     })
    }


    saveEmployees(employeeDetails) {
      localStorage.setItem('employeeDetails', JSON.stringify(employeeDetails))
    }
  
    getEmployees() {
      return JSON.parse(localStorage.getItem('employeeDetails'))
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

export default new EmployeeService()
