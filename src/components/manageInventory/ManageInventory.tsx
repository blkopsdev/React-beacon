/*
* hopsital Managers manage their team
* Note: did minimal renaming from the UserManage component
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getInventory,
  updateUser,
  toggleEditInventoryModal
} from '../../actions/manageInventoryActions';
import {
  IinitialState,
  Itile,
  IteamManage,
  Icustomer,
  Iproduct
} from '../../models';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import Banner from '../common/Banner';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import constants from '../../constants/constants';
import { translate, TranslationFunction, I18n } from 'react-i18next';
// import { find } from 'lodash';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';
import EditModal from './ManageInventoryModal';
import { closeAllModals } from '../../actions/commonActions';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditModal: boolean;
  loading: boolean;
  userManage: IteamManage;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditUserModal: () => void;
  toggleSecurityFunctionsModal: () => void;
  getInventory: typeof getInventory;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class ManageInventory extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public searchFieldConfig: any;
  public buttonInAction = false;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.getTrProps = this.getTrProps.bind(this);
    this.state = {
      selectedRow: null,
      currentTile: emptyTile
    };
    this.columns = TableUtil.translateHeaders(
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
            return productGroupID; // TODO find the name of the product group
            // return hasTeamMembers ? 'Yes' : 'No';
          },
          id: 'productGroup'
        },
        {
          Header: 'Manufacturer',
          accessor: ({ manufacturerID }: Iproduct) => {
            return manufacturerID; // TODO get the name of the manufacturer
          },
          id: 'manufacturer'
        }
      ],
      this.props.t
    );
    this.searchFieldConfig = {
      controls: {
        search: {
          render: FormUtil.TextInputWithoutValidation,
          meta: {
            label: 'common:search',
            colWidth: 4,
            type: 'text',
            placeholder: 'searchPlaceholder'
          }
        }
      }
    };
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    // refresh the userManage every time the component mounts
    this.props.getInventory(
      1,
      '',
      'bbb5d95c-129f-4837-988c-0bf4ae1f3b67',
      '',
      ''
    );
    // refresh the list of customers every time the component mounts
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      prevProps.showEditModal !== this.props.showEditModal &&
      !this.props.showEditModal
    ) {
      this.setState({ selectedRow: null });
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  getTrProps = (state: any, rowInfo: any) => {
    // console.log("ROWINFO", rowInfo);
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (!this.buttonInAction) {
            this.setState({
              selectedRow: rowInfo.index
            });
            this.props.toggleEditUserModal();
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
    facilityID,
    manufacturerID,
    productGroupID
  }: {
    search: string;
    facilityID: { value: string; title: string };
    manufacturerID: { value: string; title: string };
    productGroupID: { value: string; title: string };
  }) => {
    const fID = facilityID ? facilityID.value : '';
    const manID = manufacturerID ? manufacturerID.value : '';
    const pgID = productGroupID ? productGroupID.value : '';
    this.props.getInventory(
      this.props.userManage.page,
      search,
      fID,
      manID,
      pgID
    );
  };

  render() {
    // if (this.props.userManage.data.length === 0) {
    //   return <div>EFF</div>;
    // }
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
          className="table-add-button"
          bsStyle={constants.colors[`${this.state.currentTile.color}Button`]}
          onClick={this.props.toggleEditUserModal}
        >
          {t('teamManage:newTeamMember')}
        </Button>
        <ReactTable
          data={this.props.userManage.data}
          columns={this.columns}
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
          selectedUser={this.props.userManage.data[this.state.selectedRow]}
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
    showEditModal: state.showEditInventoryModal
  };
};
export default translate('teamManage')(
  connect(
    mapStateToProps,
    {
      getInventory,
      updateUser,
      toggleEditInventoryModal,
      closeAllModals
    }
  )(ManageInventory)
);
