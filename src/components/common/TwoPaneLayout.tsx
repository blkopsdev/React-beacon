import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import SideMenu from '../sideMenu/SideMenu';
import { Route, Switch } from 'react-router-dom';
import UserQueue from '../userQueue/UserQueue';
import 'react-table/react-table.css';

const testme = () => {
  return <h3>Your test is a success</h3>;
};
const TwoPaneLayout = (props: any) => {
  return (
    <Grid>
      <Row>
        <Col xs={4}>
          <SideMenu {...props} />
        </Col>

        <Col xs={8}>
          <Switch>
            <Route exact path="/queue" component={UserQueue} />
            <Route exact path="/users" component={testme} />
          </Switch>
        </Col>
      </Row>
    </Grid>
  );
};

export default TwoPaneLayout;
