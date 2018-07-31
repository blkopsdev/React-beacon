/*
* The New User Queue
*/
import * as React from 'react';
import { connect } from 'react-redux';
import { getUserQueue } from '../../actions/userActions';
import { InitialState, IuserQueue } from '../../models';
import { RouteComponentProps } from 'react-router-dom';

interface Iprops extends RouteComponentProps<{}> {
  getUserQueue: any;
  userQueue: IuserQueue;
}

interface Istate {
  showEditUserModal: boolean;
}

class UserQueue extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
  }
  componentWillMount() {
    // refresh the userQueue every time the component mounts
    this.props.getUserQueue(1, '');
  }
  render() {
    return <div> it works! </div>;
  }
}

const mapStateToProps = (state: InitialState, ownProps: any) => {
  return {
    user: state.user,
    userQueue: state.userQueue
  };
};
export default connect(
  mapStateToProps,
  {
    getUserQueue
  }
)(UserQueue);
