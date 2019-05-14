/*
* hopsital Managers manage their team
* Note: did minimal renaming from the UserManage component
*/
import { Button, Col, Badge } from 'react-bootstrap';
import { FieldConfig } from 'react-reactive-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, {
  RowInfo,
  FinalState,
  RowRenderProps,
  SortingRule,
  Column
} from 'react-table';

import { FormUtil } from '../common/FormUtil';
import {
  Icustomer,
  IinitialState,
  IinstallBase,
  ImanageInventoryReducer,
  Ioption,
  Iproduct,
  IproductInfo,
  ItableFiltersReducer,
  Itile,
  Iuser,
  IshoppingCart,
  Ifacility
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import {
  addToCart,
  toggleShoppingCartModal
} from '../../actions/shoppingCartActions';
import { closeAllModals } from '../../actions/commonActions';
import { emptyTile, initialInstallBase } from '../../reducers/initialState';
import {
  initInventory,
  getProductInfo,
  setTableFilter,
  toggleInstallContactModal,
  toggleEditInstallModal,
  toggleEditProductModal,
  toggleSearchNewProductsModal,
  toggleImportInstallModal,
  setSelectedProduct,
  requestQuote
} from '../../actions/manageInventoryActions';
import ShoppingCartForm from '../shoppingCart/ShoppingCartForm';

import { getFacility } from '../../actions/manageLocationActions';
import Banner from '../common/Banner';
import EditInstallModal from './EditInstallModal';
import EditProductModal from './EditProductModal';
import ShoppingCartModal from '../shoppingCart/ShoppingCartModal';
import ImportInstallModal from './ImportInstallModal';
import InstallContactModal from './InstallContactModal';
import SearchTableForm from '../common/SearchTableForm';
import { constants } from 'src/constants/constants';
import SearchNewProductsModal from './SearchNewProductsModal';
import { getTotal } from 'src/reducers/cartReducer';
import { MPResultModal } from './MPResultModal';
import { InstallBasesExpanderContainer } from './InstallBasesExpanderContainer';
import { MPResultListHistoryModal } from './MPResultListHistoryModal';
import { MPResultListNotesModal } from './MPResultNotesModal';
import { MPResultAddModal } from './MPResultAddModal';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditProductModal: boolean;
  showEditInstallModal: boolean;
  loading: boolean;
  userManage: ImanageInventoryReducer;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditProductModal: typeof toggleEditProductModal;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  toggleShoppingCartModal: typeof toggleShoppingCartModal;
  toggleSearchNewProductsModal: typeof toggleSearchNewProductsModal;
  toggleImportInstallModal: typeof toggleImportInstallModal;
  getProductInfo: typeof getProductInfo;
  getFacility: typeof getFacility;
  toggleSecurityFunctionsModal: () => void;
  initInventory: typeof initInventory;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
  user: Iuser;
  addToCart: typeof addToCart;
  cartTotal: number;
  tableData: Iproduct[];
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  toggleInstallContactModal: typeof toggleInstallContactModal;
  selectedProduct: Iproduct;
  setSelectedProduct: typeof setSelectedProduct;
  cart: IshoppingCart;
  requestQuote: typeof requestQuote;
  facility: Ifacility;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  selectedInstall: IinstallBase;
  searchFieldConfig: FieldConfig;
}

