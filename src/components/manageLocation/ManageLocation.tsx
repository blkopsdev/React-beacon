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
import { Breadcrumb, BreadcrumbItem, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  Ioption,
  ItableFiltersReducer,
  Iuser,
  Ifacility,
  Itile,
  ImanageLocationReducer,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { addToCart } from '../../actions/shoppingCartActions';
import { closeAllModals } from '../../actions/commonActions';
import { emptyTile, initialLoc } from '../../reducers/initialState';
import {
  getLocationsFacility,
  saveAnyLocation,
  updateAnyLocation,
  setTableFilter,
  toggleEditLocationModal,
  setSelectedBuilding,
  setSelectedFloor,
  setSelectedLocation,
  setSelectedRoom
} from '../../actions/manageLocationActions';
import Banner from '../common/Banner';
import EditLocationModal from './EditLocationModal';
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
  saveAnyLocation: typeof saveAnyLocation;
  updateAnyLocation: typeof updateAnyLocation;
  closeAllModals: typeof closeAllModals;
  facilityOptions: Ioption[];
  user: Iuser;
  tableData: any[];
  facility: Ifacility;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  selectedBuilding: Ibuilding;
  selectedFloor: Ifloor;
  selectedLocation: Ilocation;
  selectedRoom: Iroom;
  setSelectedBuilding: typeof setSelectedBuilding;
  setSelectedFloor: typeof setSelectedFloor;
  setSelectedLocation: typeof setSelectedLocation;
  setSelectedRoom: typeof setSelectedRoom;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  data: any[];
  selectedItem: any;
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
      data: [],
      selectedItem: {}
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
    // this.props.getLocationsFacility(this.props.facilityOptions[0].value);
    // this.props.saveAnyLocation({
    //   name: 'Building A',
    //   facilityID: this.props.facilityOptions[0].value
    // });
    // make sure there is a facility set to the table search filters so that it can be used in the EditProductForm
    if (!this.props.tableFilters.facility) {
      const facility = this.props.tableFilters.facility
        ? this.props.tableFilters.facility
        : this.props.facilityOptions[0];
      this.props.setTableFilter({ facility });
    } else {
      this.props.getLocationsFacility(this.props.tableFilters.facility.value);
    }
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    // if (
    //   prevProps.showEditLocationModal !== this.props.showEditLocationModal &&
    //   !this.props.showEditLocationModal
    // ) {
    //   this.props.setSelectedProduct();
    // }

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

    // if (prevProps.facility !== this.props.facility) {
    //   this.getLocationType();
    // }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  handleEdit(selectedItem: any) {
    this.setState({ selectedItem });
    // console.log("EDIT:", item);
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
        },
        {
          Header: '',
          Cell: row => (
            <Button
              bsStyle="link"
              onClick={() => {
                this.buttonInAction = true;
                this.handleEdit(row.original);
              }}
            >
              <FontAwesomeIcon icon={['far', 'edit']}> Edit </FontAwesomeIcon>
            </Button>
          )
        }
      ],
      this.props.t
    );
    this.setState({ columns });
  };

  buildSearchControls = (): FieldConfig => {
    const mainSearchControls = {
      // search: {
      //   render: FormUtil.TextInputWithoutValidation,
      //   meta: {
      //     label: 'common:searchProduct',
      //     colWidth: 3,
      //     type: 'text',
      //     placeholder: 'searchPlaceholder',
      //     defaultValue: this.props.tableFilters.search
      //   }
      // }
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
          if (this.buttonInAction) {
            this.props.toggleEditLocationModal();
          } else {
            if (this.getLocationType() === 'Building') {
              this.props.setSelectedBuilding(rowInfo.original);
            } else if (this.getLocationType() === 'Floor') {
              this.props.setSelectedFloor(rowInfo.original);
            } else if (this.getLocationType() === 'Location') {
              this.props.setSelectedLocation(rowInfo.original);
            } else {
              this.props.setSelectedRoom(rowInfo.original);
            }
          }
          this.buttonInAction = false;
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

  // get location type
  getLocationType = () => {
    if (this.props.selectedLocation.id) {
      return 'Room';
    } else if (this.props.selectedFloor.id) {
      return 'Location';
    } else if (this.props.selectedBuilding.id) {
      return 'Floor';
    } else {
      return 'Building';
    }
  };

  handleBCClick = (item: any, lType: string) => {
    if (lType === 'Building') {
      this.props.setSelectedBuilding(item);
    } else if (lType === 'Floor') {
      this.props.setSelectedFloor(item);
    } else if (lType === 'Location') {
      this.props.setSelectedLocation(item);
    }
  };

  // get breadcrumb path
  getBreadcrumbs = () => {
    return (
      <Breadcrumb>
        <BreadcrumbItem active>
          <a
            href="#"
            onClick={() => this.handleBCClick(initialLoc, 'Building')}
          >
            Buildings
          </a>
        </BreadcrumbItem>
        {this.props.selectedBuilding.id ? (
          <BreadcrumbItem active>
            <a
              href="#"
              onClick={() =>
                this.handleBCClick(this.props.selectedBuilding, 'Building')
              }
            >
              {this.props.selectedBuilding.name}
            </a>
          </BreadcrumbItem>
        ) : (
          ''
        )}
        {this.props.selectedFloor.id ? (
          <BreadcrumbItem active>
            <a
              href="#"
              onClick={() =>
                this.handleBCClick(this.props.selectedFloor, 'Floor')
              }
            >
              {this.props.selectedFloor.name}
            </a>
          </BreadcrumbItem>
        ) : (
          ''
        )}
        {this.props.selectedLocation.id ? (
          <BreadcrumbItem active>
            <a
              href="#"
              onClick={() =>
                this.handleBCClick(this.props.selectedLocation, 'Location')
              }
            >
              {this.props.selectedLocation.name}
            </a>
          </BreadcrumbItem>
        ) : (
          ''
        )}
      </Breadcrumb>
    );
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
          showSearchButton={false}
          t={this.props.t}
        />
        {this.getBreadcrumbs()}
        <Button
          className="table-add-button"
          bsStyle="link"
          onClick={() => {
            this.setState({ selectedItem: {} }, () => {
              this.props.toggleEditLocationModal();
            });
          }}
        >
          {t(`manageLocation:new${this.getLocationType()}`)}
        </Button>
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
        <EditLocationModal
          selectedItem={this.state.selectedItem}
          selectedType={this.getLocationType()}
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
    selectedBuilding: state.manageLocation.selectedBuilding,
    selectedFloor: state.manageLocation.selectedFloor,
    selectedLocation: state.manageLocation.selectedLocation,
    selectedRoom: state.manageLocation.selectedRoom
  };
};
export default translate('manageLocation')(
  connect(
    mapStateToProps,
    {
      getLocationsFacility,
      saveAnyLocation,
      updateAnyLocation,
      toggleEditLocationModal,
      closeAllModals,
      addToCart,
      setTableFilter,
      setSelectedBuilding,
      setSelectedFloor,
      setSelectedLocation,
      setSelectedRoom
    }
  )(ManageLocation)
);
