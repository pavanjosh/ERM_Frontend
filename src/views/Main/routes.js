import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from '../../utils/AuthService'
import Container from './Container'
import Login from './Login/Login'
import Supervisor from './Supervisor/Supervisor'
import Covert from './Covert/Covert'
import Tsm from './Tsm/Tsm'
import Admin from './Admin/Admin'
import ManageEmployees from './Admin/manage-employees'
import ManageReports from './Admin/manage-reports'
import ManageRosters from './Admin/manage-rosters'

const auth = new AuthService()

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.isAuthenticated()) {
    replace({ pathname: '/login' })
  }
}

const requireAdmin = (nextState, replace) => {
 if (!auth.isAuthenticated() || !auth.isAdmin()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/login" />
      <Route path="login" component={Login} />
      <Route path="supervisor" component={Supervisor} onEnter={requireAuth} />
      <Route path="covert" component={Covert} onEnter={requireAuth} />
      <Route path="tsm" component={Tsm} onEnter={requireAuth} />
      <Route path="admin">
        <IndexRedirect to="/admin/manage-employees" />
        <Route path="manage-employees" component={ManageEmployees} onEnter={requireAdmin} />
        <Route path="manage-reports" component={ManageReports} onEnter={requireAdmin} />
        <Route path="manage-rosters" component={ManageRosters} onEnter={requireAdmin} />
      </Route>

    </Route>
  )
}

export default makeMainRoutes
