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
import CommonModal from '../common/CommonModal';

interface Iprops extends RouteComponentProps<{}> {
  getUserQueue: any;
  userQueue: ItempUser[];
  approveUser: any;
}

interface Istate {
  showEditUserModal: boolean;
  selectedRow: any;
}

class UserQueue extends React.Component<Iprops, Istate> {
  public columns: any[];
  public buttonInAction = false;
  constructor(props: Iprops) {
    super(props);
    this.ApproveCell = this.ApproveCell.bind(this);
    this.getTrProps = this.getTrProps.bind(this);
    this.state = {
      showEditUserModal: false,
      selectedRow: null
    };
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
          onClick={(e: React.MouseEvent<Button>) => {
            this.buttonInAction = true;
            this.props
              .approveUser(row.value.id, true)
              .then((blah: any) => {
                this.buttonInAction = false;
              })
              .catch((err: any) => {
                this.buttonInAction = false;
              });
          }}
        >
          approve
        </Button>
        <Button>deny</Button>
      </div>
    );
  };
  getTrProps = (state: any, rowInfo: any) => {
    // console.log("ROWINFO", rowInfo);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            this.setState({
              selectedRow: rowInfo.index,
              showEditUserModal: true
            });
          }
        },
        style: {
          background:
            rowInfo.index === this.state.selectedRow ? '#00afec' : 'white',
          color: rowInfo.index === this.state.selectedRow ? 'white' : 'black'
        }
      };
    } else {
      return {};
    }
  };

  render() {
    return (
      <div>
        <ReactTable
          data={this.props.userQueue}
          columns={this.columns}
          getTrProps={this.getTrProps}
        />
        <CommonModal
          modalVisible={this.state.showEditUserModal}
          cancel={() => {
            this.setState({ showEditUserModal: false });
          }}
          cancelText="cancel"
          submit={() => {
            this.setState({ showEditUserModal: false });
          }}
          submitText="Approve"
          bsSize="sm"
          className="user-edit"
          body={<div>hello edit user modal</div>}
          title="Edit and New User"
        />
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
