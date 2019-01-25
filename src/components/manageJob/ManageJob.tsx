/*
* The New User Manage
*/
import { Button, Col } from 'react-bootstrap';
import { FieldConfig } from 'react-reactive-form';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule, FinalState, RowInfo } from 'react-table';
import * as moment from 'moment';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  ImanageJobReducer,
  ItableFiltersReducer,
  Itile,
  Ijob,
  Iuser
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals, getCustomers } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
import {
  getJobs,
  getJobTypes,
  getFSEUsers,
  setTableFilter,
  toggleEditJobModal,
  updateJob
} from '../../actions/manageJobActions';
import Banner from '../common/Banner';
import EditJobModal from './EditJobModal';
import SearchTableForm from '../common/SearchTableForm';
import constants from '../../constants/constants';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditJobModal: typeof toggleEditJobModal;
  getJobs: typeof getJobs;
  getJobTypes: typeof getJobTypes;
  getFSEUsers: typeof getFSEUsers;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  getCustomers: typeof getCustomers;
  jobManage: ImanageJobReducer;
  showEditJobModal: boolean;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: Ijob[];
  jobTypes: any[];
  fseUsers: Iuser[];
  loading: boolean;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class ManageJob extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public buttonInAction = false;
  // private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.getTrProps = this.getTrProps.bind(this);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile
    };
    this.columns = TableUtil.translateHeaders(
      [
        {
          id: 'status',
          Header: 'status',
          accessor: 'status',
          width: 70
        },
        {
          Header: 'type',
          accessor: 'jobType.name',
          width: 100
        },
        {
          id: 'company',
          Header: 'company',
          accessor: 'customer.name',
          minWidth: 150
        },
        {
          Header: 'facility',
          accessor: 'facility.name',
          minWidth: 150
        },
        {
          Header: 'FSE Lead',
          // accessor: 'assignedUserID'
          Cell: (row: any) => (
            <span>
              {row.original.assignedUser.first} {row.original.assignedUser.last}
            </span>
          )
        },
        {
          Header: 'start date',
          accessor: ({ startDate }: Ijob) => {
            return startDate
              ? moment.utc(startDate).format('MM/DD/YYYY')
              : 'n/a';
          },
          id: 'startDate',
          width: 110
        },
        {
          Header: 'end date',
          accessor: ({ endDate }: Ijob) => {
            return endDate ? moment.utc(endDate).format('MM/DD/YYYY') : 'n/a';
          },
          id: 'endDate',
          width: 110
        }
      ],
      this.props.t
    );
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
  }
  componentDidMount() {
    // refresh job types
    this.props.getJobTypes();
    this.props.getFSEUsers();
    // refresh the jobManage every time the component mounts
    this.props.getJobs();
    // refresh the list of customers every time the component mounts
    this.props.getCustomers();
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditJobModal !== this.props.showEditJobModal &&
      !this.props.showEditJobModal
    ) {
      this.setState({ selectedRow: null });
    }
    // automatically get inventory every time a fitler changes
    if (prevProps.tableFilters !== this.props.tableFilters) {
      this.props.getJobs();
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * build the config here so that we have time to get customers before rendering the search controls.
  */
  buildSearchFieldConfig = (): FieldConfig => {
    return {
      controls: {
        company: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'jobManage:company',
            options: FormUtil.convertToOptions(this.props.customers),
            colWidth: 3,
            type: 'select',
            placeholder: 'companyPlaceholder',
            defaultValue: this.props.tableFilters.company
          }
        },
        type: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'jobManage:type',
            options: constants.jobTypeOptions,
            colWidth: 2,
            type: 'select',
            placeholder: 'typePlaceholder',
            defaultValue: this.props.tableFilters.type
          }
        },
        startDate: {
          render: FormUtil.DatetimeWithoutValidation,
          meta: {
            label: 'jobManage:dateRange',
            colWidth: 2,
            defaultValue: this.props.tableFilters.startDate,
            showTime: false
          }
        },
        endDate: {
          render: FormUtil.DatetimeWithoutValidation,
          meta: {
            colWidth: 2,
            defaultValue: this.props.tableFilters.endDate,
            showTime: false
          }
        }
      }
    };
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
            this.props.toggleEditJobModal();
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
      case 'company':
        this.props.setTableFilter({ company: value, page: 1 });
        break;
      case 'type':
        this.props.setTableFilter({ type: value, page: 1 });
        break;
      case 'startDate':
        this.props.setTableFilter({ startDate: value, page: 1 });
        break;
      case 'endDate':
        this.props.setTableFilter({ endDate: value, page: 1 });
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
    if (this.props.customers.length === 0) {
      return (
        <Col xs={12}>
          <h4> loading... </h4>
        </Col>
      );
    }
    const { t } = this.props;
    return (
      <div className="manage-job">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          fieldConfig={this.buildSearchFieldConfig()}
          handleSubmit={this.props.getJobs}
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
          onClick={this.props.toggleEditJobModal}
        >
          {t('jobManage:newJob')}
        </Button>
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          page={this.props.tableFilters.page - 1}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.jobManage.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
        <EditJobModal
          selectedJob={this.props.tableData[this.state.selectedRow]}
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
    jobManage: state.manageJob,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditJobModal: state.manageJob.showEditJobModal,
    tableData: state.manageJob.data,
    // jobTypes: FormUtil.convertToOptions(state.manageJob.jobTypes),
    fseUsers: state.manageJob.fseUsers,
    tableFilters: state.manageJob.tableFilters
  };
};
export default translate('jobManage')(
  connect(
    mapStateToProps,
    {
      getJobs,
      getJobTypes,
      getFSEUsers,
      updateJob,
      toggleEditJobModal,
      closeAllModals,
      getCustomers,
      setTableFilter
    }
  )(ManageJob)
);
