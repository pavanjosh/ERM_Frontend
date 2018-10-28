import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './styles.module.css'
import { Button, Modal,Row,Col, FormControl,ControlLabel, Alert } from 'react-bootstrap'
import {NewEmployeeModal} from './new-employee-modal'
import Datetime from 'react-datetime'
import Moment from 'moment'
import RostersService from '../../../utils/RostersService'
import Select from 'react-select-plus';


 const EMP_PROPS = [
    {name : "loginName" , lable : "Login Name" , sm : 10, required : true, type : 'select'},
    {name : "name" , lable : "Employee Name" , sm : 10, required : true, type : 'text'},
    {name : "rosterStartDate" , lable : "Roster Start Date" ,sm:10 , type : 'date'},
    {name : "rosterEndDate" , lable : "Roster Start Date" ,sm:10 , type : 'date'},
    {name : "location" , lable : "Location" ,sm:10 },
    {name : "role" , lable : "Role" ,sm:10, type : 'multi',  data :[
        { value: 'Supervisor', label: 'Supervisor' },
        { value: 'Covert', label: 'Covert' },
        { value: 'TSM', label: 'TSM' }]      
    }]  
 
export class ManageRosters extends React.Component { 

    editBtn(cell,row) {
         let onEditClick = this.showEditRoster.bind(this, row)
        return  <a href="#" onClick={onEditClick}>Edit Roster</a>;
    }  

    deleteBtn(cell,row){
        let onDeleteClick = this.showDeleteRoster.bind(this, row)
         return  <a href="#" onClick={onDeleteClick}>Delete</a>;
    }

    componentWillMount(){
        this.loadRostersData()
        this.setState({ showModal: false })
        this.setState({ selectedEmp: {} })

    }

    loadRostersData = () =>{
        RostersService.getAllRosters().then(result => {
            if (result.status && result.state != 200) {
              this.setState({pageError: result.message})
              return
            }
             this.setState({ rostersData: result })
          })
     }    


    showModal = () =>{
        this.clearFormMessages()
        this.setState({ showModal: true });
    }    

    closeModal() {
        this.setState({ showModal: false })
    }


    closeConfirmModal() {
        this.setState({ showConfirmModal: false })
    }

    saveRosterData (e){
        if(e) e.preventDefault()
        console.info(this.state.selectedEmp)
        let formErrors = this.validateInputs(EMP_PROPS)
        if(formErrors.length == 0){
            console.info(this.state)
            this.proceedSaveRosterData()
        }

    } 

    proceedSaveRosterData = () =>{
        if(this.sstate.selectedEmp){
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
                        this.loadRostersData()
                    } 
                })
            }else{
                EmployeeService.registerLogin(data).then(result => {
                    if (result.httpStatus && result.httpStatus != 200) {
                        this.setState({ formError: result.errorMessage})
                    }else{
                        this.setState({ formSuccess: "Employee login updated successfully"})
                        this.loadRostersData()
                    } 
                })
            }
         }
    } 

    deleteRoster =(e) =>{
        if(e) e.preventDefault()
        if(this.state.selectedEmp){
            RostersService.deleteRoster(this.state.selectedEmp.id).then(result => {
                if(result){
                    this.setState({ pageSuccess: "Roster deleted successfully."})   
                    this.loadRostersData()
                }else{
                    this.setState({ pageError: "Failed to delete Roster. Please try again."})
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

    showEditRoster(emp, event) {
        this.setState({ modalHeader: "Edit Roster : "+emp.name })
        this.setState({ selectedEmp: emp })
        this.showModal()
    }
    
    
    showEditEmployeeLogin(emp, event) {
        this.setState({ selectedEmp: {...emp}})
        this.showLoginModal()
    }
    showDeleteRoster(emp, event) {
        this.setState({ selectedEmp: emp })
        this.setState({ showConfirmModal: true})        
    }

    addNewRoster =  () =>{
        this.setState({ modalHeader: "Add new Roster" })
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

   handleMultiSelectChange = (input , e) => {
      console.info(input) 
      console.info(e) 
      this.setState({"multiSelectVals":input})
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

   renderText = (input, i) =>{
     return(
        <div> 
            <Col sm={6} key={"lebel"+i}>
                <ControlLabel>{input.lable}</ControlLabel>
            </Col>
            <Col sm={6} key={"val"+i}>
            <ControlLabel>{input.lable}</ControlLabel>
            </Col>
        </div>
    )  
   }

   renderSelect =(input, key) => { 
    
   }


   renderMultiSelect =(input, key) => { 
    let name = input.name
    let requiredClass = input.required ? "input-required" :""
    return (
        <Col sm={input.sm} key={"selectprop"+key} className={requiredClass}>
        <ControlLabel key="label">{input.lable}</ControlLabel>
          <Select
            name ={name} 
            options={input.data}
            placeholder= {"Please select "+ input.label}
            value={this.state.multiSelectVals} 
            onChange={this.handleMultiSelectChange}
            multi
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
            else if(input.type =='date')
                empDeatils.push(this.renderDate(input,i))
            else if(input.type =='text')
                empDeatils.push(this.renderText(input,i))
            else if(input.type == 'multi')
                empDeatils.push(this.renderMultiSelect(input,i))
            else
                empDeatils.push(this.renderInput(input,i))
        }) 
        
        return (           
        <Modal show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>{this.state.modalHeader}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderAlert()} 
              <h4>Roster Detais</h4>
               <Row>
                {empDeatils}                     
              </Row> 
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.saveRosterData.bind(this)}>Save</Button>
              <Button bsStyle="link" onClick={this.closeModal.bind(this)}>Close</Button>
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
                Are you sure you want to delete the Roaster for employee : {this.state.selectedEmp.name}               
              </Col> 
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.deleteRoster.bind(this)}>Yes</Button>
              <Button bsStyle="link" onClick={this.closeConfirmModal.bind(this)}>No</Button>
            </Modal.Footer>
          </Modal>
        )
    }

    render(){
        return(
            <div>
                 {this.renderPageAlert()} 
                <Button bsStyle="primary" onClick ={this.addNewRoster}>Add New Roster</Button>
                <BootstrapTable data={this.state.rostersData} height='40em' scrollTop={ 'Top' } striped hover condensed bordered={ false } search>
                    <TableHeaderColumn width='20em'  isKey dataField='loginName'  dataSort={ true } >Login Name</TableHeaderColumn>
                    <TableHeaderColumn width='20em'  dataField='name'  dataSort={ true } >Employee Name</TableHeaderColumn>
                    <TableHeaderColumn width='15em'  dataField='rosterStartDate'  dataSort={ true }>Roster Start Date</TableHeaderColumn>
                    <TableHeaderColumn width='15em'  dataField='rosterEndDate'  dataSort={ true }>Roster End Date</TableHeaderColumn>
                    <TableHeaderColumn width='8em'  dataField='location'  dataSort={ true }>Location</TableHeaderColumn>
                    <TableHeaderColumn width='20em'  dataField='role'  dataSort={ true }>Role</TableHeaderColumn>
                    <TableHeaderColumn dataField='edit' width='10em' dataFormat={ this.editBtn.bind(this)}></TableHeaderColumn>
                    <TableHeaderColumn dataField='edit' width='4em' dataFormat={ this.deleteBtn.bind(this)}></TableHeaderColumn>
                </BootstrapTable>
                {this.renderModel()}
                {this.renderConfirmModel()}
            </div>
        )
    }
}

export default ManageRosters
