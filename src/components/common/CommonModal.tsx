/*
* Common Modal displays the modal
*/

import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Props extends React.Props<CommonModal> {
  modalVisible: boolean;
  cancel: any;
  cancelText: string;
  submit: any;
  submitText: string;
  bsSize: any;
  className: string;
  body: JSX.Element;
  title: string;
}

interface State {
  temp: any;
}

class CommonModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      temp: ''
    };
  }

  render() {
    return (
      <Modal
        show={this.props.modalVisible}
        onHide={this.props.cancel}
        bsSize={this.props.bsSize}
        className={this.props.className}
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <form id="commonForm" onSubmit={this.props.submit}>
          <Modal.Body>{this.props.body}</Modal.Body>

          <Modal.Footer>
            <Button
              className="pull-left cancel"
              type="button"
              onClick={this.props.cancel}
            >
              {this.props.cancelText}
            </Button>
            <Button
              bsStyle="warning"
              className="pull-right submit"
              type="submit"
              onClick={this.props.submit}
            >
              {this.props.submitText}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default CommonModal;
