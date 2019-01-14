/*
* Measurement Points
*/
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
// import { find } from 'lodash';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule, FinalState, RowInfo } from 'react-table';
// import * as moment from 'moment';
import { Button } from 'react-bootstrap';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  ItableFiltersReducer,
  Itile,
  Ioption,
  IMeasurementListObject,
  ImanageMeasurementsReducer
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { closeAllModals, getCustomers } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
// import {
// getUserManage,
// setTableFilter,
// toggleEditUserModal,
// toggleSecurityFunctionsModal,
// updateUser
// } from '../../actions/manageUserActions';
import {
  getAllMeasurementPointLists,
  toggleEditMeasurementsModal,
  setTableFilter
} from '../../actions/manageMeasurementsActions';
import { getProductInfo } from '../../actions/manageInventoryActions';
import Banner from '../common/Banner';
// import CommonModal from '../common/CommonModal';
// import EditCustomerModal from '../common/EditCustomerModal';
import EditMeasurementsModal from './EditMeasurementsModal';
import SearchTableForm from '../common/SearchTableForm';
// import SecurityFunctionsList from './SecurityFunctionsList';
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
  toggleEditMeasurementsModal: typeof toggleEditMeasurementsModal;
  getProductInfo: typeof getProductInfo;
  productGroupOptions: Ioption[];
  standardOptions: Ioption[];
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  getCustomers: typeof getCustomers;
  manageMeasurements: ImanageMeasurementsReducer;
  showEditMeasurementsModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  showSecurityFunctionsModal: boolean;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: IMeasurementListObject[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
}

class ManageMeasurements extends React.Component<
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
            label: 'manageMeasurements:type',
            options: constants.measurementPointListTypeOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'typePlaceholder'
          }
        },
        equipmentType: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'manageMeasurements:equipmentType',
            options: this.props.productGroupOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'equipmentTypePlaceholder'
          }
        },
        standard: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'manageMeasurements:standard',
            options: this.props.standardOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'standardPlaceholder'
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

    // // refresh the userManage every time the component mounts
    // this.props.getUserManage();
    // // refresh the list of customers every time the component mounts
    // this.props.getCustomers();
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditMeasurementsModal !==
        this.props.showEditMeasurementsModal &&
      !this.props.showEditMeasurementsModal
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
          accessor: ({ productGroupID }: IMeasurementListObject) => {
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
          accessor: ({ standardID }: IMeasurementListObject) => {
            const item = this.props.standardOptions.filter((opt: Ioption) => {
              return opt.value === standardID;
            })[0];
            return standardID ? item.label : '';
          }
        },
        {
          id: 'numQuestions',
          Header: '# of Questions',
          accessor: ({ measurementPoints }: IMeasurementListObject) => {
            return measurementPoints ? measurementPoints.length : 0;
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
            this.setState({
              selectedRow: rowInfo.index
            });
            this.props.toggleEditMeasurementsModal();
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
          onClick={this.props.toggleEditMeasurementsModal}
        >
          {t('manageMeasurements:newMeasurement')}
        </Button>
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          page={this.props.tableFilters.page - 1}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.manageMeasurements.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
        <EditMeasurementsModal
          selectedMeasurementPointList={
            this.props.tableData[this.state.selectedRow]
          }
          measurementPointListTypeOptions={
            constants.measurementPointListTypeOptions
          }
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        {/* <EditCustomerModal
          t={this.props.t}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
        /> */}
        {/* <CommonModal
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
        /> */}
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
    manageMeasurements: state.manageMeasurements,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditMeasurementsModal:
      state.manageMeasurements.showEditMeasurementsModal,
    // showEditCustomerModal: state.showEditCustomerModal,
    // showEditFacilityModal: state.showEditFacilityModal,
    // showSecurityFunctionsModal: state.showSecurityFunctionsModal,
    tableData: state.manageMeasurements.data,
    tableFilters: state.manageMeasurements.tableFilters,
    standardOptions: state.productInfo.standardOptions,
    productGroupOptions: state.productInfo.productGroupOptions
  };
};
export default translate('manageMeasurements')(
  connect(
    mapStateToProps,
    {
      // getUserManage,
      // updateUser,
      // toggleEditUserModal,
      // toggleSecurityFunctionsModal,
      getAllMeasurementPointLists,
      toggleEditMeasurementsModal,
      closeAllModals,
      // getCustomers,
      setTableFilter,
      getProductInfo
    }
  )(ManageMeasurements)
);