class ManageInventory extends React.Component<Iprops & IdispatchProps, Istate> {
  public searchFieldConfigBanner: any;
  private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
      selectedInstall: initialInstallBase,
      searchFieldConfig: this.buildSearchControls()
    };
  }
  componentWillMount() {
    // since the install modal depends on a selected product in state, we need to make sure and start off with the modals closed
    this.props.closeAllModals();
    this.props.getProductInfo();
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();
  }
  componentDidMount() {
    // make sure there is a facility set to the table search filters so that it can be used in the EditProductForm
    if (!this.props.tableFilters.facility) {
      const facility = this.props.tableFilters.facility
        ? this.props.tableFilters.facility
        : this.props.facilityOptions[0];
      this.props.setTableFilter({ facility });
      this.props.getFacility(facility.value);
      this.props.initInventory(facility.value);
    } else {
      this.props.getFacility(this.props.tableFilters.facility.value);
      this.props.initInventory(this.props.tableFilters.facility.value);
    }
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditProductModal !== this.props.showEditProductModal &&
      !this.props.showEditProductModal
    ) {
      this.props.setSelectedProduct();
    }

    if (
      prevProps.showEditInstallModal !== this.props.showEditInstallModal &&
      !this.props.showEditInstallModal
    ) {
      this.props.setSelectedProduct();
      this.setState({ selectedInstall: initialInstallBase });
    }

    // we only need to check the mainCategory options because both brands and mainCategory options are received in the same API response
    // and before they are received, there will not be any length.
    if (
      prevProps.productInfo.mainCategoryOptions.length !==
        this.props.productInfo.mainCategoryOptions.length ||
      prevProps.productInfo.brandOptions.length !==
        this.props.productInfo.brandOptions.length
    ) {
      console.log(
        're setting columns and table filters',
        this.props.productInfo.brandOptions
      );
      this.setColumns();
      this.setState({ searchFieldConfig: this.buildSearchControls() });
    }

    // the table will update when we get new products or new installs which are already filtered when they are received from the API
    if (prevProps.tableData !== this.props.tableData) {
      console.log('DATA CHANGED');
    }

    // automatically get inventory every time a fitler changes
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      const { facility } = this.props.tableFilters;
      if (facility) {
        this.props.getFacility(facility.value);
        this.props.initInventory(facility.value);
        if (
          prevProps.tableFilters.facility &&
          facility.value !== prevProps.tableFilters.facility.value
        ) {
          this.setState({ selectedRow: {} });
        }
      }
    }
    if (
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facility = this.props.facilityOptions[0];
      this.props.setTableFilter({ facility });
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
      mainCategory: undefined,
      search: '',
      brand: undefined,
      page: 1
    });
  };

  /*
  * indicate the toggle position and handle the click
  * TODO animate the arrow:
      transition: all .3s cubic-bezier(.175,.885,.32,1.275);
          transform: translate(-50%,-50%) rotate(-90deg);
              transform: translate(-50%,-50%) rotate(0);
  */
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

  /*
  * Set Columns sets columns to state
  * setting columns here in order to reset them if and after we receive mainCategory and brand options
  */
  setColumns = () => {
    const columns = TableUtil.translateHeaders(
      [
        // {
        //   Header: 'manufacturer',
        //   accessor: (product: Iproduct) => {
        //     const brandName = product.brandID
        //       ? this.props.productInfo.brands[product.brandID].name
        //       : '';
        //     if (brandName === '') {
        //       console.error('missing brand', product);
        //     }
        //     return brandName;
        //   },
        //   id: 'manufacturer',
        //   minWidth: 170
        // },
        {
          Header: 'name',
          accessor: 'name',
          minWidth: 400
        },
        // {
        //   Header: 'common:productGroup',
        //   accessor: ({ productGroupID }: Iproduct) => {
        //     return this.props.productInfo.productGroups[productGroupID].name;
        //   },
        //   id: 'productGroup',
        //   minWidth: 170
        // },

        {
          Header: 'qty',
          id: 'quantity',
          minWidth: 50,
          accessor: ({ installs }: { installs: IinstallBase[] }) => {
            return installs.length; // using this rather than data.quantity because when we add new installs, we don't want to update the quantity on the product
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
      },
      mainCategory: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'common:mainCategory',
          options: this.props.productInfo.mainCategoryOptions,
          colWidth: 3,
          type: 'select',
          placeholder: 'mainCategoryPlaceholder',
          defaultValue: this.props.tableFilters.mainCategory,
          isClearable: true
        }
      },
      brand: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'common:manufacturer',
          options: this.props.productInfo.brandOptions,
          colWidth: 3,
          type: 'select',
          placeholder: 'manufacturerPlaceholder',
          defaultValue: this.props.tableFilters.brand,
          isClearable: true
        }
      }
    };
    // only add the facility control if there is more than 1
    const facility = {
      render: FormUtil.SelectWithoutValidationLeftLabel,
      meta: {
        label: 'common:facility',
        options: this.props.facilityOptions,
        colWidth: 7,
        colWidthLG: 5,
        type: 'select',
        placeholder: 'facilityPlaceholder',
        className: 'banner-input',
        isClearable: false,
        defaultValue: this.props.tableFilters.facility
          ? this.props.tableFilters.facility
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
  * Install Expander Row Click Handlers
  */
  contactAboutInstall = (install: IinstallBase) => {
    // grab the product by using the productID from installbase
    const selectedProduct = find(this.props.tableData, {
      id: install.productID
    });
    this.props.setSelectedProduct(selectedProduct);
    // TODO test to make sure the contact modal has the selected product defined
    this.setState({ selectedInstall: install }, () => {
      this.props.toggleInstallContactModal();
    });
  };

  /*
  * Handle user clicking on a product row column
  * set the selected product to state and open the modal
  */
  getTdProps = (
    state: FinalState,
    rowInfo: RowInfo,
    column: Column,
    instance: any
  ) => {
    // console.log("ROWINFO", rowInfo, state);
    if (column.id && column.id === 'expander-toggle') {
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
    } else {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          this.props.setSelectedProduct(rowInfo.original);
          this.props.toggleEditProductModal();
        },
        style: {
          background: this.state.selectedRow[rowInfo.viewIndex]
            ? constants.colors[`${this.state.currentTile.color}Tr`]
            : ''
        }
      };
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
      case 'mainCategory':
        this.props.setTableFilter({ mainCategory: value, page: 1 });
        break;
      case 'brand':
        this.props.setTableFilter({ brand: value, page: 1 });
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

  canEditInstalls = () => {
    return (
      constants.hasSecurityFunction(
        this.props.user,
        constants.securityFunctions.ManageInventory.id
      ) ||
      constants.hasSecurityFunction(
        this.props.user,
        constants.securityFunctions.FSE.id
      )
    );
  };

  canRequestQuote = () => {
    return constants.hasSecurityFunction(
      this.props.user,
      constants.securityFunctions.QuoteForInvoice.id
    );
  };

  /*
  * Handle Product Select
  */
  handleProductSelect = (product: Iproduct) => {
    const newProduct = {
      ...product,
      subcategory: this.props.productInfo.subcategories[product.subcategoryID]
    };
    this.props.toggleEditInstallModal();
    this.props.setSelectedProduct(newProduct);
  };
  selectInstallBase = (installBase: IinstallBase) => {
    this.setState({
      selectedInstall: installBase
    });
  };
  handleInstallBaseSelect = (installBase: IinstallBase) => {
    // grab the product by using the productID from installbase
    const selectedProduct = find(this.props.tableData, {
      id: installBase.productID
    }) as Iproduct;
    this.props.setSelectedProduct(selectedProduct);
    this.selectInstallBase(installBase);
    this.props.toggleEditInstallModal();
  };
  handleAddInstallBase = (product: any) => {
    this.props.setSelectedProduct(product);
    this.setState({ selectedInstall: initialInstallBase }, () => {
      this.props.toggleEditInstallModal();
    });
  };
  render() {
    console.log(
      'rendering inventory table',
      TableUtil.buildLocation(this.state.selectedInstall, this.props.facility)
    );
    if (this.props.productInfo.mainCategoryOptions.length === 0) {
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
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.state.searchFieldConfig}
          handleSubmit={this.props.initInventory}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
          t={this.props.t}
          showSearchButton={false}
        />
        {this.canRequestQuote() && (
          <Button
            className="request-for-quote-cart-button"
            bsStyle="primary"
            onClick={() => this.props.toggleShoppingCartModal('INVENTORY')}
          >
            <FontAwesomeIcon icon="shopping-cart" />
            <Badge>{this.props.cartTotal} </Badge>
          </Button>
        )}

        {this.canEditInstalls() && (
          <div>
            <Button
              className="table-import-button"
              bsStyle="link"
              onClick={this.props.toggleImportInstallModal}
            >
              {t('import')}
            </Button>

            <Button
              className="table-add-button"
              bsStyle="link"
              onClick={this.props.toggleSearchNewProductsModal}
            >
              {t('manageInventory:newProduct')}
            </Button>
          </div>
        )}

        <ReactTable
          data={this.props.tableData}
          columns={this.state.columns}
          getTdProps={this.getTdProps}
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
          SubComponent={(rowInfo: RowInfo) => (
            <InstallBasesExpanderContainer
              {...rowInfo}
              addInstallation={() => {
                this.handleAddInstallBase(rowInfo.original);
              }}
              t={this.props.t}
              showAddInstallation={this.canEditInstalls()}
              showRequestQuote={this.canRequestQuote()}
              handleInstallBaseSelect={this.handleInstallBaseSelect}
              contactAboutInstall={this.contactAboutInstall}
              selectInstallBase={this.selectInstallBase}
            />
          )}
          resizable={false}
          expanded={this.state.selectedRow}
        />
        <EditProductModal
          selectedItem={this.props.selectedProduct}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          secondModal={this.props.userManage.showSearchNewProductsModal}
        />
        <ShoppingCartModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          cart={this.props.cart}
          title={this.props.t('manageInventory:requestForQuote')}
          checkout={this.props.requestQuote}
          cartName="INVENTORY"
          ShoppingCartForm={ShoppingCartForm}
        />
        <EditInstallModal
          selectedProduct={this.props.selectedProduct}
          selectedItem={this.state.selectedInstall}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <InstallContactModal
          selectedProduct={this.props.selectedProduct}
          selectedInstall={this.state.selectedInstall}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />

        <SearchNewProductsModal
          selectedItem={this.props.selectedProduct}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          handleProductSelect={this.handleProductSelect}
        />
        <ImportInstallModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <MPResultModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          secondModal={false}
          locationString={TableUtil.buildLocation(
            this.state.selectedInstall,
            this.props.facility
          )}
        />
        <MPResultListHistoryModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          secondModal={false}
          locationString={TableUtil.buildLocation(
            this.state.selectedInstall,
            this.props.facility
          )}
          selectedInstallBaseID={this.state.selectedInstall.id}
        />
        <MPResultListNotesModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          secondModal={true}
        />
        <MPResultAddModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          selectedInstallBaseID={this.state.selectedInstall.id}
          secondModal={true}
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
    userManage: state.manageInventory,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditProductModal: state.manageInventory.showEditProductModal,
    showEditInstallModal: state.manageInventory.showEditInstallModal,
    showInstallContactModal: state.manageInventory.showInstallContactModal,
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    productInfo: state.manageInventory.productInfo,
    cartTotal: getTotal(state.manageInventory.cart),
    tableData: state.manageInventory.data,
    tableFilters: state.manageInventory.tableFilters,
    selectedProduct: state.manageInventory.selectedProduct,
    cart: state.manageInventory.cart,
    facility: state.manageLocation.facility
  };
};
export default translate('manageInventory')(
  connect(
    mapStateToProps,
    {
      initInventory,
      toggleEditProductModal,
      toggleEditInstallModal,
      toggleShoppingCartModal,
      toggleSearchNewProductsModal,
      closeAllModals,
      getProductInfo,
      getFacility,
      addToCart,
      setTableFilter,
      toggleInstallContactModal,
      setSelectedProduct,
      toggleImportInstallModal,
      requestQuote
    }
  )(ManageInventory)
);
