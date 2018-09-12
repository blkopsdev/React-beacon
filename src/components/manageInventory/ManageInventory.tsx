/*
* hopsital Managers manage their team
* Note: did minimal renaming from the UserManage component
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getInventory,
  toggleEditInventoryModal,
  getProductInfo
} from '../../actions/manageInventoryActions';
import {
  IinitialState,
  Itile,
  ImanageInventory,
  Icustomer,
  Iproduct,
  Ioption,
  Iuser
} from '../../models';
import { FieldConfig } from 'react-reactive-form';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import Banner from '../common/Banner';
import constants from '../../constants/constants';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { find } from 'lodash';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';
import EditModal from './ManageInventoryModal';
import { closeAllModals } from '../../actions/commonActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditModal: boolean;
  loading: boolean;
  userManage: ImanageInventory;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditInventoryModal: typeof toggleEditInventoryModal;
  getProductInfo: typeof getProductInfo;
  toggleSecurityFunctionsModal: () => void;
  getInventory: typeof getInventory;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
  productGroupOptions: Ioption[];
  manufacturerOptions: Ioption[];
  facilityOptions: Ioption[];
  user: Iuser;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any;
}

class ManageInventory extends React.Component<Iprops & IdispatchProps, Istate> {
  public searchFieldConfig: any;
  public searchFieldConfigBanner: any;
  public buttonInAction = false;
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
        search: {
          render: FormUtil.TextInputWithoutValidation,
          meta: {
            label: 'common:search',
            colWidth: 3,
            type: 'text',
            placeholder: 'searchPlaceholder'
          }
        },
        productGroup: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'common:productGroup',
            options: this.props.facilityOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'productGroupPlaceholder'
          }
        },
        manufacturer: {
          render: FormUtil.SelectWithoutValidation,
          meta: {
            label: 'common:manufacturer',
            options: this.props.facilityOptions,
            colWidth: 3,
            type: 'select',
            placeholder: 'manufacturerPlaceholder'
          }
        },
        facility: {
          render: FormUtil.SelectWithoutValidationLeftLabel,
          meta: {
            label: 'common:facility',
            options: this.props.facilityOptions,
            colWidth: 5,
            type: 'select',
            placeholder: 'facilityPlaceholder',
            className: 'banner-input',
            defaultValue: this.props.facilityOptions[0]
          }
        }
      }
    } as FieldConfig;
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();

    this.props.getProductInfo();
    // refresh the userManage every time the component mounts

    // TODO get inventory commented out temporarily because the API is busted.
    this.props.getInventory(
      1,
      '',
      'bbb5d95c-129f-4837-988c-0bf4ae1f3b67',
      '',
      ''
    );
    // refresh the list of customers every time the component mounts
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditModal !== this.props.showEditModal &&
      !this.props.showEditModal
    ) {
      this.setState({ selectedRow: null });
    }

    if (
      prevProps.productGroupOptions.length !==
        this.props.productGroupOptions.length ||
      prevProps.manufacturerOptions.length !==
        this.props.manufacturerOptions.length
    ) {
      console.log('re setting columns');
      this.setColumns();
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * Set Columns sets columns to state
  * setting columns here in order to reset them if and after we receive productGroup and manufacturer options
  */
  setColumns = () => {
    const columns = TableUtil.translateHeaders(
      [
        {
          Header: 'SKU',
          accessor: 'sku'
        },
        {
          Header: 'Name',
          accessor: 'name'
        },
        {
          Header: 'Product Group',
          accessor: ({ productGroupID }: Iproduct) => {
            const productGroup = find(this.props.productGroupOptions, {
              value: productGroupID
            });
            return productGroup ? productGroup.label : '';
          },
          id: 'productGroup'
        },
        {
          Header: 'Manufacturer',
          accessor: ({ manufacturerID }: Iproduct) => {
            const manufacturer = find(this.props.manufacturerOptions, {
              value: manufacturerID
            });
            return manufacturer ? manufacturer.label : '';
          },
          id: 'manufacturer'
        }
      ],
      this.props.t
    );
    this.setState({ columns });
  };
  getTrProps = (state: any, rowInfo: any) => {
    // console.log("ROWINFO", rowInfo);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            this.setState({
              selectedRow: rowInfo.index
            });
            this.props.toggleEditInventoryModal();
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
    const fID = facility ? facility.value : '';
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
          handleSubmit={this.onSearchSubmit}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <Button
          className="request-for-quote-cart-button"
          bsStyle="primary"
          onClick={this.props.toggleEditInventoryModal}
        >
          <FontAwesomeIcon icon="shopping-cart" />
        </Button>

        <Button
          className="table-add-button"
          bsStyle={constants.colors[`${this.state.currentTile.color}Button`]}
          onClick={this.props.toggleEditInventoryModal}
        >
          {t('manageInventory:newProduct')}
        </Button>
        <ReactTable
          data={this.props.userManage.data}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={this.props.userManage.data.length}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.userManage.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
        />
        <EditModal
          selectedItem={this.props.userManage.data[this.state.selectedRow]}
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
    showEditModal: state.showEditInventoryModal,
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    productGroupOptions: FormUtil.convertToOptions(
      state.productInfo.productGroups
    ),
    manufacturerOptions: FormUtil.convertToOptions(
      state.productInfo.manufacturers
    )
  };
};
export default translate('manageInventory')(
  connect(
    mapStateToProps,
    {
      getInventory,
      toggleEditInventoryModal,
      closeAllModals,
      getProductInfo
    }
  )(ManageInventory)
);
