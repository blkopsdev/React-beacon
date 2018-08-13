/*
* The New User Queue
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getUserQueue,
  approveUser,
  updateUser,
  rejectUser
} from '../../actions/userActions';
import { InitialState, IqueueUser, Iuser, Itile } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import CommonModal from '../common/CommonModal';
import UserQueueForm from './UserQueueForm';
import Banner from '../common/Banner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import constants from '../../constants/constants';
import * as moment from 'moment';
import SearchTableForm from '../common/SearchTableForm';

interface Iprops extends RouteComponentProps<{}> {
  getUserQueue: any;
  userQueue: IqueueUser[];
  approveUser: (value: string) => Promise<void>;
  updateUser: (value: Iuser, v: string) => Promise<void>;
  rejectUser: (value: string) => Promise<void>;
  loading: boolean;
}

interface Istate {
  showEditUserModal: boolean;
  selectedRow: any;
  currentTile: Itile;
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
      selectedRow: null,
      currentTile: {
        icon: '',
        title: '',
        src: '',
        color: '',
        width: 359,
        height: 136,
        url: '',
        securityFunction: ''
      }
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
        accessor: ({ createDate }: Iuser) => {
          return moment.utc(createDate).format('MM/DD/YYYY hh:mm a');
        },
        id: 'created'
      },
      {
        Header: 'Approve?',
        accessor: 'id',
        Cell: this.ApproveCell,
        maxWidth: 90
      }
    ];
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    // refresh the userQueue every time the component mounts
    this.props.getUserQueue(1, '');
  }

  // handleTableProps(state: any, rowInfo: any, column: any, instance: any) {

  // }
  ApproveCell = (row: any) => {
    return (
      <div className="text-right approve-buttons">
        <Button
          bsStyle="link"
          className=""
          disabled={this.props.loading}
          onClick={(e: React.MouseEvent<Button>) => {
            this.buttonInAction = true;
            this.props
              .approveUser(row.value)
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
        <Button
          bsStyle="link"
          className=""
          disabled={this.props.loading}
          onClick={(e: React.MouseEvent<Button>) => {
            this.buttonInAction = true;
            this.props
              .rejectUser(row.value)
              .then((blah: any) => {
                this.buttonInAction = false;
              })
              .catch((err: any) => {
                this.buttonInAction = false;
              });
          }}
        >
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
            rowInfo.index === this.state.selectedRow
              ? constants.colors[`${this.state.currentTile.color}Tr`]
              : ''
        }
      };
    } else {
      return {};
    }
  };

  render() {
    return (
      <div className="user-queue">
        <Banner
          title="New User Queue"
          img="http://placekitten.com/1440/60"
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          handleSubmit={(values: any) => {
            alert(`under construction: ${JSON.stringify(values)}`);
          }}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
        />
        <ReactTable
          data={this.props.userQueue}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.userQueue.length}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={1}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
        />
        <CommonModal
          modalVisible={this.state.showEditUserModal}
          className="user-edit"
          onHide={() => {
            this.setState({ showEditUserModal: false, selectedRow: null });
          }}
          body={
            <UserQueueForm
              handleSubmit={(
                user: Iuser,
                shouldApprove: boolean,
                queueID: string
              ) => {
                this.props.updateUser(user, queueID).then(() => {
                  {
                    /*this.props.getUserQueue(1, '');*/
                  }
                });
                this.setState({ showEditUserModal: false });
                if (shouldApprove) {
                  this.props.approveUser(queueID);
                }
              }}
              handleCancel={() => {
                this.setState({ showEditUserModal: false });
              }}
              user={this.props.userQueue[this.state.selectedRow]}
              loading={this.props.loading}
              colorButton={
                constants.colors[`${this.state.currentTile.color}Button`]
              }
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
    userQueue: state.userQueue,
    loading: state.ajaxCallsInProgress > 0
  };
};
export default connect(
  mapStateToProps,
  {
    getUserQueue,
    approveUser,
    updateUser,
    rejectUser
  }
)(UserQueue);
