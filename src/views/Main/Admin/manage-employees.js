import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './styles.module.css'
import { Button, Modal,Row,Col, FormControl,ControlLabel, Alert } from 'react-bootstrap'
import {NewEmployeeModal} from './new-employee-modal'
import Datetime from 'react-datetime'
import Moment from 'moment'
import EmployeeService from '../../../utils/EmployeeService'
import Select from 'react-select-plus';


 const EMP_PROPS = [
    //{name : "employeeId" , lable : "Employee Id" , sm : 10, required : true},
    {name : "name" , lable : "Employee Name" , sm : 10, required : true},
    {name : "phoneNumber" , lable : "Phone No" , sm : 10, required : true},
    {name : "emailId" , lable : "Email" , sm : 10, required : true},
    {name : "gender" , lable : "Gender" , sm : 10, required : true, type : 'select',
        data :[
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' }]      
    },
    {name : "uniformSizes" , lable : "Uniform Sizes" ,sm : 10,  required : true , type : 'select',
    data :[
    { value: 'XS', label: 'Extra Small' },
    { value: 'S', label: 'Small'},
    { value: 'M', label: 'Medium' },
    { value: 'L', label: 'Large'},
    { value: 'XL', label: 'Extra Large' },
    { value: 'XXL', label: 'XXL'}]      
    },
    {name : "active" , lable : "Status" ,sm : 10,  required : true, type : 'select',
    data :[
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }]      
    }
 ]

 const EMP_LOGIN_PROPS = [
    {name : "loginName" , lable : "Login Name" , sm : 10, required : true},
    {name : "password" , lable : "Password" , sm : 10, required : true},

 ]

 const OTHER_PROPS = [
    {name : "nswSecurity" , lable : "NSW Security" , sm : 6 ,required : true},
    {name : "securityExpiry" , lable : "Security Expiry" ,sm:6, required : true , type : 'date'},
    {name : "miscNo" , lable : "Misc No" , sm : 6  },
    {name : "miscExpiry" , lable : "Misc Expiry" ,sm:6 , type : 'date'},
    {name : "rsa" , lable : "RSA" , sm : 6  },
    {name : "rsaNumber" , lable : "RSA Expiry" ,sm:6 , type : 'date'},
    {name : "trafficControl" , lable : "Traffic Control" , sm : 6  },
    {name : "trafficControlExpiry" , lable : "TC Expiry" ,sm:6 , type : 'date'},
    {name : "securityClass  " , lable : "Class" , sm : 6 },
    {name : "pfso" , lable : "PSFP" ,sm:6 },
    {name : "firstAidExpiry" , lable : "First Aid Expiry" ,sm:6 , type : 'date'},
    {name : "paNswInd" , lable : "PA NSW IND" ,sm:6 , type : 'date'},
    {name : "spotlessInd" , lable : "Spotless IND" ,sm:6 , type : 'date'}
 ]
export class ManageEmployees extends React.Component { 

    editBtn(cell,row) {
         let onEditClick = this.showEditEmployee.bind(this, row)
        return  <a href="#" onClick={onEditClick}>Edit Details</a>;
    }

    editLoginBtn(cell,row) {
        let onEditClick = this.showEditEmployeeLogin.bind(this, row)
       return  <a href="#" onClick={onEditClick}>Edit Login</a>;
   }

    deleteBtn(cell,row){
        let onDeleteClick = this.showDeleteEmployee.bind(this, row)
         return  <a href="#" onClick={onDeleteClick}>Delete</a>;
    }

    componentWillMount(){
        let data = this.getEmployees()
        this.setState({ showModal: false })
        this.setState({ selectedEmp: {} })

    }

    getEmployees = () =>{
       let employeeData
       EmployeeService.getAllEmployees().then(result => {
            if (result.status && result.state != 200) {
              this.setState({employeeLoadError: result.message})
              return
            }
            EmployeeService.saveEmployees(result)        
            this.setState({ employeeData: result })
          })
     }
    
    getEmployeesData = () => {
        let testData = localStorage.getItem('testdata')
        if(!testData)
        return JSON.parse(testData)
    }

