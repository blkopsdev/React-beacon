/*
* The New User Queue
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getUserQueue,
  approveUser,
  updateUser
} from '../../actions/userActions';
import { InitialState, IqueueUser, Iuser } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import CommonModal from '../common/CommonModal';
import UserQueueForm from './UserQueueForm';
import Banner from '../common/Banner';
import { FontAwesomeIcon } from '../../../node_modules/@fortawesome/react-fontawesome';

interface Iprops extends RouteComponentProps<{}> {
  getUserQueue: any;
  userQueue: IqueueUser[];
  approveUser: any;
  updateUser: any;
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
        accessor: 'id',
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
          bsStyle="link"
          className="pull-right"
          onClick={(e: React.MouseEvent<Button>) => {
            this.buttonInAction = true;
            this.props
              .approveUser(row.value, true)
              .then((blah: any) => {
                this.buttonInAction = false;
              })
              .catch((err: any) => {
                this.buttonInAction = false;
              });
          }}
        >
          <FontAwesomeIcon icon={['far', 'check']} />
        </Button>
        <Button bsStyle="link" className="pull-right">
          <FontAwesomeIcon icon={['far', 'times']} />
        </Button>
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
      <div className="user-queue">
        <Banner title="New User Queue" img="http://placekitten.com/1440/60" />
        <ReactTable
          data={this.props.userQueue}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.userQueue.length}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={1}
        />
        <CommonModal
          modalVisible={this.state.showEditUserModal}
          className="user-edit"
          onHide={() => {
            this.setState({ showEditUserModal: false });
          }}
          body={
            <UserQueueForm
              handleSubmit={(user: Iuser) => {
                this.props.updateUser(user);
                this.setState({ showEditUserModal: false });
              }}
              handleCancel={() => {
                this.setState({ showEditUserModal: false });
              }}
              user={this.props.userQueue[this.state.selectedRow]}
            />
          }
          title="New User"
          container={document.getElementById('two-pane-layout')}
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
    approveUser,
    updateUser
  }
)(UserQueue);
