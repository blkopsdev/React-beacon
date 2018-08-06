/*
* The New User Queue
*/
import * as React from 'react';
import { connect } from 'react-redux';
import { getUserQueue, approveUser } from '../../actions/userActions';
import { InitialState, ItempUser } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';

interface Iprops extends RouteComponentProps<{}> {
  getUserQueue: any;
  userQueue: ItempUser[];
  approveUser: any;
}

interface Istate {
  showEditUserModal: boolean;
}

class UserQueue extends React.Component<Iprops, Istate> {
  public columns: any[];
  constructor(props: Iprops) {
    super(props);
    this.ApproveCell = this.ApproveCell.bind(this);
    this.columns = [
      {
        id: 'name',
        Header: 'Name',
        accessor: 'user',
        Cell: (row: any) => (
          <span>
            {row.value.first} {row.value.last}
          </span>
        )
      },
      {
        Header: 'Email',
        accessor: 'user.email'
      },
      {
        id: 'company',
        Header: 'Company',
        accessor: 'user.tempCompany'
      },
      {
        Header: 'Created',
        accessor: 'createDate'
      },
      {
        Header: 'Approve?',
        accessor: 'user',
        Cell: this.ApproveCell
      }
    ];
  }
  componentWillMount() {
    // refresh the userQueue every time the component mounts
    this.props.getUserQueue(1, '');
  }

  // handleTableProps(state: any, rowInfo: any, column: any, instance: any) {

  // }
  ApproveCell = (row: any) => {
    return (
      <div>
        <Button
          onClick={() => {
            this.props.approveUser(row.value.id, true);
          }}
        >
          approve
        </Button>
        <Button>deny</Button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <ReactTable data={this.props.userQueue} columns={this.columns} />
      </div>
    );
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
    getUserQueue,
    approveUser
  }
)(UserQueue);
