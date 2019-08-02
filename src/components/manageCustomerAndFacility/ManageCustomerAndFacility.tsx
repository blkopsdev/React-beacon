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
  getCustomerLogo
} from '../../actions/manageCustomerAndFacilityActions';
import ManageFacility from './ManageFacility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditCustomerModal from '../common/EditCustomerModal';
import {
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import EditFacilityModal from '../common/EditFacilityModal';
import * as moment from 'moment';
import { orderBy } from 'lodash';

interface RowInfoCustomer extends RowInfo {
  original: Icustomer;
}

interface Iprops extends RouteComponentProps<any> {
  t: TranslationFunction;
  i18n: I18n;
}

interface IdispatchProps {
  tableData: Icustomer[];
  totalPages: number;
  getCustomers: typeof getCustomers;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  loading: boolean;
  setSelectedCustomerID: typeof setSelectedCustomerID;
  clearSelectedCustomerID: typeof clearSelectedCustomerID;
  setSelectedFacilityID: typeof setSelectedFacilityID;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  getCustomerLogo: typeof getCustomerLogo;
  selectedCustomer: Icustomer;
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
  debounce: any;
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
      this.props.getCustomers();
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
      name: {
        render: FormUtil.TextInputWithoutValidation,
        meta: {
          label: 'common:Customer',
          colWidth: 3,
          type: 'text',
          placeholder: 'Filter by name',
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
      case 'name':
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.props.setTableFilter({ name: value });
        }, 500);
        break;
      default:
        break;
    }
  };

  addFacility = (row: any) => {
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
    const newPage = page + 1;
    this.props.setTableFilter({ page: newPage });
  };

  /*
  * Handle user clicking on a product row column
  * set the selected product to state and open the modal
  */
  getTdProps = (
    state: FinalState,
    rowInfo: RowInfoCustomer | undefined,
    column: Column | undefined,
    instance: any
  ) => {
    // console.log("ROWINFO", rowInfo, state);
    if (rowInfo && column && column.id && column.id === 'expander-toggle') {
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
    } else if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          this.props.setSelectedCustomerID(rowInfo.original.id);
          this.props.toggleEditCustomerModal();
          this.props.getCustomerLogo(rowInfo.original.id);
        }
      };
    } else {
      console.error('error in gettdprops', rowInfo, column);
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
              this.props.clearSelectedCustomerID();
              this.props.toggleEditCustomerModal();
            }}
          >
            {t(`manageCustomerAndFacility:newCustomer`)}
          </Button>
        </div>
        <ReactTable
          manual
          data={tableData}
          pages={this.props.totalPages}
          page={this.props.tableFilters.page - 1}
          columns={this.state.columns}
          getTdProps={this.getTdProps}
          pageSize={tableData.length}
          showPageSizeOptions={false}
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
          modalClass=""
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
  const tableData = orderBy(
    state.manageCustomerAndFacility.data,
    res => moment.utc(res.createDate).unix(),
    'desc'
  );

  const selectedCustomer =
    state.customers[state.manageCustomerAndFacility.selectedCustomerID] ||
    initialCustomer;

  return {
    tableData,
    totalPages: state.manageCustomerAndFacility.totalPages,
    tableFilters: state.manageCustomerAndFacility.tableFilters,
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
      getCustomerLogo
    }
  )(ManageCustomerAndFacility)
);
