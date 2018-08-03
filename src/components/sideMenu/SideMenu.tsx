import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';

interface Iprops extends React.Props<SideMenu> {
  user: Iuser;
}
class SideMenu extends React.Component<Iprops, {}> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>Welcome {this.props.user.first}</Col>
        </Row>
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

const mapStateToProps = (state: InitialState, ownProps: Iprops) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  {}
)(SideMenu);
