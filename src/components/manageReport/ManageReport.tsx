/*
* Manage Reports
*/
import { Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, {
  SortingRule,
  FinalState,
  RowInfo,
  Column
} from 'react-table';

import {
  IinitialState,
  ItableFiltersReducer,
  Itile,
  Iuser,
  Ireport,
  IdefaultReport
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
import { setTableFilter, getAllJobs } from '../../actions/manageJobActions';
import Banner from '../common/Banner';
import { constants } from 'src/constants/constants';
import {
  toggleEditReportModal,
  getDefaultReports,
  setSelectedReport,
  setSelectedDefaultReport
} from 'src/actions/manageReportActions';
import { values } from 'lodash';
import ManageReportModal from './ManageReportModal';

interface RowInfoReport extends RowInfo {
  original: IdefaultReport;
}

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditReportModal: typeof toggleEditReportModal;
  getDefaultReports: typeof getDefaultReports;
  closeAllModals: typeof closeAllModals;
  showEditReportModal: boolean;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  setSelectedReport: typeof setSelectedReport;
  setSelectedDefaultReport: typeof setSelectedDefaultReport;
  tableData: Ireport[];
  fseUsers: Iuser[];
  initComplete: boolean;
  getAllJobs: typeof getAllJobs;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  //   searchFieldConfig: FieldConfig;
}

class ManageReport extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile
      //   searchFieldConfig: this.buildSearchFieldConfig()
    };
    this.columns = TableUtil.translateHeaders(
      [
        {
          id: 'name',
          Header: 'name',
          accessor: ({ reportType }: Ireport) => {
            return this.props.t(constants.reportTypeEnumInverse[reportType]);
          },
          width: 500
        }
      ],
      this.props.t
    );
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.props.closeAllModals();
    this.props.getDefaultReports();
    this.props.getAllJobs();
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditReportModal !== this.props.showEditReportModal &&
      !this.props.showEditReportModal
    ) {
      this.setState({ selectedRow: null });
    }
  }

  /*
  * (reusable)
  * set the row color after a user selects it
  */
  getTrProps = (state: FinalState, rowInfo: RowInfo) => {
    if (rowInfo) {
      return {
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
      default:
        this.props.setTableFilter({ [key]: value });
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

  getTdProps = (
    fState: FinalState,
    rowInfo: RowInfoReport,
    column: Column,
    instance: any
  ) => {
    if (true) {
      return {
        onClick: () => {
          this.setState({
            selectedRow: rowInfo.index
          });
          this.props.toggleEditReportModal();
          this.props.setSelectedDefaultReport(rowInfo.original.id);
        }
      };
    }
  };

  render() {
    if (this.props.initComplete === false) {
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
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.columns}
          getTrProps={this.getTrProps}
          pageSize={
            this.props.tableData.length < 10 ? this.props.tableData.length : 10
          }
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
          getTdProps={this.getTdProps}
        />
        <ManageReportModal
          {...this.props}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditReportModal: state.manageReport.showEditReportModal,
    tableFilters: state.manageReport.tableFilters,
    facilities: state.facilities,
    tableData: values(state.manageReport.defaultReportsByID)
  };
};
export default translate('reportManage')(
  connect(
    mapStateToProps,
    {
      getDefaultReports,
      toggleEditReportModal,
      closeAllModals,
      setTableFilter,
      setSelectedReport,
      setSelectedDefaultReport,
      getAllJobs
    }
  )(ManageReport)
);
