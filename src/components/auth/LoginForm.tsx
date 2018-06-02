import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { InitialState, Iuser } from '../../models';
import { userLogin, userLogout } from '../../actions/userActions';
// import { authContext } from '../../constants/adalConfig';
import { withRouter, RouteComponentProps } from 'react-router-dom';

// import { Col, Grid, Row, Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';

interface Iprops extends RouteComponentProps<{}> {
  userLogin?: any;
  userLogout?: any;
  user?: Iuser;
}

class LoginForm extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);

    this.login = this.login.bind(this);
  }
  login() {
    this.props.userLogin().then(() => {
      console.log('logged in and routing to dashboard');
      this.props.history.push('/dashboard');
    });
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <Button bsStyle="default" onClick={this.props.userLogout}>
                Logout
              </Button>
              <Button bsStyle="default" onClick={this.login}>
                Login With to app
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: InitialState, ownProps: any) => {
  return {
    user: state.user
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { userLogin, userLogout }
  )(LoginForm)
);