    showModal = () =>{
        this.clearFormMessages()
        this.setState({ showModal: true });
    }
    
    showLoginModal = () =>{
        this.clearFormMessages()
        this.setState({ showLoginModal: true });
    }
    closeModal() {
        this.setState({ showModal: false })
    }

    closeLoginModal () {
        this.setState({ showLoginModal: false })
    }

    closeConfirmModal() {
        this.setState({ showConfirmModal: false })
    }

    saveEmpData (e){
        if(e) e.preventDefault()
        console.info(this.state.selectedEmp)
        let formErrors = this.validateInputs(EMP_PROPS)
        if(formErrors.length == 0){
            console.info(this.state)
            this.proceedSaveEmpData()
        }

    }

    saveEmpLoginData (e){
        if(e) e.preventDefault()
        console.info(this.state.selectedEmp)
        let formErrors = this.validateInputs(EMP_LOGIN_PROPS)
        if(formErrors.length == 0){
            console.info(this.state)
            this.proceedSaveEmpLoginData()
        }

    }

    proceedSaveEmpLoginData = () =>{
        if(this.state.selectedEmp){
            const selectedEmp = this.state.selectedEmp
            let data = {
                employeeId : selectedEmp.id,
                loginName : selectedEmp.loginName,
                password : selectedEmp.password 
            }

            if(this.isLoginNamePresent(selectedEmp.id)){
                EmployeeService.updateLogin(data).then(result => {
                    if (result.httpStatus && result.httpStatus != 200) {
                        this.setState({ formError: result.errorMessage})
                    }else{
                        this.setState({ formSuccess: "Employee login created successfully"})
                        this.getEmployees()
                    } 
                })
            }else{
                EmployeeService.registerLogin(data).then(result => {
                    if (result.httpStatus && result.httpStatus != 200) {
                        this.setState({ formError: result.errorMessage})
                    }else{
                        this.setState({ formSuccess: "Employee login updated successfully"})
                        this.getEmployees()
                    } 
                })
            }
         }
    }

    isLoginNamePresent = (id) =>{
       return this.state.employeeData.filter(emp => (emp.id ==id && emp.loginName)).length != 0
    }

    deleteEmployee =(e) =>{
        if(e) e.preventDefault()
        if(this.state.selectedEmp){
            EmployeeService.deleteEmployee(this.state.selectedEmp.id).then(result => {
                if(result){
                    this.setState({ pageSuccess: "Employee deleted successfully."})   
                    this.getEmployees()
                }else{
                    this.setState({ pageError: "Failed to delete employee. Please try again."})
                }
             })
        }
        this.closeConfirmModal()
    }

    clearFormMessages = () =>{
        this.setState({ formSuccess: ""})
        this.setState({ formError: ""})
        this.setState({ pageError: ""})
        this.setState({ pageSuccess: ""})
    }

    showEditEmployee(emp, event) {
        this.setState({ modalHeader: "Edit employee : "+emp.name })
        this.setState({ selectedEmp: emp })
        this.showModal()
    }
    
    
    showEditEmployeeLogin(emp, event) {
        this.setState({ selectedEmp: {...emp}})
        this.showLoginModal()
    }
    showDeleteEmployee(emp, event) {
        this.setState({ selectedEmp: emp })
        this.setState({ showConfirmModal: true})        
    }

    addEmployee =  () =>{
        this.setState({ modalHeader: "Add new employee" })
        this.setState({ selectedEmp: {} })
        this.showModal()
    }


    proceedSaveEmpData = () =>{
        if(this.state.selectedEmp){
            const selectedEmp = this.state.selectedEmp
              if(selectedEmp.id && selectedEmp.id != ''){
                  EmployeeService.updateEmployee(selectedEmp).then(result => {
                    if (result.httpStatus && result.httpStatus != 200) {
                        this.setState({ formError: result.errorMessage})
                    }else{
                        this.setState({ formSuccess: "Employee updated successfully"})
                        this.getEmployees()
                    } 
                })
              }else{
                EmployeeService.addEmployee(selectedEmp).then(result => {
                    if (result.httpStatus && result.httpStatus != 200) {
                        this.setState({ formError: result.errorMessage})
                    }else{
                        this.getEmployees()
                        this.setState({ formSuccess: "Employee added successfully"})
                    }                    
                  })
              }
                        
        }
    }

