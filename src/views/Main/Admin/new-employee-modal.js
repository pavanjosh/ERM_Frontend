import React from 'react'
import{Button, Modal} from 'react-bootstrap'

export class NewEmployeeModal extends React.Component {

    componentWillMount(){
        this.setState({ showModal: false })
    }
    componentWillReceiveProps(){
        this.setState({ showModal: this.props.showModal })
    }

    close() {
        this.setState({ showModal: false });
    }

    render(){
        return(
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

            <h4>Popover in a modal</h4>
            

            <hr />

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
        )
    }
}

export default NewEmployeeModal