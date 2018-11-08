/*
* hopsital Managers manage their locations
*/
import { FieldConfig } from 'react-reactive-form';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
// import { find } from 'lodash';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { RowInfo, FinalState, SortingRule } from 'react-table';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  Ioption,
  ItableFiltersReducer,
  Iuser,
  Ifacility,
  Itile,
  ImanageLocationReducer
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { addToCart } from '../../actions/shoppingCartActions';
import { closeAllModals } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
import {
  getLocationsFacility,
  setTableFilter,
  toggleEditLocationModal
} from '../../actions/manageLocationActions';
import { setSelectedProduct } from '../../actions/manageInventoryActions';
import Banner from '../common/Banner';
import EditProductModal from './EditLocationModal';
import SearchTableForm from '../common/SearchTableForm';
import constants from '../../constants/constants';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditLocationModal: boolean;
  loading: boolean;
  userManage: ImanageLocationReducer;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditLocationModal: typeof toggleEditLocationModal;
  getLocationsFacility: typeof getLocationsFacility;
  closeAllModals: typeof closeAllModals;
  facilityOptions: Ioption[];
  user: Iuser;
  tableData: any[];
  facility: Ifacility;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  selectedProduct: any;
  setSelectedProduct: typeof setSelectedProduct;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  selectedInstall: any;
}

class ManageLocation extends React.Component<Iprops & IdispatchProps, Istate> {
  // public searchFieldConfig: any;
  public searchFieldConfigBanner: any;
  public buttonInAction = false;
  private setTableFilterTimeout: any;
  private searchFieldConfig: FieldConfig;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
      selectedInstall: {}
    };
    this.searchFieldConfig = this.buildSearchControls();
  }
  componentWillMount() {
    // since the install modal depends on a selected product in state, we need to make sure and start off with the modals closed
    this.props.closeAllModals();
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();
  }
  componentDidMount() {
    this.props.getLocationsFacility(this.props.facilityOptions[0].value);
    // make sure there is a facility set to the table search filters so that it can be used in the EditProductForm
    if (!this.props.tableFilters.facility) {
      const facility = this.props.tableFilters.facility
        ? this.props.tableFilters.facility
        : this.props.facilityOptions[0];
      this.props.setTableFilter({ facility });
    }
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditLocationModal !== this.props.showEditLocationModal &&
      !this.props.showEditLocationModal
    ) {
      this.props.setSelectedProduct();
    }

    // update the table when we get new data
    if (prevProps.tableData !== this.props.tableData) {
      console.log('DATA CHANGED');
    }

    // automatically get facility every time a filter changes
    if (prevProps.tableFilters !== this.props.tableFilters) {
      const fac =
        this.props.tableFilters.facility &&
        this.props.tableFilters.facility.value;
      this.props.getLocationsFacility(
        fac || this.props.facilityOptions[0].value
      );
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * Reset the table filters (not used currently)
  */
  resetTableFilters = () => {
    const facility = this.props.tableFilters.facility
      ? this.props.tableFilters.facility
      : this.props.facilityOptions[0];
    this.props.setTableFilter({
      facility,
      customer: undefined,
      productGroup: undefined,
      search: '',
      manufacturer: undefined,
      page: 1
    });
  };

  /*
  * Set Columns sets columns to state
  * setting columns here in order to reset them if and after we receive productGroup and manufacturer options
  */
  setColumns = () => {
    const columns = TableUtil.translateHeaders(
      [
        {
          Header: 'name',
          accessor: 'name',
          minWidth: 300
        }
      ],
      this.props.t
    );
    this.setState({ columns });
  };

  buildSearchControls = (): FieldConfig => {
    const mainSearchControls = {
      search: {
        render: FormUtil.TextInputWithoutValidation,
        meta: {
          label: 'common:searchProduct',
          colWidth: 3,
          type: 'text',
          placeholder: 'searchPlaceholder',
          defaultValue: this.props.tableFilters.search
        }
      }
    };
    // only add the facility control if there is more than 1
    const facility = {
      render: FormUtil.SelectWithoutValidationLeftLabel,
      meta: {
        label: 'common:facility',
        options: this.props.facilityOptions,
        colWidth: 5,
        type: 'select',
        placeholder: 'facilityPlaceholder',
        className: 'banner-input',
        isClearable: false,
        defaultValue: this.props.tableFilters.facility
          ? this.props.tableFilters.facility.value
          : this.props.facilityOptions[0]
      }
    };

    let searchFieldConfig = {
      controls: { ...mainSearchControls }
    } as FieldConfig;
    if (this.props.facilityOptions.length > 1) {
      searchFieldConfig = {
        controls: { ...mainSearchControls, facility }
      } as FieldConfig;
    }
    return searchFieldConfig;
  };

  /*
  * Handle user clicking on a location row
  * set the selected location to state and open the modal
  */
  getTrProps = (state: FinalState, rowInfo: RowInfo) => {
    // console.log("ROWINFO", rowInfo, state);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            this.props.setSelectedProduct(rowInfo.original);
            this.props.toggleEditLocationModal();
          }
        },
        style: {
          background: this.state.selectedRow[rowInfo.viewIndex]
            ? constants.colors[`${this.state.currentTile.color}Tr`]
            : ''
        }
      };
    } else {
      return {};
    }
  };

  // get the next or previous page of data.  the table is 0 indexed but the API is not
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
      case 'facility':
        this.props.setTableFilter({ facility: value, page: 1 });
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
  onSortedChanged = (
    newSorted: SortingRule[],
    column: any,
    shiftKey: boolean
  ) => {
    this.props.setTableFilter({ sorted: newSorted });
    this.setState({ selectedRow: {} });
  };
  render() {
    console.log('rendering locations table');
    const { t } = this.props;

    return (
      <div className="manage-inventory">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          fieldConfig={this.searchFieldConfig}
          handleSubmit={this.props.getLocationsFacility}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
          t={this.props.t}
        />

        <ReactTable
          data={this.props.tableData}
          columns={this.state.columns}
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
          onSortedChange={this.onSortedChanged}
          sortable={false}
          multiSort={false}
          noDataText={t('common:noDataText')}
          resizable={false}
          expanded={this.state.selectedRow}
        />
        <EditProductModal
          selectedItem={this.props.selectedProduct}
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
    userManage: state.manageLocation,
    loading: state.ajaxCallsInProgress > 0,
    showEditLocationModal: state.manageLocation.showEditLocationModal,
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    tableData: state.manageLocation.data,
    facility: state.manageLocation.facility,
    tableFilters: state.manageLocation.tableFilters,
    selectedProduct: state.manageInventory.selectedProduct
  };
};
export default translate('manageLocation')(
  connect(
    mapStateToProps,
    {
      getLocationsFacility,
      toggleEditLocationModal,
      closeAllModals,
      addToCart,
      setTableFilter,
      setSelectedProduct
    }
  )(ManageLocation)
);