    validateInputs = (inputs) =>{
         let formErrors = []
        inputs.map((input, i) =>{
            const name = input.name
            const val = this.state.selectedEmp[name]
            if(input.required & (val == null || val.length == 0))
               formErrors.push(input.lable)
        })
        if(formErrors.length > 0)
            this.setState({ formError: "Please complete required fields "+ formErrors.toString() })
        else
            this.setState({ formError: ""})

        return formErrors
    }
    


    updateState = (e) =>{        
        if(e){
            const { name, value, type } = e.target
            let selectedEmp = this.state.selectedEmp
            selectedEmp[name] = value
            this.setState({"selectedEmp":selectedEmp})
         }       
   }

   updateDate = (input,date) => {
    const name = input.name

    if (!(typeof date === 'string' || date instanceof String) && date.isValid()) {
        let selectedEmp = this.state.selectedEmp
        selectedEmp[name] = date.format("DD/MM/YYYY")
        this.setState({"selectedEmp":selectedEmp})
    }else{
        this.setState({[name]:null})
    }
   }

   handleSelectChange = (input , e) => {
    if(e){
      const value = e.value
      const name = input.name
      let selectedEmp = this.state.selectedEmp
      selectedEmp[name] = value
      this.setState({"selectedEmp":selectedEmp})
     }
   }

   renderInput = (input, i) =>{
    let name = input.name
    let requiredClass = input.required ? "input-required" :""
    return(
        <Col sm={input.sm} key={"empprop"+i} className={requiredClass}>
        <ControlLabel key="label">{input.lable}</ControlLabel>
        <FormControl 
            name ={name} 
            value ={this.state.selectedEmp[name]} 
            onChange={this.updateState}
            placeholder={"Please enter "+ input.lable}></FormControl> 
        </Col>
    )  
   }

   renderSelect =(input, key) => { 
    let name = input.name
    let requiredClass = input.required ? "input-required" :""
    return (
        <Col sm={input.sm} key={"selectprop"+key} className={requiredClass}>
        <ControlLabel key="label">{input.lable}</ControlLabel>
          <Select
            name ={name} 
            options={input.data}
            placeholder= {"Please select "+ input.label}
            value={this.state.selectedEmp[name]} 
            onChange={this.handleSelectChange.bind(this, input)}
          />
         </Col>
    )
  }

   renderDate = (input, i) =>{
    let {name, label} = input
    let requiredClass = input.required ? "input-required" :""

    return(
        <Col sm={input.sm} key={"otherprop"+i} className={requiredClass}>
        <ControlLabel key="label">{input.lable}</ControlLabel>
            <Datetime 
                key = {i}
                value ={this.state.selectedEmp[name]} 
                ref= {name}
                id= {name}
                dateFormat= "DD/MM/YYYY"
                onChange= {this.updateDate.bind(this,input)} 
                timeFormat= {false} 
                />
        </Col>
    )  
   }
   renderAlert =  () => {
     let alert 
     let style = (this.state['formError'] && this.state['formError'] != '' ) ? 'danger' : 'success'
    if(this.state['formError'] || this.state['formSuccess']){
        alert = (
            <Alert bsStyle={style}>
            {this.state['formError'] || this.state['formSuccess']}
          </Alert>
        ) 
    }
    return alert
   }

   renderPageAlert =  () => {
        let alert 
        let style = (this.state['pageError'] && this.state['pageError'] != '' ) ? 'danger' : 'success'
    if(this.state['pageError'] || this.state['pageSuccess']){
        alert = (
            <Alert bsStyle={style}>
            {this.state['pageError'] || this.state['pageSuccess']}
            </Alert>
        ) 
    }
    return alert
    }
   
