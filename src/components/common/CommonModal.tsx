/*
* Common Modal displays the modal
*/

import * as React from 'react';
import { Modal } from 'react-bootstrap';

interface Props extends React.Props<CommonModal> {
  modalVisible: boolean;
  onHide: any;
  className: string;
  body: JSX.Element;
  footer?: JSX.Element;
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
        onHide={this.props.onHide}
        className={this.props.className}
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.body}</Modal.Body>

        <Modal.Footer>{this.props.footer}</Modal.Footer>
      </Modal>
    );
  }
}

export default CommonModal;
