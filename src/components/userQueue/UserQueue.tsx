/*
* The New User Queue
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getUserQueue,
  approveUser,
  updateUser,
  rejectUser,
  getCustomers,
  getFacilitiesByCustomer,
  toggleEditUserModal,
  toggleEditCompanyModal,
  toggleEditFacilityModal
} from '../../actions/userQueueActions';
import {
  IinitialState,
  Iuser,
  Itile,
  IuserQueue,
  Icustomer,
  Ifacility,
  IuserQueueModals
} from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import CommonModal from '../common/CommonModal';
import UserQueueForm from './UserQueueForm';
import Banner from '../common/Banner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import constants from '../../constants/constants';
import * as moment from 'moment';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { map } from 'lodash';

import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';

const getCustomerOptions = (customers: Icustomer[]) => {
  return map(customers, (cust: Icustomer) => {
    return { value: cust.id, label: cust.name };
  });
};

const getFacilitityOptions = (facilities: Ifacility[]) => {
  return map(facilities, (facility: Ifacility) => {
    return { value: facility.id, label: facility.name };
  });
};

interface Iprops extends RouteComponentProps<{}> {
  getUserQueue: any;
  userQueue: IuserQueue;
  approveUser: (value: string) => Promise<void>;
  updateUser: (value: Iuser, v: string) => Promise<void>;
  rejectUser: (value: string) => Promise<void>;
  loading: boolean;
  t: TranslationFunction;
  i18n: I18n;
  setQueueSearch: (value: string) => Promise<void>;
  getCustomers: () => Promise<void>;
  customerOptions: any[];
  getFacilitiesByCustomer: () => Promise<void>;
  facilityOptions: any[];
  modals: IuserQueueModals;
  toggleEditUserModal: () => void;
  toggleEditCompanyModal: () => void;
  toggleEditFacilityModal: () => void;
}

interface Istate {
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
    this.columns = TableUtil.translateHeaders(
      [
        {
          id: 'name',
          Header: 'name',
          accessor: 'user',
          Cell: (row: any) => (
            <span>
              {row.value.first} {row.value.last}
            </span>
          )
        },
        {
          Header: 'email',
          accessor: 'user.email'
        },
        {
          id: 'company',
          Header: 'company',
          accessor: 'user.tempCompany'
        },
        {
          Header: 'created',
          accessor: ({ createDate }: Iuser) => {
            return moment.utc(createDate).format('MM/DD/YYYY hh:mm a');
          },
          id: 'created'
        },
        {
          Header: 'approve',
          accessor: 'id',
          Cell: this.ApproveCell,
          maxWidth: 90
        }
      ],
      this.props.t
    );
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    // refresh the userQueue every time the component mounts
    this.props.getUserQueue(1, '');

    // refresh the list of customers every time the component mounts
    this.props.getCustomers();
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      prevProps.modals.showEditUserModal !==
        this.props.modals.showEditUserModal &&
      !this.props.modals.showEditUserModal
    ) {
      this.setState({ selectedRow: null });
    }
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
              selectedRow: rowInfo.index
            });
            this.props.toggleEditUserModal();
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
  // get the next or previous page of data.  the table is 0 indexed but the API is not
  onPageChange = (page: number) => {
    this.props.getUserQueue(page + 1, '');
  };
  onSearchSubmit = ({ search }: { search: string }) => {
    this.props.getUserQueue(this.props.userQueue.page, search);
  };

  render() {
    const { t } = this.props;
    return (
      <div className="user-queue">
        <Banner
          title={t('bannerTitle')}
          img="http://placekitten.com/1440/60"
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          handleSubmit={this.onSearchSubmit}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <ReactTable
          data={this.props.userQueue.data}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.userQueue.data.length}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.userQueue.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
        />
        <CommonModal
          modalVisible={this.props.modals.showEditUserModal}
          className="user-edit"
          onHide={this.props.toggleEditUserModal}
          body={
            <UserQueueForm
              handleSubmit={this.props.updateUser}
              handleCancel={this.props.toggleEditUserModal}
              user={this.props.userQueue.data[this.state.selectedRow]}
              loading={this.props.loading}
              colorButton={
                constants.colors[`${this.state.currentTile.color}Button`]
              }
              customerOptions={this.props.customerOptions}
              facilityOptions={this.props.facilityOptions}
              getFacilitiesByCustomer={this.props.getFacilitiesByCustomer}
            />
          }
          title={t('editUserModalTitle')}
          container={document.getElementById('two-pane-layout')}
        />

        {/*        <AddCustomerModal 

        />*/}
      </div>
    );
  }
}

/*
* AddCustomerModal will connect to redux, impliment CommonModal, as well as AddCustomerForm
*/

const mapStateToProps = (state: IinitialState, ownProps: any) => {
  return {
    user: state.user,
    userQueue: state.userQueue,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: getCustomerOptions(state.customers),
    facilityOptions: getFacilitityOptions(state.facilities),
    modals: state.userQueueModals
  };
};
export default translate('userQueue')(
  connect(
    mapStateToProps,
    {
      getUserQueue,
      approveUser,
      updateUser,
      rejectUser,
      getCustomers,
      getFacilitiesByCustomer,
      toggleEditUserModal,
      toggleEditCompanyModal,
      toggleEditFacilityModal
    }
  )(UserQueue)
);
