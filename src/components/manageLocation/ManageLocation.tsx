/*
* hopsital Managers manage their locations
*/
import { FieldConfig, GroupProps } from 'react-reactive-form';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
// import { find } from 'lodash';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { RowInfo, FinalState, SortingRule } from 'react-table';
import { Breadcrumb, BreadcrumbItem, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastr } from 'react-redux-toastr';

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
import {
  emptyTile,
  initialBuilding,
  initialFloor,
  initialLoc
} from '../../reducers/initialState';
import {
  getLocationsFacility,
  saveAnyLocation,
  updateAnyLocation,
  deleteAnyLocation,
  setTableFilter,
  toggleEditLocationModal,
  filterLocations
} from '../../actions/manageLocationActions';
import Banner from '../common/Banner';
import EditLocationModal from './EditLocationModal';
import SearchTableForm from '../common/SearchTableForm';
import { constants } from 'src/constants/constants';

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
  deleteAnyLocation: typeof deleteAnyLocation;
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
  // setSelectedFacility: typeof setSelectedFacility;
  filterLocations: typeof filterLocations;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  selectedItem: any;
  searchFieldConfig: FieldConfig;
}

class ManageLocation extends React.Component<Iprops & IdispatchProps, Istate> {
  // public searchFieldConfig: any;
  public searchFieldConfigBanner: any;
  public buttonInAction = false;
  public deleteAction = false;
  private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
      selectedItem: {},
      searchFieldConfig: this.buildSearchControls()
    };
  }
  componentWillMount() {
    // since the install modal depends on a selected product in state, we need to make sure and start off with the modals closed
    this.props.closeAllModals();
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();
    if (this.props.facility && !this.props.selectedBuilding.id.length) {
      // this.props.setSelectedFacility(this.props.facility);
    }
    // make sure there is a facilityID is set to the table search filters so that it can be used in the EditProductForm
    if (
      !this.props.tableFilters.facilityID ||
      this.props.tableFilters.facilityID !== this.props.facility.id
    ) {
      const facilityID = this.props.tableFilters.facilityID
        ? this.props.tableFilters.facilityID
        : this.props.facilityOptions[0].value;
      this.props.setTableFilter({
        facilityID,
        buildingID: undefined,
        locationID: undefined,
        floorID: undefined
      });
      this.props.getLocationsFacility(facilityID);
    } else if (this.props.tableFilters.facilityID) {
      this.props.filterLocations(this.props.tableFilters.facilityID);
    }
  }

  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      this.props.filterLocations(this.props.facility.id);
    }
    // automatically get facility every time the facilityID changes
    if (
      prevProps.tableFilters.facilityID !== this.props.tableFilters.facilityID
    ) {
      const facilityID = this.props.tableFilters.facilityID;
      if (facilityID) {
        this.props.getLocationsFacility(facilityID);
      }
      // this.setState({ searchFieldConfig: this.buildSearchControls() });
      // this.props.filterLocations(this.props.facility.id);
    }
    // when the component loads right after logging in there will not be any facilities, handle that here
    if (
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facilityID = this.props.facilityOptions[0].value;
      this.props.setTableFilter({
        facilityID,
        buildingID: undefined,
        locationID: undefined,
        floorID: undefined
      });
      this.setState({ searchFieldConfig: this.buildSearchControls() });
      // this.props.filterLocations(this.props.facility.id);
    }

    // update the table with new or edited locationObjets when the facility changes
    if (
      JSON.stringify(prevProps.facility) !== JSON.stringify(this.props.facility)
    ) {
      this.props.filterLocations(this.props.facility.id);
    }

    // if (prevProps.facility.id !== this.props.facility.id) {
    //   this.props.setSelectedFacility(this.props.facility);
    // }
  }

  componentWillUnmount() {
    this.props.closeAllModals();
  }

  handleEdit(selectedItem: any) {
    this.setState({ selectedItem });
    // console.log("EDIT:", item);
  }

  handleDelete(deletedItem: any) {
    const toastrConfirmOptions = {
      onOk: () => {
        deletedItem = {
          ...deletedItem,
          buildingID: this.props.selectedBuilding.id,
          floorID: this.props.selectedFloor.id,
          locationID: this.props.selectedLocation.id
        };
        this.props.deleteAnyLocation(deletedItem);
        console.log('deleted', deletedItem);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirm'), toastrConfirmOptions);
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
      search: '',
      page: 1
    });
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
          Header: '',
          Cell: row => (
            <div>
              <Button
                bsStyle="link"
                style={{ float: 'right', marginRight: 11 }}
                onClick={() => {
                  this.buttonInAction = true;
                  this.handleEdit(row.original);
                }}
              >
                <FontAwesomeIcon icon={['far', 'edit']} />
              </Button>
              <Button
                bsStyle="link"
                style={{ float: 'right', color: 'red' }}
                onClick={() => {
                  this.buttonInAction = true;
                  this.deleteAction = true;
                  this.handleDelete(row.original);
                }}
              >
                <FontAwesomeIcon icon={['far', 'times']} />
              </Button>
            </div>
          )
        }
      ],
      this.props.t
    );
    this.setState({ columns });
  };

  buildSearchControls = (): FieldConfig => {
    const selectedFacilityOption = this.props.facility.id.length
      ? { value: this.props.facility.id, label: this.props.facility.name }
      : this.props.facilityOptions[0];
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
    const facilityID = {
      render: FormUtil.SelectWithoutValidationLeftLabel,
      meta: {
        label: 'common:facility',
        options: this.props.facilityOptions,
        colWidth: 7,
        colWidthLG: 5,
        type: 'select',
        placeholder: 'facilityPlaceholder',
        className: 'banner-input',
        isClearable: false
      },
      formState: { value: selectedFacilityOption, disabled: false }
    } as GroupProps;

    let searchFieldConfig = {
      controls: { ...mainSearchControls }
    } as FieldConfig;
    if (this.props.facilityOptions.length > 1) {
      searchFieldConfig = {
        controls: { ...mainSearchControls, facilityID }
      } as FieldConfig;
    }
    return searchFieldConfig;
  };

  /*
  * Handle user clicking on a location row
  * set the selected location to state and open the modal
  */
  getTrProps = (state: FinalState, rowInfo: RowInfo) => {
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          const locationObject = rowInfo.original as
            | Ilocation
            | Ibuilding
            | Ifloor
            | Iroom;
          if (this.buttonInAction && this.deleteAction === false) {
            this.props.toggleEditLocationModal();
          } else if (this.deleteAction === false) {
            if ('facilityID' in locationObject) {
              // BUILDING
              this.props.setTableFilter({
                facilityID: this.props.facility.id,
                buildingID: locationObject.id,
                locationID: undefined,
                floorID: undefined
              });
            } else if ('buildingID' in locationObject) {
              // FLOOR
              this.props.setTableFilter({
                locationID: undefined,
                floorID: locationObject.id
              });
            } else if ('floorID' in locationObject) {
              // LOCATION
              this.props.setTableFilter({ locationID: locationObject.id });
            } else {
              // ROOM - we don't do anthything when they select a room...
            }
          }
          this.buttonInAction = false;
          this.deleteAction = false;
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
    if (this.props.selectedLocation.id.length) {
      return 'Room';
    } else if (this.props.selectedFloor.id.length) {
      return 'Location';
    } else if (this.props.selectedBuilding.id.length) {
      return 'Floor';
    } else {
      return 'Building';
    }
  };

  handleBCClick = (
    item: any,
    lType: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    switch (lType) {
      case 'Facility':
        this.props.setTableFilter({
          facilityID: this.props.facility.id,
          buildingID: undefined,
          locationID: undefined,
          floorID: undefined
        });
        break;
      case 'Building':
        this.props.setTableFilter({
          buildingID: item.id,
          locationID: undefined,
          floorID: undefined
        });
        break;
      case 'Floor':
        this.props.setTableFilter({ locationID: undefined, floorID: item.id });
        break;
      case 'Location':
        this.props.setTableFilter({ locationID: item.id });
        break;
      default:
        break;
    }
  };

  makeSandwhich = (label: string, handler?: any) => {
    if (typeof handler !== 'undefined') {
      return (
        <BreadcrumbItem active>
          <a href="#" onClick={handler}>
            {label}
          </a>
        </BreadcrumbItem>
      );
    } else {
      return <BreadcrumbItem active>{label}</BreadcrumbItem>;
    }
  };

  // get breadcrumb path
  getBreadcrumbs = () => {
    return (
      <Breadcrumb>
        {this.props.tableFilters.buildingID ? (
          <BreadcrumbItem active>
            <a
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                this.handleBCClick(initialBuilding, 'Facility', e)
              }
            >
              Buildings
            </a>
          </BreadcrumbItem>
        ) : (
          ''
        )}
        {/* building crumbs */}
        {this.getLocationType() === 'Floor' &&
        this.props.tableFilters.buildingID
          ? this.makeSandwhich(this.props.selectedBuilding.name)
          : this.props.tableFilters.buildingID
            ? this.makeSandwhich(
                this.props.selectedBuilding.name,
                (e: React.MouseEvent<HTMLAnchorElement>) =>
                  this.handleBCClick(this.props.selectedBuilding, 'Building', e)
              )
            : ''}
        {/* Floor crumbs */}
        {this.getLocationType() === 'Location' &&
        this.props.selectedFloor.id.length > 0
          ? this.makeSandwhich(this.props.selectedFloor.name)
          : this.props.selectedFloor.id
            ? this.makeSandwhich(
                this.props.selectedFloor.name,
                (e: React.MouseEvent<HTMLAnchorElement>) =>
                  this.handleBCClick(this.props.selectedFloor, 'Floor', e)
              )
            : ''}
        {/* Location crumbs */}
        {this.getLocationType() === 'Room' &&
        this.props.selectedLocation.id.length > 0
          ? this.makeSandwhich(this.props.selectedLocation.name)
          : this.props.selectedLocation.id
            ? this.makeSandwhich(
                this.props.selectedLocation.name,
                (e: React.MouseEvent<HTMLAnchorElement>) =>
                  this.handleBCClick(this.props.selectedLocation, 'Location', e)
              )
            : ''}
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
      case 'facilityID':
        this.props.setTableFilter({
          facilityID: value.value,
          buildingID: undefined,
          locationID: undefined,
          floorID: undefined,
          page: 1
        });
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
      <div className="manage-location">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.state.searchFieldConfig}
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
          // pageSize={this.props.tableData.length}
          // manual
          // pages={this.props.userManage.totalPages}
          // page={this.props.tableFilters.page - 1}
          // showPageSizeOptions={false}
          defaultPageSize={10}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          // onPageChange={this.onPageChange}
          // onSortedChange={this.onSortedChanged}
          sortable={true}
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
  // facility location object selectors
  // TODO these can be refactored to a id indexed and the facilitiesReducer can be improved by splitting it up into multiple reducers
  const facility = state.manageLocation.facility;
  const selectedBuilding =
    facility.buildings.find(
      building => building.id === state.manageLocation.tableFilters.buildingID
    ) || initialBuilding;
  const selectedFloor =
    selectedBuilding.floors.find(
      floor => floor.id === state.manageLocation.tableFilters.floorID
    ) || initialFloor;
  const selectedLocation =
    selectedFloor.locations.find(
      location => location.id === state.manageLocation.tableFilters.locationID
    ) || initialLoc;
  return {
    user: state.user,
    userManage: state.manageLocation,
    loading: state.ajaxCallsInProgress > 0,
    showEditLocationModal: state.manageLocation.showEditLocationModal,
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    tableData: state.manageLocation.visibleLocations,
    facility: state.manageLocation.facility,
    tableFilters: state.manageLocation.tableFilters,
    selectedBuilding,
    selectedFloor,
    selectedLocation
  };
};
export default translate('manageLocation')(
  connect(
    mapStateToProps,
    {
      getLocationsFacility,
      saveAnyLocation,
      updateAnyLocation,
      deleteAnyLocation,
      toggleEditLocationModal,
      closeAllModals,
      addToCart,
      setTableFilter,
      filterLocations
    }
  )(ManageLocation)
);
