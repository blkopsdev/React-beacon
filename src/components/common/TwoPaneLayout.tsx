/*
* TwoPaneLayout verifies that the user has access to this feature, then either shows the component or lets them know they do not have access
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import SideMenu from '../sideMenu/SideMenu';
import { Route, Switch } from 'react-router-dom';
import ManageUserQueue from '../manageUserQueue/ManageUserQueue';
import ManageUser from '../manageUser/ManageUser';
import ManageTeam from '../manageTeam/ManageTeam';
import ManageInventory from '../manageInventory/ManageInventory';
import ManageProductQueue from '../manageProductQueue/ManageProductQueue';
import ManageJob from '../manageJob/ManageJob';
import ManageLocation from '../manageLocation/ManageLocation';
import Training from '../training/Training';
import ManageTraining from '../manageTraining/ManageTraining';
import { constants } from 'src/constants/constants';
import { IinitialState } from '../../models';
import ManageReport from '../manageReport/ManageReport';

import 'react-table/react-table.css';
import ManageMeasurementPointList from '../manageMeasurementPointLists/ManageMeasurementPointLists';
import ManageBrand from '../manageBrand/ManageBrand';
import ManageCustomerAndFacility from '../manageCustomerAndFacility/ManageCustomerAndFacility';
import ManageAlert from '../manageAlert/ManageAlert';
import { msalApp, handleRedirectCallback } from '../auth/Auth-Utils';
// const testme = () => {
//   return <h3>Your test is a success</h3>;
// };

const TwoPaneLayout = (props: any) => {
  const tile = constants.getTileByURL(props.location.pathname);
  const hasAccess = constants.hasSecurityFunction(
    props.user,
    tile.securityFunction
  );
  console.warn('setting redirect callback from twopane');
  msalApp.handleRedirectCallback(handleRedirectCallback);

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
              <h4>
                No access to {tile.title}. Please contact support and request
                access.
              </h4>
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
      <div id="modal-one" />
      <div id="modal-two" />
      <Row>
        <Col className="col-fixed">
          <SideMenu {...props} />
        </Col>

        <Col className="col-fluid">
          <Switch>
            <Route exact path="/queue" component={ManageUserQueue} />
            <Route exact path="/users" component={ManageUser} />
            <Route exact path="/team" component={ManageTeam} />
            <Route exact path="/inventory" component={ManageInventory} />
            <Route exact path="/productqueue" component={ManageProductQueue} />
            <Route exact path="/managejobs" component={ManageJob} />
            <Route exact path="/reports" component={ManageReport} />
            <Route exact path="/locations" component={ManageLocation} />
            <Route exact path="/brands" component={ManageBrand} />
            <Route exact path="/alerts" component={ManageAlert} />
            <Route
              exact
              path="/customer-and-facility"
              component={ManageCustomerAndFacility}
            />
            <Route
              path="/training/:courseID?/:lessonID?/:quizID?"
              component={Training}
            />
            <Route exact path="/manageTraining" component={ManageTraining} />
            <Route
              exact
              path="/measurements"
              component={ManageMeasurementPointList}
            />
            <Route
              exact
              path="/customermeasurements"
              component={ManageMeasurementPointList}
            />
          </Switch>
        </Col>
      </Row>
    </Grid>
  );
};

const mapStateToProps = (state: IinitialState, ownProps: any) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  {}
)(TwoPaneLayout);
