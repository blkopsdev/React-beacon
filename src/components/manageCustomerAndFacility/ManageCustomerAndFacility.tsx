import Banner from '../common/Banner';
import * as React from 'react';
import { FieldConfig } from 'react-reactive-form';
import { I18n, translate } from 'react-i18next';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router';
import { TranslationFunction } from 'i18next';
import { constants } from '../../constants/constants';
import { connect } from 'react-redux';
import {
  IinitialState,
  ItableFiltersReducer,
  Itile,
  Ibrand,
  Icustomer
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { Button } from 'react-bootstrap';
import ReactTable, { FinalState, RowInfo, RowRenderProps } from 'react-table';
// import EditBrandModal from './EditBrandModal';
import * as moment from 'moment';
import { orderBy } from 'lodash';
import {
  setTableFilter,
  getCustomers,
  setSelectedCustomerAndFacilityID,
  clearSelectedCustomerAndFacilityID,
  toggleEditCustomerAndFacilityModal
} from '../../actions/manageCustomerAndFacilityActions';
import ManageFacility from './ManageFacility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RowInfoCustomer extends RowInfo {
  original: Icustomer;
}

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  // loading: boolean;
}

interface IdispatchProps {
  tableData: Ibrand[];
  totalPages: number;
  showEditCustomerAndFacilityModal: boolean;
  getCustomers: typeof getCustomers;
  toggleEditCustomerAndFacilityModal: typeof toggleEditCustomerAndFacilityModal;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  loading: boolean;
  setSelectedCustomerAndFacilityID: typeof setSelectedCustomerAndFacilityID;
  clearSelectedCustomerAndFacilityID: typeof clearSelectedCustomerAndFacilityID;
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
  }

  componentDidMount(): void {
    this.props.getCustomers();
  }

  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditCustomerAndFacilityModal !==
        this.props.showEditCustomerAndFacilityModal &&
      !this.props.showEditCustomerAndFacilityModal
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
          label: 'common:Brand',
          colWidth: 3,
          type: 'text',
          placeholder: 'Search by text',
          defaultValue: this.props.tableFilters.brand,
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
        this.props.setTableFilter({ name: value, page: 1 });
        break;
      default:
        break;
    }
  };

  handleEdit(row: any) {
    this.setState({ selectedRow: row.index });
    // this.props.toggleEditCustomerAndFacilityModal();
    this.props.setSelectedCustomerAndFacilityID(row.original.id);
  }

  onPageChange = (page: number) => {
    const newPage = page + 1;
    this.props.setTableFilter({ page: newPage });
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

  /*
  * Handle user clicking on a location row
  * set the selected location to state and open the modal
  */
  getTrProps = (state: FinalState, rowInfo: RowInfoCustomer) => {
    return {
      onClick: () => {
        this.setState({
          selectedRow: {
            [rowInfo.viewIndex || 0]: !this.state.selectedRow[
              rowInfo.viewIndex || 0
            ]
          }
        });
      }
    };
  };

  render() {
    const { t, tableData = [], totalPages } = this.props;
    return (
      <div className="manage-brand">
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
              this.setState({ selectedRow: null }, () => {
                this.props.toggleEditCustomerAndFacilityModal();
              });
            }}
          >
            {t(`manageBrand:newBrand`)}
          </Button>
        </div>
        <ReactTable
          data={tableData}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={tableData.length}
          manual
          pages={totalPages}
          page={this.props.tableFilters.page - 1}
          showPageSizeOptions={false}
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
            <ManageFacility {...rowInfo} t={this.props.t} />
          )}
          expanded={this.state.selectedRow}
        />

        {/*<EditBrandModal*/}
        {/*    colorButton={*/}
        {/*        constants.colors[`${this.state.currentTile.color}Button`]*/}
        {/*    }*/}
        {/*    t={this.props.t}*/}
        {/*/>*/}
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState) => {
  const tableData = orderBy(
    state.customerAndFacilityManage.data,
    res => moment.utc(res.createDate).unix(),
    'desc'
  );
  return {
    tableData,
    totalPages: state.customerAndFacilityManage.totalPages,
    showEditCustomerAndFacilityModal:
      state.customerAndFacilityManage.showEditCustomerAndFacilityModal,
    tableFilters: state.customerAndFacilityManage.tableFilters
  };
};

export default translate('customerAndFacilityManage')(
  connect(
    mapStateToProps,
    {
      getCustomers,
      setTableFilter,
      setSelectedCustomerAndFacilityID,
      clearSelectedCustomerAndFacilityID
    }
  )(ManageCustomerAndFacility)
);
