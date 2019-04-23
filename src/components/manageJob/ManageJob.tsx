/*
* Manage Job
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
  getFSEUsers,
  setTableFilter,
  toggleEditJobModal,
  updateJob,
  setSelectedJobID,
  clearSelectedJobID
} from '../../actions/manageJobActions';
import Banner from '../common/Banner';
import EditJobModal from './EditJobModal';
import SearchTableForm from '../common/SearchTableForm';
import { constants } from 'src/constants/constants';
import { orderBy } from 'lodash';

interface RowInfoJob extends RowInfo {
  original: Ijob;
}

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditJobModal: typeof toggleEditJobModal;
  getJobs: typeof getJobs;
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
  setSelectedJobID: typeof setSelectedJobID;
  clearSelectedJobID: typeof clearSelectedJobID;
}

interface Istate {
  selectedRow: number | null;
  currentTile: Itile;
  searchFieldConfig: FieldConfig;
}

class ManageJob extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public buttonInAction = false;
  private debounce: any;
  // private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile,
      searchFieldConfig: this.buildSearchFieldConfig()
    };
    this.columns = TableUtil.translateHeaders(
      [
        {
          id: 'status',
          Header: 'status',
          accessor: 'status',
          width: 100
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
    this.props.getFSEUsers();
    this.props.getJobs();
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
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      this.props.getJobs();
    }
    if (
      JSON.stringify(prevProps.customers) !==
      JSON.stringify(this.props.customers)
    ) {
      const searchFieldConfig = this.buildSearchFieldConfig();
      this.setState({ searchFieldConfig });
    }
  }

  /*
  * build the config here so that we have time to get customers before rendering the search controls.
  */
  buildSearchFieldConfig = (): FieldConfig => {
    const { startDate, endDate, type, company } = this.props.tableFilters;
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
            defaultValue: company,
            isClearable: true
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
            defaultValue: type,
            isClearable: true
          }
        },
        startDate: {
          render: FormUtil.DatetimeWithoutValidation,
          meta: {
            label: 'jobManage:startDate',
            colWidth: 2,
            defaultValue: startDate ? startDate : '',
            showTime: false
          }
        },
        endDate: {
          render: FormUtil.DatetimeWithoutValidation,
          meta: {
            label: 'jobManage:endDate',
            colWidth: 2,
            defaultValue: endDate ? endDate : '',
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
  getTrProps = (state: FinalState, rowInfo: RowInfoJob) => {
    // console.log("ROWINFO", rowInfo);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            this.setState({
              selectedRow: rowInfo.index
            });
            this.props.setSelectedJobID(rowInfo.original.id);
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
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.props.setTableFilter({ [key]: value, page: 1 });
    }, 500);
    // no need for a switch on this one
    // switch (key) {
    //   case 'company':
    //   this.props.setTableFilter({ company: value, page: 1 });
    //     break;
    //   default:
    //     break;
    // }
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
    this.setState({ selectedRow: null });
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
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.state.searchFieldConfig}
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
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const tableData = orderBy(
    state.manageJob.data,
    res => moment.utc(res.startDate).unix(),
    'desc'
  );
  return {
    user: state.user,
    jobManage: state.manageJob,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditJobModal: state.manageJob.showEditJobModal,
    tableData,
    fseUsers: state.manageJob.fseUsers,
    tableFilters: state.manageJob.tableFilters
  };
};
export default translate('jobManage')(
  connect(
    mapStateToProps,
    {
      getJobs,
      getFSEUsers,
      updateJob,
      toggleEditJobModal,
      closeAllModals,
      getCustomers,
      setTableFilter,
      setSelectedJobID,
      clearSelectedJobID
    }
  )(ManageJob)
);
