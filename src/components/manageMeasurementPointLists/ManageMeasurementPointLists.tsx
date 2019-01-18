/*
* Measurement Point Lists
*/
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { keys } from 'lodash';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule, FinalState, RowInfo } from 'react-table';
// import * as moment from 'moment';
import { Button, Col } from 'react-bootstrap';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  ItableFiltersReducer,
  Itile,
  Ioption,
  ImeasurementPointList,
  ImanageMeasurementPointListsReducer
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals, getCustomers } from '../../actions/commonActions';
import {
  emptyTile,
  initialMeasurementPointList
} from '../../reducers/initialState';
import {
  getAllMeasurementPointLists,
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointQuestionModal,
  setTableFilter,
  setSelectedMeasurementPointList
} from '../../actions/manageMeasurementPointListsActions';
import { getProductInfo } from '../../actions/manageInventoryActions';
import Banner from '../common/Banner';
// import CommonModal from '../common/CommonModal';
import EditMeasurementPointListModal from './EditMeasurementPointListModal';
import SearchTableForm from '../common/SearchTableForm';
import constants from '../../constants/constants';
import { FieldConfig } from 'react-reactive-form';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  // toggleEditUserModal: typeof toggleEditUserModal;
  // toggleSecurityFunctionsModal: typeof toggleSecurityFunctionsModal;
  // getUserManage: typeof getUserManage;
  getAllMeasurementPointLists: typeof getAllMeasurementPointLists;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointQuestionModal: typeof toggleEditMeasurementPointQuestionModal;
  setSelectedMeasurementPointList: typeof setSelectedMeasurementPointList;
  getProductInfo: typeof getProductInfo;
  productGroupOptions: Ioption[];
  standardOptions: Ioption[];
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  getCustomers: typeof getCustomers;
  manageMeasurementPointLists: ImanageMeasurementPointListsReducer;
  showEditMeasurementPointListModal: boolean;
  showEditMeasurementPointQuestionModal: boolean;
  showEditProcedureModal: boolean;
  showEditGroupModal: boolean;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: ImeasurementPointList[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
}

class ManageMeasurementPointList extends React.Component<
  Iprops & IdispatchProps,
  Istate
> {
  public searchFieldConfig: FieldConfig;
  public buttonInAction = false;
  // private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.getTrProps = this.getTrProps.bind(this);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile,
      columns: []
    };
    this.searchFieldConfig = {
      controls: {
        type: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'manageMeasurementPointLists:type',
            options: constants.measurementPointListTypeOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'typePlaceholder',
            defaultValue: this.props.tableFilters.type
          }
        },
        equipmentType: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'manageMeasurementPointLists:equipmentType',
            options: this.props.productGroupOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'equipmentTypePlaceholder',
            defaultValue: this.props.tableFilters.productGroup
          }
        },
        standard: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'manageMeasurementPointLists:standard',
            options: this.props.standardOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'standardPlaceholder',
            defaultValue: this.props.tableFilters.standard
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
    // Get measurement point lists
    this.props.getAllMeasurementPointLists();
    // Get product info when this component mounts
    this.props.getProductInfo();

    // TODO: set initial filters from redux
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditMeasurementPointListModal !==
        this.props.showEditMeasurementPointListModal &&
      !this.props.showEditMeasurementPointListModal
    ) {
      this.setState({ selectedRow: null });
    }
    // automatically get inventory every time a filter changes
    if (prevProps.tableFilters !== this.props.tableFilters) {
      this.props.getAllMeasurementPointLists();
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
          id: 'type',
          Header: 'Type',
          Cell: (row: any) => {
            const item = constants.measurementPointListTypeOptions.filter(
              (opt: any) => {
                return opt.value === row.original.type;
              }
            )[0];
            return <span>{item.label}</span>;
          }
        },
        {
          id: 'equipmentType',
          Header: 'equipment type',
          accessor: ({ productGroupID }: ImeasurementPointList) => {
            const item = this.props.productGroupOptions.filter(
              (opt: Ioption) => {
                return opt.value === productGroupID;
              }
            )[0];
            return productGroupID ? item.label : '';
          }
        },
        {
          id: 'standard',
          Header: 'standard',
          accessor: ({ standardID }: ImeasurementPointList) => {
            const item = this.props.standardOptions.filter((opt: Ioption) => {
              return opt.value === standardID;
            })[0];
            return standardID ? item.label : '';
          }
        },
        {
          id: 'numQuestions',
          Header: '# of Questions',
          accessor: ({ measurementPoints }: ImeasurementPointList) => {
            // console.log(keys(measurementPoints));
            return measurementPoints ? keys(measurementPoints).length : 0;
          }
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
            this.props.setSelectedMeasurementPointList(
              this.props.tableData[rowInfo.index]
            );
            this.setState({
              selectedRow: rowInfo.index
            });
            this.props.toggleEditMeasurementPointListModal();
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
      case 'type':
        this.props.setTableFilter({ type: value, page: 1 });
        break;
      case 'equipmentType':
        this.props.setTableFilter({ productGroup: value, page: 1 });
        break;
      case 'standard':
        this.props.setTableFilter({ standard: value, page: 1 });
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
    if (this.props.productGroupOptions.length === 0) {
      return (
        <Col xs={12}>
          <h4> loading... </h4>
        </Col>
      );
    }
    const { t } = this.props;
    return (
      <div className="user-manage">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          fieldConfig={this.searchFieldConfig}
          handleSubmit={this.props.getAllMeasurementPointLists}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
          showSearchButton={false}
        />
        <Button
          className="table-add-button"
          bsStyle="link"
          onClick={() => {
            this.props.setSelectedMeasurementPointList(
              initialMeasurementPointList
            );
            this.props.toggleEditMeasurementPointListModal();
          }}
        >
          {t('manageMeasurementPointLists:newMeasurement')}
        </Button>
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          page={this.props.tableFilters.page - 1}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.manageMeasurementPointLists.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
        <EditMeasurementPointListModal
          measurementPointListTypeOptions={
            constants.measurementPointListTypeOptions
          }
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
  return {
    user: state.user,
    manageMeasurementPointLists: state.manageMeasurementPointLists,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditMeasurementPointListModal:
      state.manageMeasurementPointLists.showEditMeasurementPointListModal,
    showEditMeasurementPointQuestionModal:
      state.manageMeasurementPointLists.showEditMeasurementPointQuestionModal,
    tableData: state.manageMeasurementPointLists.data,
    tableFilters: state.manageMeasurementPointLists.tableFilters,
    standardOptions: state.productInfo.standardOptions,
    productGroupOptions: state.productInfo.productGroupOptions
  };
};
export default translate('manageMeasurementPointLists')(
  connect(
    mapStateToProps,
    {
      getAllMeasurementPointLists,
      toggleEditMeasurementPointListModal,
      toggleEditMeasurementPointQuestionModal,
      setSelectedMeasurementPointList,
      closeAllModals,
      setTableFilter,
      getProductInfo
    }
  )(ManageMeasurementPointList)
);
