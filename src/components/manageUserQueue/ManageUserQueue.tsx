/*
* The New User Queue
*/
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouteComponentProps } from 'react-router-dom';
import { FieldConfig } from 'react-reactive-form';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule, FinalState, RowInfo } from 'react-table';
import * as moment from 'moment';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  ImanageUserQueueReducer,
  ItableFiltersReducer,
  Itile,
  Iuser,
  IqueueObject
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals, getCustomers } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
import {
  getUserQueue,
  approveUser,
  rejectUser,
  toggleEditQueueUserModal,
  setTableFilter
} from '../../actions/manageUserQueueActions';
import Banner from '../common/Banner';
import EditCustomerModal from '../common/EditCustomerModal';
import EditQueueUserModal from './EditQueueUserModal';
import SearchTableForm from '../common/SearchTableForm';
import { constants } from 'src/constants/constants';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditQueueUserModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  loading: boolean;
  userQueue: ImanageUserQueueReducer;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditQueueUserModal: () => void;
  setQueueSearch: (value: string) => Promise<void>;
  getCustomers: () => Promise<void>;
  approveUser: typeof approveUser;
  rejectUser: (value: string) => Promise<void>;
  getUserQueue: typeof getUserQueue;
  closeAllModals: typeof closeAllModals;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: IqueueObject[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class ManageUserQueue extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public buttonInAction = false;
  private setTableFilterTimeout: any;
  private searchFieldConfig: FieldConfig;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile
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
          accessor: 'user.email',
          minWidth: 190
        },
        {
          id: 'company',
          Header: 'company',
          accessor: 'user.tempCompany'
        },
        {
          Header: 'created',
          accessor: ({ user }: { user: Iuser }) => {
            return moment
              .utc(user.createDate)
              .local()
              .format('MM/DD/YYYY hh:mm a');
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
    this.searchFieldConfig = {
      controls: {
        search: {
          render: FormUtil.TextInputWithoutValidation,
          meta: {
            label: 'common:search',
            colWidth: 4,
            type: 'text',
            placeholder: 'searchPlaceholder',
            defaultValue: this.props.tableFilters.search
          }
        }
      }
    };
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
  }
  componentDidMount() {
    // refresh the list of customers every time the component mounts
    this.props.getCustomers();
    this.props.getUserQueue();
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditQueueUserModal !== this.props.showEditQueueUserModal &&
      !this.props.showEditQueueUserModal
    ) {
      this.setState({ selectedRow: null });
    }
    // automatically get inventory every time a fitler changes
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      this.props.getUserQueue();
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
  /*
  * (reusable)
  * Handle user clicking on a product row
  * set the selected product to state and open the modal
  */
  getTrProps = (state: FinalState, rowInfo: RowInfo) => {
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
  /*
  * (reusable)
  * get the next or previous page of data.  the table is 0 indexed but the API is not
  */
  onPageChange = (page: number) => {
    const newPage = page + 1;
    this.props.setTableFilter({ page: newPage });
  };

  /*
  * (reusable)
  * set the table filters to redux on each value change
  */
  onSearchValueChanges = (value: any, key: string) => {
    switch (key) {
      case 'search':
        clearTimeout(this.setTableFilterTimeout);
        this.setTableFilterTimeout = setTimeout(() => {
          this.props.setTableFilter({ search: value, page: 1 }); // this causes performance issues so we use a rudamentary debounce
        }, constants.tableSearchDebounceTime);
        break;
      case 'customer':
        this.props.setTableFilter({ customer: value, page: 1 });
        break;
      default:
        break;
    }
  };
  /*
  * (reusable)
  * set the sorted changes to redux
  */
  onSortedChanged = (
    newSorted: SortingRule[],
    column: any,
    shiftKey: boolean
  ) => {
    this.props.setTableFilter({ sorted: newSorted });
    this.setState({ selectedRow: {} });
  };

  render(): JSX.Element {
    const { t } = this.props;
    return (
      <div className="user-queue">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.searchFieldConfig}
          handleSubmit={this.props.getUserQueue}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
        />
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          page={this.props.tableFilters.page - 1}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.userQueue.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
        <EditQueueUserModal
          selectedQueueObject={this.props.tableData[this.state.selectedRow]}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <EditCustomerModal
          selectedCustomer={{}}
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
    userQueue: state.manageUserQueue,
    loading: state.ajaxCallsInProgress > 0,
    showEditQueueUserModal: state.manageUserQueue.showEditQueueUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    tableData: state.manageUserQueue.data,
    tableFilters: state.manageUserQueue.tableFilters
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
      closeAllModals,
      setTableFilter
    }
  )(ManageUserQueue)
);
