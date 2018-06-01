import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { InitialState, Iuser } from '../../models';
import { userLogin, getToken } from '../../actions/userActions';
// import { Col, Grid, Row, Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';

interface Iprops extends React.Props<LoginForm> {
  userLogin?: any;
  getToken?: any;
  user?: Iuser;
  // dispatch: (action: any) => void;
}
interface Istate {
  user: string;
}

class LoginForm extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <Button bsStyle="default" onClick={this.props.getToken}>
                Login With Azure
              </Button>
              <Button bsStyle="default" onClick={this.props.userLogin}>
                Login With to app
              </Button>
            </Col>
          </Row>
        </Grid>
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
  { userLogin, getToken }
)(LoginForm);
