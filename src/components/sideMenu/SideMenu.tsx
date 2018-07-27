import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

class SideMenu extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>Dashboard</Col>
        </Row>
        <Row>
          <Col xs={12}>Training</Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  {}
)(SideMenu);
