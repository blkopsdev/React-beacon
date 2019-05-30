/*
* The New User Manage
*/
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule, FinalState, RowInfo } from 'react-table';
import * as moment from 'moment';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  ImanageUserReducer,
  ItableFiltersReducer,
  Itile,
  Iuser
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals, getCustomers } from '../../actions/commonActions';
import initialState, { emptyTile } from '../../reducers/initialState';
import {
  getUserManage,
  setTableFilter,
  toggleEditUserModal,
  toggleSecurityFunctionsModal,
  updateUser
} from '../../actions/manageUserActions';
import Banner from '../common/Banner';
import CommonModal from '../common/CommonModal';
import EditCustomerModal from '../common/EditCustomerModal';
import EditUserModal from './EditUserModal';
import SearchTableForm from '../common/SearchTableForm';
import SecurityFunctionsList from './SecurityFunctionsList';
import { constants } from 'src/constants/constants';
import { FieldConfig } from 'react-reactive-form';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditUserModal: typeof toggleEditUserModal;
  toggleSecurityFunctionsModal: typeof toggleSecurityFunctionsModal;
  getUserManage: typeof getUserManage;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  getCustomers: typeof getCustomers;
  userManage: ImanageUserReducer;
  showEditUserModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  showSecurityFunctionsModal: boolean;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: Iuser[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
}

class UserManage extends React.Component<Iprops & IdispatchProps, Istate> {
  public searchFieldConfig: FieldConfig;
  public buttonInAction = false;
  private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile,
      columns: []
    };
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
        },
        customer: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'common:customer',
            options: FormUtil.convertToOptions(this.props.customers),
            colWidth: 4,
            type: 'select',
            placeholder: 'customerPlaceholder',
            defaultValue: this.props.tableFilters.customer
          }
        }
      }
    };
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname),
      columns: this.setColumns()
    });
  }
  componentDidMount() {
    // refresh the userManage every time the component mounts
    this.props.getUserManage();
    // refresh the list of customers every time the component mounts
    this.props.getCustomers();
    this.props.closeAllModals();
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditUserModal !== this.props.showEditUserModal &&
      !this.props.showEditUserModal
    ) {
      this.setState({ selectedRow: null });
    }
    // automatically get inventory every time a fitler changes
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      console.log(
        'user manage filters changed',
        prevProps.tableFilters,
        this.props.tableFilters
      );
      this.props.getUserManage();
    }
    if (
      JSON.stringify(prevProps.customers) !==
      JSON.stringify(this.props.customers)
    ) {
      this.setState({ columns: this.setColumns() });
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }
  /*
  * Set Columns sets columns to state
  * setting columns here in order to reset them if and after we receive customers
  */
  setColumns = () => {
    return TableUtil.translateHeaders(
      [
        {
          id: 'name',
          Header: 'name',
          // accessor: "user",
          Cell: (row: any) => (
            <span>
              {row.original.first} {row.original.last}
            </span>
          )
        },
        {
          Header: 'email',
          accessor: 'email',
          minWidth: 190
        },
        {
          id: 'company',
          Header: 'company',
          accessor: ({ customerID }: Iuser) => {
            // !TODO move this to a reducer?
            let cust;
            if (customerID) {
              cust = find(
                this.props.customers,
                c =>
                  c.id.trim().toLowerCase() === customerID.trim().toLowerCase()
              );
            }
            return cust ? cust.name : '';
          }
        },
        {
          Header: 'manager',
          accessor: ({ hasTeamMembers }: Iuser) => {
            return hasTeamMembers ? 'Yes' : 'No';
          },
          id: 'manager',
          width: 100
        },
        {
          Header: 'login',
          accessor: ({ lastLoginDate }: Iuser) => {
            return lastLoginDate
              ? moment
                  .utc(lastLoginDate)
                  .local()
                  .format('MM/DD/YYYY hh:mm a')
              : 'n/a';
          },
          id: 'login'
        }
      ],
      this.props.t
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
      case 'customer':
        this.props.setTableFilter({ customer: value, page: 1 });
        break;
      case 'search':
        clearTimeout(this.setTableFilterTimeout);
        this.setTableFilterTimeout = setTimeout(() => {
          this.props.setTableFilter({ search: value, page: 1 }); // this causes performance issues so we use a rudamentary debounce
        }, constants.tableSearchDebounceTime);
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

  render() {
    const { t } = this.props;
    return (
      <div className="user-manage">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.searchFieldConfig}
          handleSubmit={this.props.getUserManage}
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
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          page={this.props.tableFilters.page - 1}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.userManage.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
        <EditUserModal
          selectedUser={
            this.props.tableData[this.state.selectedRow] || initialState.user
          }
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
          secondModal={true}
        />
        <CommonModal
          modalVisible={this.props.showSecurityFunctionsModal}
          className="security-modal second-modal"
          onHide={this.props.toggleSecurityFunctionsModal}
          body={
            <SecurityFunctionsList
              t={this.props.t}
              toggleSecurityFunctionsModal={
                this.props.toggleSecurityFunctionsModal
              }
            />
          }
          title={t('securityFunctionsModalTitle')}
          container={document.getElementById('two-pane-layout')}
          backdrop={true}
        />
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
    userManage: state.manageUser,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditUserModal: state.manageUser.showEditUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    showSecurityFunctionsModal: state.showSecurityFunctionsModal,
    tableData: state.manageUser.data,
    tableFilters: state.manageUser.tableFilters
  };
};
export default translate('userManage')(
  connect(
    mapStateToProps,
    {
      getUserManage,
      updateUser,
      toggleEditUserModal,
      toggleSecurityFunctionsModal,
      closeAllModals,
      getCustomers,
      setTableFilter
    }
  )(UserManage)
);