    renderModel = () =>{
        let empDeatils = []
        let otherDeatils = []
        EMP_PROPS.map((input, i) => {
            if(input.type =='select')
                empDeatils.push(this.renderSelect(input,i))
            else
                empDeatils.push(this.renderInput(input,i))
        })
        OTHER_PROPS.map((input, i) => {
            if(input.type =='date')
                otherDeatils.push(this.renderDate(input,i))
            else
                otherDeatils.push(this.renderInput(input,i))
        })
            
       
        
        return (           
        <Modal bsSize="large" show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>{this.state.modalHeader}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderAlert()} 
              <h4>Employee Detais</h4>
              <div className="modal-div">  
              <Row>
                {empDeatils}                     
              </Row>
              </div>
              <div className="modal-div modal-left">  
                <Row>
                    {otherDeatils}                    
                </Row>
              </div>    
  
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.saveEmpData.bind(this)}>Save</Button>
              <Button bsStyle="link" onClick={this.closeModal.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal>
        )
    }


    renderLoginModel = () =>{ 

        let loginDeatils = []
        EMP_LOGIN_PROPS.map((input, i) => {            
            loginDeatils.push(this.renderInput(input,i))
        })
        let empName = this.state.selectedEmp.name
        return (           
        <Modal show={this.state.showLoginModal} onHide={this.closeLoginModal}>
            <Modal.Header>
              <Modal.Title>Create/Change Employee Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderAlert()} 
              <Row>
              <Col sm= {6}><ControlLabel>Employee Name </ControlLabel></Col> 
              <Col sm= {6}>{empName}</Col> 
              </Row>
              <Row>
                {loginDeatils}                     
              </Row>  
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.saveEmpLoginData.bind(this)}>Save</Button>
              <Button bsStyle="link" onClick={this.closeLoginModal.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal>
        )
    }

    renderConfirmModel = () =>{  
        
        return (           
        <Modal show={this.state.showConfirmModal} onHide={this.closeConfirmModal}>
            <Modal.Header>
              <Modal.Title>Confirm delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>            
              <Col>
                Are you sure you want to delete the employee : {this.state.selectedEmp.name}               
              </Col> 
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.deleteEmployee.bind(this)}>Yes</Button>
              <Button bsStyle="link" onClick={this.closeConfirmModal.bind(this)}>No</Button>
            </Modal.Footer>
          </Modal>
        )
    }

    render(){
        return(
            <div>
                 {this.renderPageAlert()} 
                <Button bsStyle="primary" onClick ={this.addEmployee}>Add New Employee</Button>
                <BootstrapTable data={this.state.employeeData} height='40em' scrollTop={ 'Top' } striped hover condensed bordered={ false } search>
                    <TableHeaderColumn width='20em'  dataField='name'  dataSort={ true } >Name</TableHeaderColumn>
                    <TableHeaderColumn width='20em'  isKey dataField='loginName'  dataSort={ true } >Login Name</TableHeaderColumn>
                    <TableHeaderColumn width='15em'  dataField='nswSecurity'  dataSort={ true }>NSW SECURITY</TableHeaderColumn>
                    <TableHeaderColumn width='15em'  dataField='securityExpiry'  dataSort={ true }>SECURITY_EXPIRY</TableHeaderColumn>
                    <TableHeaderColumn width='8em'  dataField='securityClass'  dataSort={ true }>CLASS</TableHeaderColumn>
                    <TableHeaderColumn width='20em'  dataField='emailId'  dataSort={ true }>EMAIL</TableHeaderColumn>
                    <TableHeaderColumn width='10em'  dataField='phoneNumber'  dataSort={ true }>PHONE_NO</TableHeaderColumn>
                    <TableHeaderColumn width='8em'  dataField='gender'  dataSort={ true }>GENDER</TableHeaderColumn>
                    <TableHeaderColumn dataField='edit' width='10em' dataFormat={ this.editLoginBtn.bind(this)}></TableHeaderColumn>
                    <TableHeaderColumn dataField='edit' width='10em' dataFormat={ this.editBtn.bind(this)}></TableHeaderColumn>
                    <TableHeaderColumn dataField='edit' width='4em' dataFormat={ this.deleteBtn.bind(this)}></TableHeaderColumn>
                </BootstrapTable>
                {this.renderModel()}
                {this.renderLoginModel()}
                {this.renderConfirmModel()}
            </div>
        )
    }
}

export default ManageEmployees
