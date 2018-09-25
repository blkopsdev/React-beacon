/*
* hopsital Managers manage their team
* Note: did minimal renaming from the UserManage component
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getInventory,
  toggleEditProductModal,
  toggleEditInstallModal,
  toggleEditQuoteModal,
  getProductInfo,
  setSelectedFacility
} from '../../actions/manageInventoryActions';
import { getTotal } from '../../reducers/manageInventoryReducer';
import { addToCart } from '../../actions/shoppingCartActions';
import {
  IinitialState,
  Itile,
  ImanageInventory,
  Icustomer,
  Iproduct,
  Ioption,
  Iuser,
  IproductInfo,
  IinstallBase
} from '../../models';
import { FieldConfig } from 'react-reactive-form';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable, { RowInfo, FinalState, RowRenderProps } from 'react-table';
import { Button, Col, Badge } from 'react-bootstrap';
import Banner from '../common/Banner';
import constants from '../../constants/constants';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';
import EditProductModal from './EditProductModal';
import EditInstallModal from './EditInstallModal';
import EditQuoteModal from '../shoppingCart/EditQuoteModal';
import { closeAllModals } from '../../actions/commonActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InstallationsExpander } from './InstallsExpander';
import { find } from 'lodash';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditProductModal: boolean;
  showEditInstallModal: boolean;
  loading: boolean;
  userManage: ImanageInventory;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditProductModal: typeof toggleEditProductModal;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  toggleEditQuoteModal: typeof toggleEditQuoteModal;
  getProductInfo: typeof getProductInfo;
  toggleSecurityFunctionsModal: () => void;
  getInventory: typeof getInventory;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
  user: Iuser;
  setSelectedFacility: typeof setSelectedFacility;
  addToCart: typeof addToCart;
  cartTotal: number;
  tableData: Iproduct[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any;
  selectedProduct: any;
  selectedInstall: any;
}

class ManageInventory extends React.Component<Iprops & IdispatchProps, Istate> {
  // public searchFieldConfig: any;
  public searchFieldConfigBanner: any;
  public buttonInAction = false;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
      selectedProduct: {},
      selectedInstall: {}
    };
  }
  componentWillMount() {
    // since the install modal depends on a selected product in state, we need to make sure and start off with the modals closed
    this.props.closeAllModals();
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();
    // get product info every time the component mounts
    this.props.getProductInfo();
    // get inventory every time the component mounts
    const facility = this.props.userManage.selectedFacility.value.length
      ? this.props.userManage.selectedFacility
      : this.props.facilityOptions[0];

    this.props.setSelectedFacility(facility);
    this.props.getInventory(1, '', facility.value, '', '');
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditProductModal !== this.props.showEditProductModal &&
      !this.props.showEditProductModal
    ) {
      this.setState({ selectedProduct: {} });
    }

    if (
      prevProps.showEditInstallModal !== this.props.showEditInstallModal &&
      !this.props.showEditInstallModal
    ) {
      this.setState({ selectedProduct: {}, selectedInstall: {} });
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
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * indicate the toggle position and handle the click
  * we set buttonInAction in order to prevent the the edit product modal opening when the row is clicked
  * TODO animate the arrow:
      transition: all .3s cubic-bezier(.175,.885,.32,1.275);
          transform: translate(-50%,-50%) rotate(-90deg);
              transform: translate(-50%,-50%) rotate(0);
  */
  expanderToggle = (props: RowRenderProps) => {
    const handleToggle = () => {
      this.buttonInAction = true;
      this.setState(
        {
          selectedRow: {
            [props.viewIndex || 0]: !this.state.selectedRow[
              props.viewIndex || 0
            ]
          }
        },
        () => (this.buttonInAction = false)
      );
    };
    return (
      <div onClick={handleToggle}>
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
  * setting columns here in order to reset them if and after we receive productGroup and manufacturer options
  */
  setColumns = () => {
    const columns = TableUtil.translateHeaders(
      [
        {
          Header: 'sku',
          accessor: 'sku'
        },
        {
          Header: 'name',
          accessor: 'name'
        },
        {
          Header: 'productGroup',
          accessor: ({ productGroupID }: Iproduct) => {
            return this.props.productInfo.productGroups[productGroupID].name;
          },
          id: 'productGroup'
        },
        {
          Header: 'manufacturer',
          accessor: ({ manufacturerID }: Iproduct) => {
            return this.props.productInfo.manufacturers[manufacturerID].name;
          },
          id: 'manufacturer'
        },
        {
          Header: 'quantity',
          id: 'quantity',
          accessor: ({ installs }: { installs: IinstallBase[] }) => {
            return installs.length; // using this rather than data.quantity because when we add new installs, we don't want to update the quantity on the product
          },
          minWidth: 50
        },
        {
          id: 'expander-toggle',
          Cell: this.expanderToggle,
          minWidth: 20,
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
            this.props.toggleEditProductModal();
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

  /*
  * Handle user clicking on an install row
  * set the selected install to state and open the modal
  */
  getExpanderTrProps = (state: FinalState, rowInfo: RowInfo) => {
    // console.log("ROWINFO", rowInfo, state);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            // grab the product by using the productID from installbase
            const selectedProduct = find(this.props.tableData, {
              id: rowInfo.original.productID
            });
            this.setState({
              selectedProduct,
              selectedInstall: rowInfo.original
            });
            this.props.toggleEditInstallModal();
          }
        }
      };
    } else {
      return {};
    }
  };

  // handleEditInstall = (e: React.MouseEvent<HTMLFormElement>)
  // get the next or previous page of data.  the table is 0 indexed but the API is not
  onPageChange = (page: number) => {
    this.props.getInventory(page + 1, '', '', '', '');
  };
  onSearchSubmit = ({
    search,
    facility,
    manufacturer,
    productGroup
  }: {
    search: string;
    facility: { value: string; title: string };
    manufacturer: { value: string; title: string };
    productGroup: { value: string; title: string };
  }) => {
    const backupfID = this.props.userManage.selectedFacility.value.length
      ? this.props.userManage.selectedFacility.value
      : this.props.facilityOptions[0].value;
    const fID = facility ? facility.value : backupfID;
    const manID = manufacturer ? manufacturer.value : '';
    const pgID = productGroup ? productGroup.value : '';
    this.props.getInventory(
      this.props.userManage.page,
      search,
      fID,
      manID,
      pgID
    );
  };
  onSearchValuechanges = (value: any, key: string) => {
    // set the selection to redux
    // update the table data
    if (key === 'facility') {
      this.props.setSelectedFacility(value);
      this.props.getInventory(1, '', value.value, '', '');
    }
  };
  // TODO  hide facilities if only one
  // scroll content area only
  render() {
    if (this.props.productInfo.productGroupOptions.length === 0) {
      return (
        <Col xs={12}>
          <h4> loading... </h4>
        </Col>
      );
    }
    const { t } = this.props;

    const mainSearchControls = {
      search: {
        render: FormUtil.TextInputWithoutValidation,
        meta: {
          label: 'common:searchProduct',
          colWidth: 3,
          type: 'text',
          placeholder: 'searchPlaceholder'
        }
      },
      productGroup: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'common:productGroup',
          options: this.props.productInfo.productGroupOptions,
          colWidth: 3,
          type: 'select',
          placeholder: 'productGroupPlaceholder'
        }
      },
      manufacturer: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'common:manufacturer',
          options: this.props.productInfo.manufacturerOptions,
          colWidth: 3,
          type: 'select',
          placeholder: 'manufacturerPlaceholder'
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
        defaultValue: this.props.userManage.selectedFacility.value.length
          ? this.props.userManage.selectedFacility
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

    return (
      <div className="user-manage">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          fieldConfig={searchFieldConfig}
          handleSubmit={this.onSearchSubmit}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValuechanges}
          t={this.props.t}
        />
        <Button
          className="request-for-quote-cart-button"
          bsStyle="primary"
          onClick={this.props.toggleEditQuoteModal}
        >
          <FontAwesomeIcon icon="shopping-cart" />
          <Badge>{this.props.cartTotal} </Badge>
        </Button>

        <Button
          className="table-add-button"
          bsStyle="link"
          onClick={this.props.toggleEditProductModal}
        >
          {t('manageInventory:newProduct')}
        </Button>
        <ReactTable
          data={this.props.tableData}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.tableData.length}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.userManage.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          SubComponent={(rowInfo: RowInfo) => (
            <InstallationsExpander
              {...rowInfo}
              addToQuote={this.props.addToCart}
              addInstallation={() => {
                this.setState(
                  { selectedProduct: rowInfo.original, selectedInstall: {} },
                  () => {
                    this.props.toggleEditInstallModal();
                  }
                );
              }}
              t={this.props.t}
              getExpanderTrProps={this.getExpanderTrProps}
            />
          )}
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
        <EditQuoteModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <EditInstallModal
          selectedProduct={this.state.selectedProduct}
          selectedItem={this.state.selectedInstall}
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
    userManage: state.manageInventory,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditProductModal: state.manageInventory.showEditProductModal,
    showEditInstallModal: state.manageInventory.showEditInstallModal,
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    productInfo: state.manageInventory.productInfo,
    cartTotal: getTotal(state.manageInventory),
    tableData: state.manageInventory.data
  };
};
export default translate('manageInventory')(
  connect(
    mapStateToProps,
    {
      getInventory,
      toggleEditProductModal,
      toggleEditInstallModal,
      toggleEditQuoteModal,
      closeAllModals,
      getProductInfo,
      setSelectedFacility,
      addToCart
    }
  )(ManageInventory)
);
