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
  title: string | JSX.Element;
  container: any;
}

interface State {
  classNameAnimation: string;
}

class CommonModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      classNameAnimation: ''
    };
  }

  render() {
    const className = `${this.props.className} ${
      this.state.classNameAnimation
    } slide-modal from-left`;
    return (
      <Modal
        show={this.props.modalVisible}
        onHide={this.props.onHide}
        className={className}
        onExiting={() => {
          this.setState({ classNameAnimation: '' });
        }}
        onEntering={() => {
          this.setState({ classNameAnimation: 'after-open' });
        }}
        onEntered={() => {
          setTimeout(() => {
            this.setState({ classNameAnimation: 'after-open after-entered' });
          }, 200);
        }}
        container={this.props.container}
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="clearfix">{this.props.body}</Modal.Body>

        <Modal.Footer>{this.props.footer}</Modal.Footer>
      </Modal>
    );
  }
}

export default CommonModal;
