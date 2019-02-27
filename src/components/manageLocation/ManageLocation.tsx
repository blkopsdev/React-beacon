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
import { emptyTile, initialBuilding } from '../../reducers/initialState';
import {
  getLocationsFacility,
  saveAnyLocation,
  updateAnyLocation,
  deleteAnyLocation,
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
  deletedItem: any;
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
      data: [],
      selectedItem: {},
      deletedItem: {},
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
  }
  componentDidMount() {
    // make sure there is a facility set to the table search filters so that it can be used in the EditProductForm
    if (!this.props.tableFilters.facility) {
      const facility = this.props.tableFilters.facility
        ? this.props.tableFilters.facility
        : this.props.facilityOptions[0];
      this.props.setTableFilter({ facility });
      this.props.getLocationsFacility(facility.value);
    } else {
      this.props.getLocationsFacility(this.props.tableFilters.facility.value);
    }
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    // automatically get facility every time a filter changes
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      const fac =
        this.props.tableFilters.facility &&
        this.props.tableFilters.facility.value;
      this.props.getLocationsFacility(
        fac || this.props.facilityOptions[0].value
      );
      this.setState({ searchFieldConfig: this.buildSearchControls() });
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
        this.props.deleteAnyLocation(deletedItem, this.getLocationType());
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
                <FontAwesomeIcon icon={['far', 'edit']}> Edit </FontAwesomeIcon>
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
                <FontAwesomeIcon icon={['far', 'times']}>
                  {' '}
                  Delete{' '}
                </FontAwesomeIcon>
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
  * Handle user clicking on a location row
  * set the selected location to state and open the modal
  */
  getTrProps = (state: FinalState, rowInfo: RowInfo) => {
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          if (this.buttonInAction && this.deleteAction === false) {
            this.props.toggleEditLocationModal();
          } else if (this.deleteAction === false) {
            if (this.getLocationType() === 'Building') {
              this.props.setSelectedBuilding(rowInfo.original);
            } else if (this.getLocationType() === 'Floor') {
              this.props.setSelectedFloor(
                rowInfo.original,
                this.props.facility.id
              );
            } else if (this.getLocationType() === 'Location') {
              this.props.setSelectedLocation(
                rowInfo.original,
                this.props.facility.id
              );
            } else {
              this.props.setSelectedRoom(rowInfo.original);
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

  handleBCClick = (
    item: any,
    lType: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (lType === 'Building') {
      this.props.setSelectedBuilding(item);
    } else if (lType === 'Floor') {
      this.props.setSelectedFloor(item, this.props.facility.id);
    } else if (lType === 'Location') {
      this.props.setSelectedLocation(item, this.props.facility.id);
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
        {this.props.selectedBuilding.id ? (
          <BreadcrumbItem active>
            <a
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                this.handleBCClick(initialBuilding, 'Building', e)
              }
            >
              Buildings
            </a>
          </BreadcrumbItem>
        ) : (
          ''
        )}
        {/* building crumbs */}
        {this.getLocationType() === 'Floor' && this.props.selectedBuilding.id
          ? this.makeSandwhich(this.props.selectedBuilding.name)
          : this.props.selectedBuilding.id
            ? this.makeSandwhich(
                this.props.selectedBuilding.name,
                (e: React.MouseEvent<HTMLAnchorElement>) =>
                  this.handleBCClick(this.props.selectedBuilding, 'Building', e)
              )
            : ''}
        {/* Floor crumbs */}
        {this.getLocationType() === 'Location' && this.props.selectedFloor.id
          ? this.makeSandwhich(this.props.selectedFloor.name)
          : this.props.selectedFloor.id
            ? this.makeSandwhich(
                this.props.selectedFloor.name,
                (e: React.MouseEvent<HTMLAnchorElement>) =>
                  this.handleBCClick(this.props.selectedFloor, 'Floor', e)
              )
            : ''}
        {/* Location crumbs */}
        {this.getLocationType() === 'Room' && this.props.selectedLocation.id
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
      <div className="manage-location">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
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
      deleteAnyLocation,
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
