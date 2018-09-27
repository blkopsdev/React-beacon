/*
* hopsital Managers manage their products
* Note: did minimal renaming from the ManageInventory component
*/
import { Col } from 'react-bootstrap';
import { FieldConfig } from 'react-reactive-form';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { RowInfo, FinalState, SortingRule } from 'react-table';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  IinstallBase,
  ImanageProductQueueReducer,
  // Iproduct,
  IproductQueueObject,
  IproductInfo,
  ItableFiltersReducer,
  Itile,
  Iuser
} from '../../models';
// import { InstallationsExpander } from "./InstallsExpander";
import { TableUtil } from '../common/TableUtil';
import { addToCart } from '../../actions/shoppingCartActions';
import { closeAllModals } from '../../actions/commonActions';
import { emptyTile } from '../../reducers/initialState';
import { getProductInfo } from '../../actions/manageInventoryActions';
import {
  getProductQueue,
  setTableFilter,
  toggleApproveProductModal
  // approveProduct
} from '../../actions/manageProductQueueActions';
import Banner from '../common/Banner';
import EditProductModal from './EditProductModal';
import SearchTableForm from '../common/SearchTableForm';
import constants from '../../constants/constants';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showApproveProductModal: boolean;
  loading: boolean;
  userManage: ImanageProductQueueReducer;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleApproveProductModal: typeof toggleApproveProductModal;
  getProductInfo: typeof getProductInfo;
  toggleSecurityFunctionsModal: () => void;
  getProductQueue: typeof getProductQueue;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  productInfo: IproductInfo;
  user: Iuser;
  // addToCart: typeof addToCart;
  // cartTotal: number;
  tableData: IproductQueueObject[];
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any;
  selectedProduct: any;
  selectedInstall: any;
}

class ManageProductQueue extends React.Component<
  Iprops & IdispatchProps,
  Istate
> {
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
      selectedProduct: {},
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
    this.props.getProductInfo();
    this.props.getProductQueue();
    // make sure there is a facility set to the table search filters so that it can be used in the EditProductForm
    // if (!this.props.tableFilters.facility) {
    //   const facility = this.props.tableFilters.facility
    //     ? this.props.tableFilters.facility
    //     : this.props.facilityOptions[0];
    //   this.props.setTableFilter({ facility });
    // }
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showApproveProductModal !==
        this.props.showApproveProductModal &&
      !this.props.showApproveProductModal
    ) {
      this.setState({ selectedProduct: {} });
    }

    // we only need to check the productGroup options because both manufacturers and productGroup options are received in the same API response
    // and before they are received, there will not be any length.
    if (
      prevProps.productInfo.productGroupOptions.length !==
        this.props.productInfo.productGroupOptions.length ||
      prevProps.productInfo.manufacturerOptions.length !==
        this.props.productInfo.manufacturerOptions.length
    ) {
      console.log('re setting columns');
      this.setColumns();
    }

    // update the table when we get new products or new installs
    if (prevProps.tableData !== this.props.tableData) {
      console.log('DATA CHANGED');
    }

    // automatically get inventory every time a fitler changes
    if (prevProps.tableFilters !== this.props.tableFilters) {
      this.props.getProductQueue();
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * Reset the table filters (not used currently)
  */
  resetTableFilters = () => {
    this.props.setTableFilter({
      search: '',
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
          Header: 'sku',
          accessor: 'product.sku'
        },
        {
          Header: 'name',
          accessor: 'product.name'
        },
        {
          Header: 'productGroup',
          accessor: ({ product }: IproductQueueObject) => {
            return this.props.productInfo.productGroups[product.productGroupID]
              .name;
          },
          id: 'productGroup'
        },
        {
          Header: 'manufacturer',
          accessor: ({ product }: IproductQueueObject) => {
            return this.props.productInfo.manufacturers[product.manufacturerID]
              .name;
          },
          id: 'manufacturer'
        },
        {
          Header: 'brand',
          id: 'brand',
          accessor: ({ product }: IproductQueueObject) => {
            return this.props.productInfo.brands[product.brandID].name;
          }
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
          label: 'common:search',
          colWidth: 3,
          type: 'text',
          placeholder: 'searchPlaceholder',
          defaultValue: this.props.tableFilters.search
        }
      }
    };
    const searchFieldConfig = {
      controls: { ...mainSearchControls }
    } as FieldConfig;
    return searchFieldConfig;
  };
  contactAboutInstall = (install: IinstallBase) => {
    this.buttonInAction = true;
    this.setState({ selectedInstall: install }, () => {
      this.buttonInAction = false;
    });
  };

  /*
  * Handle user clicking on a product row
  * set the selected product to state and open the modal
  */
  getTrProps = (state: FinalState, rowInfo: RowInfo) => {
    // console.log("ROWINFO", rowInfo, state);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            this.setState({
              selectedProduct: rowInfo.original
            });
            this.props.toggleApproveProductModal();
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
      case 'productGroup':
        this.props.setTableFilter({ productGroup: value, page: 1 });
        break;
      case 'manufacturer':
        this.props.setTableFilter({ manufacturer: value, page: 1 });
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
    console.log('rendering inventory table');
    if (this.props.productInfo.productGroupOptions.length === 0) {
      return (
        <Col xs={12}>
          <h4> loading... </h4>
        </Col>
      );
    }
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
          handleSubmit={this.props.getProductQueue}
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
          selectedItem={this.state.selectedProduct}
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
    userManage: state.manageProductQueue,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showApproveProductModal: state.manageProductQueue.showApproveProductModal,
    productInfo: state.manageInventory.productInfo,
    tableData: state.manageProductQueue.data,
    tableFilters: state.manageProductQueue.tableFilters
  };
};
export default translate('manageProductQueue')(
  connect(
    mapStateToProps,
    {
      getProductQueue,
      toggleApproveProductModal,
      closeAllModals,
      getProductInfo,
      addToCart,
      setTableFilter
    }
  )(ManageProductQueue)
);
