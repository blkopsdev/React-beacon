/*
* The New User Queue
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getUserQueue,
  approveUser,
  rejectUser,
  getCustomers,
  toggleEditQueueUserModal
} from '../../actions/userQueueActions';
import { IinitialState, Iuser, Itile, IuserQueue } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import Banner from '../common/Banner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import constants from '../../constants/constants';
import * as moment from 'moment';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';
import EditQueueUserModal from './EditQueueUserModal';
import EditCustomerModal from '../common/EditCustomerModal';
import { closeAllModals } from '../../actions/commonActions';

// Field config to configure form
const fieldConfig = {
  controls: {
    search: {
      render: FormUtil.TextInputWithoutValidation,
      meta: {
        label: 'common:search',
        colWidth: 4,
        type: 'text',
        placeholder: 'searchPlaceholder'
      }
    }
  }
};

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditQueueUserModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  loading: boolean;
  userQueue: IuserQueue;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditQueueUserModal: () => void;
  setQueueSearch: (value: string) => Promise<void>;
  getCustomers: () => Promise<void>;
  approveUser: typeof approveUser;
  rejectUser: (value: string) => Promise<void>;
  getUserQueue: (value: number, anotherValue: string) => void;
  closeAllModals: typeof closeAllModals;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class UserQueue extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public buttonInAction = false;
  constructor(props: Iprops & IdispatchProps) {
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
    // this.props.anotherThunkAction().then(() => {console.log('hello world')})
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      prevProps.showEditQueueUserModal !== this.props.showEditQueueUserModal &&
      !this.props.showEditQueueUserModal
    ) {
      this.setState({ selectedRow: null });
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }
  // handleTableProps(state: any, rowInfo: any, column: any, instance: any) {

  // }
  ApproveCell = (row: any) => {
    return (
      <div className="text-right approve-buttons">
        <Button
          bsStyle="link"
          className=""
          bsSize="sm"
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
          bsSize="sm"
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
            this.props.toggleEditQueueUserModal();
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

  render(): JSX.Element {
    const { t } = this.props;
    return (
      <div className="user-queue">
        <Banner
          title={t('bannerTitle')}
          img="http://placekitten.com/1440/60"
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          fieldConfig={fieldConfig}
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
          sortable={false}
        />
        <EditQueueUserModal
          selectedQueueObject={
            this.props.userQueue.data[this.state.selectedRow]
          }
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <EditCustomerModal
          t={this.props.t}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
        />
        {/*the EditFacility Modal is rendered inside the UserQueueForm because we need to pass the selected customer*/}
      </div>
    );
  }
}

/*
* AddCustomerModal will connect to redux, impliment CommonModal, as well as AddCustomerForm
*/

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    userQueue: state.userQueue,
    loading: state.ajaxCallsInProgress > 0,
    showEditQueueUserModal: state.showEditQueueUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal
  };
};
export default translate('userQueue')(
  connect(
    mapStateToProps,
    {
      getUserQueue,
      approveUser,
      rejectUser,
      getCustomers,
      toggleEditQueueUserModal,
      closeAllModals
    }
  )(UserQueue)
);
