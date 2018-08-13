import * as React from 'react';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import SideMenu from '../sideMenu/SideMenu';
import { Route, Switch } from 'react-router-dom';
import UserQueue from '../userQueue/UserQueue';
import constants from '../../constants/constants';
import { InitialState } from '../../models';

import 'react-table/react-table.css';

const testme = () => {
  return <h3>Your test is a success</h3>;
};

const TwoPaneLayout = (props: any) => {
  const tile = constants.getTileByURL(props.location.pathname);
  const hasAccess = constants.hasSecurityFunction(
    props.user,
    tile.securityFunction
  );

  if (!hasAccess) {
    return (
      <Grid
        className="two-pane-layout modal-container"
        id="two-pane-layout"
        fluid={true}
      >
        <Row>
          <Col className="col-fixed">
            <SideMenu {...props} />
          </Col>

          <Col className="col-fluid">
            <div style={{ padding: '20px' }}>
              {' '}
              <h4>
                No access too {tile.title}. Please contact support and request
                access.
              </h4>{' '}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
  return (
    <Grid
      className="two-pane-layout modal-container"
      id="two-pane-layout"
      fluid={true}
    >
      <Row>
        <Col className="col-fixed">
          <SideMenu {...props} />
        </Col>

        <Col className="col-fluid">
          <Switch>
            <Route exact path="/queue" component={UserQueue} />
            <Route exact path="/users" component={testme} />
          </Switch>
        </Col>
      </Row>
    </Grid>
  );
};

const mapStateToProps = (state: InitialState, ownProps: any) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  {}
)(TwoPaneLayout);
