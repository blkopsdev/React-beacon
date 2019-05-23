import Banner from '../common/Banner';
import * as React from 'react';
import { FieldConfig } from 'react-reactive-form';
import { I18n, translate } from 'react-i18next';
import { emptyTile, initialCustomer } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router';
import { TranslationFunction } from 'i18next';
import { constants } from '../../constants/constants';
import { connect } from 'react-redux';
import {
  IinitialState,
  ItableFiltersReducer,
  Itile,
  Icustomer,
  Ifacility
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { Button } from 'react-bootstrap';
import ReactTable, {
  Column,
  FinalState,
  RowInfo,
  RowRenderProps
} from 'react-table';

import {
  setTableFilter,
  getCustomers,
  setSelectedCustomerID,
  clearSelectedCustomerID,
  setSelectedFacilityID,
  filterVisibleCustomers
} from '../../actions/manageCustomerAndFacilityActions';
import ManageFacility from './ManageFacility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditCustomerModal from './EditCustomerModal';
import {
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import EditFacilityModal from './EditFacilityModal';

interface RowInfoCustomer extends RowInfo {
  original: Icustomer;
}

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
}

interface IdispatchProps {
  tableData: Icustomer[];
  totalPages: number;
  showEditCustomerAndFacilityModal: boolean;
  getCustomers: typeof getCustomers;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  loading: boolean;
  setSelectedCustomerID: typeof setSelectedCustomerID;
  clearSelectedCustomerID: typeof clearSelectedCustomerID;
  setSelectedFacilityID: typeof setSelectedFacilityID;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  selectedCustomer: Icustomer;
  filterVisibleCustomers: typeof filterVisibleCustomers;
  customers: { [key: string]: Icustomer };
  facilities: { [key: string]: Ifacility };
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  searchFieldConfig: FieldConfig;
}

class ManageCustomerAndFacility extends React.Component<
  Iprops & IdispatchProps,
  Istate
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
      searchFieldConfig: this.buildSearchControls()
    };
  }

  componentWillMount(): void {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();
    this.props.getCustomers();
    this.props.filterVisibleCustomers();
  }

  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.toggleEditCustomerModal !==
        this.props.toggleEditCustomerModal &&
      !this.props.toggleEditCustomerModal
    ) {
      this.setState({ selectedRow: {} });
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
      this.props.getCustomers();
      this.props.filterVisibleCustomers();
    }
    if (
      JSON.stringify(this.props.customers) !==
      JSON.stringify(prevProps.customers)
    ) {
      this.props.filterVisibleCustomers();
    }
  }

  expanderToggle = (props: RowRenderProps) => {
    return (
      <div>
        {props.isExpanded ? (
          <span>
            <FontAwesomeIcon icon="chevron-down" />
          </span>
        ) : (
          <span>
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        )}
      </div>
    );
  };

  buildSearchControls = (): FieldConfig => {
    const mainSearchControls = {
      search: {
        render: FormUtil.TextInputWithoutValidation,
        meta: {
          label: 'common:Customer',
          colWidth: 3,
          type: 'text',
          placeholder: 'Search by text',
          defaultValue: this.props.tableFilters.customer,
          isClearable: true
        }
      }
    };

    const searchFieldConfig = {
      controls: { ...mainSearchControls }
    } as FieldConfig;
    return searchFieldConfig;
  };

  onSearchValueChanges = (value: any, key: string) => {
    switch (key) {
      case 'search':
        this.props.setTableFilter({ search: value, page: 0 }); // TODO add a debounce like in manageJob.tsx
        break;
      default:
        break;
    }
  };

  addFacility = (row: any) => {
    // console.log(row);
    this.props.toggleEditFacilityModal();
  };
  /*
    * Set Columns sets columns to state
    */
  setColumns = () => {
    const columns = TableUtil.translateHeaders(
      [
        {
          Header: 'name',
          accessor: 'name',
          minWidth: 300
        },
        {
          Header: 'qty',
          id: 'quantity',
          minWidth: 50,
          accessor: ({ facilities }: Icustomer) => {
            return facilities ? facilities.length : 0;
          }
        },
        {
          id: 'expander-toggle',
          expander: true,
          Expander: this.expanderToggle,
          style: {
            cursor: 'pointer',
            textAlign: 'center',
            userSelect: 'none'
          }
        }
      ],
      this.props.t
    );
    this.setState({ columns });
  };

  onPageChange = (page: number) => {
    this.props.setTableFilter({ page });
  };
  onPageSizeChange = (rows: number) => {
    this.props.setTableFilter({ rows, page: 0 });
  };

  /*
* Handle user clicking on a product row column
* set the selected product to state and open the modal
*/
  getTdProps = (
    state: FinalState,
    rowInfo: RowInfoCustomer,
    column: Column,
    instance: any
  ) => {
    // console.log("ROWINFO", rowInfo, state);
    if (column.id && column.id === 'expander-toggle') {
      return {
        onClick: () => {
          this.props.setSelectedCustomerID(rowInfo.original.id);
          this.setState({
            selectedRow: {
              [rowInfo.viewIndex || 0]: !this.state.selectedRow[
                rowInfo.viewIndex || 0
              ]
            }
          });
        }
      };
    } else {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          this.props.setSelectedCustomerID(rowInfo.original.id);
          this.props.toggleEditCustomerModal();
        }
      };
    }
  };

  render() {
    const { t, tableData = [] } = this.props;
    return (
      <div className="manage-customer-and-facility">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.state.searchFieldConfig}
          handleSubmit={this.props.getCustomers}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
          t={this.props.t}
          showSearchButton={false}
        />
        <div>
          <Button
            className="table-add-button"
            bsStyle="link"
            onClick={() => {
              this.props.toggleEditCustomerModal();
            }}
          >
            {t(`manageCustomerAndFacility:newCustomer`)}
          </Button>
        </div>
        <ReactTable
          data={tableData}
          columns={this.state.columns}
          getTdProps={this.getTdProps}
          defaultPageSize={
            this.props.tableFilters.rows || constants.tablePageSizeDefault
          }
          onPageSizeChange={this.onPageSizeChange}
          showPageSizeOptions={true}
          pageSizeOptions={constants.tablePageSizeOptions}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          // onSortedChange={this.onSortedChanged}
          sortable={false}
          multiSort={false}
          noDataText={t('common:noDataText')}
          resizable={false}
          SubComponent={(rowInfo: RowInfo) => (
            <ManageFacility
              {...rowInfo}
              addFacility={this.addFacility}
              showAddFacility={true}
              setSelectedFacilityID={this.props.setSelectedFacilityID}
              t={this.props.t}
            />
          )}
          expanded={this.state.selectedRow}
        />

        <EditCustomerModal
          selectedCustomer={this.props.selectedCustomer}
          t={this.props.t}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
        />
        <EditFacilityModal
          t={this.props.t}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState) => {
  const tableData = state.customerAndFacilityManage.visibleCustomers;
  const selectedCustomer =
    state.customers[state.customerAndFacilityManage.selectedCustomerID] ||
    initialCustomer;

  return {
    tableData,
    totalPages: state.customerAndFacilityManage.totalPages,
    showEditCustomerAndFacilityModal:
      state.customerAndFacilityManage.showEditCustomerAndFacilityModal,
    tableFilters: state.customerAndFacilityManage.tableFilters,
    selectedCustomer,
    customers: state.customers,
    facilities: state.facilities
  };
};

export default translate('manageCustomerAndFacility')(
  connect(
    mapStateToProps,
    {
      getCustomers,
      toggleEditCustomerModal,
      setTableFilter,
      setSelectedCustomerID,
      clearSelectedCustomerID,
      setSelectedFacilityID,
      toggleEditFacilityModal,
      filterVisibleCustomers
    }
  )(ManageCustomerAndFacility)
);
