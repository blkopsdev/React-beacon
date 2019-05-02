/*
* hopsital Managers manage their team
* Note: did minimal renaming from the UserManage component
*/
import { Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule, FinalState, RowInfo } from 'react-table';
import * as moment from 'moment';
import { FieldConfig } from 'react-reactive-form';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  ImanageTeamReducer,
  ItableFiltersReducer,
  Itile,
  Iuser
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
import {
  getUserManage,
  toggleEditTeamUserModal,
  setTableFilter
} from '../../actions/manageTeamActions';
import Banner from '../common/Banner';
import EditTeamMemberModal from './EditTeamMemberModal';
import SearchTableForm from '../common/SearchTableForm';
import { constants } from 'src/constants/constants';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditTeamUserModal: typeof toggleEditTeamUserModal;
  getUserManage: typeof getUserManage;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  userManage: ImanageTeamReducer;
  showEditUserModal: boolean;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: Iuser[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class TeamManage extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public searchFieldConfig: FieldConfig;
  public buttonInAction = false;
  private setTableFilterTimeout: any;

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
          Header: 'user:name',
          // accessor: "user",
          Cell: (row: any) => (
            <span>
              {row.original.first} {row.original.last}
            </span>
          )
        },
        {
          Header: 'user:email',
          accessor: 'email'
        },
        {
          Header: 'manager',
          accessor: ({ hasTeamMembers }: Iuser) => {
            return hasTeamMembers ? 'Yes' : 'No';
          },
          id: 'manager'
        },
        {
          Header: 'common:login',
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
    this.searchFieldConfig = {
      controls: {
        search: {
          render: FormUtil.TextInputWithoutValidation,
          meta: {
            label: 'common:search',
            colWidth: 4,
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
    // refresh the userManage every time the component mounts
    this.props.getUserManage();
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
      this.props.getUserManage();
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

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
            this.props.toggleEditTeamUserModal();
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
        <Button
          className="table-add-button"
          bsStyle="link"
          onClick={this.props.toggleEditTeamUserModal}
        >
          {t('teamManage:newTeamMember')}
        </Button>
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.userManage.totalPages}
          page={this.props.tableFilters.page - 1}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
        <EditTeamMemberModal
          selectedUser={this.props.tableData[this.state.selectedRow]}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
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
    userManage: state.manageTeam,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditUserModal: state.manageTeam.showEditTeamModal,
    tableData: state.manageTeam.data,
    tableFilters: state.manageTeam.tableFilters
  };
};
export default translate('teamManage')(
  connect(
    mapStateToProps,
    {
      getUserManage,
      toggleEditTeamUserModal,
      closeAllModals,
      setTableFilter
    }
  )(TeamManage)
);
