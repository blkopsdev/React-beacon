import Banner from '../common/Banner';
import * as React from 'react';
import { I18n, translate } from 'react-i18next';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router';
import { TranslationFunction } from 'i18next';
import { constants } from '../../constants/constants';
import { connect } from 'react-redux';
import {
  Ibuilding,
  Ifloor,
  IinitialState,
  Ilocation,
  Iroom,
  Itile
} from '../../models';
import {getBrands, toggleEditBrandModal} from '../../actions/manageBrandActions';
import { TableUtil } from '../common/TableUtil';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastr } from 'react-redux-toastr';
import ReactTable, { FinalState, RowInfo } from 'react-table';
import EditBrandModal from './EditBrandModal';
// import manageBrandReducer from "../../reducers/manageBrandReducer";
// import {FieldConfig} from "react-reactive-form";

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditBrandModal: boolean;
  loading: boolean;
}

interface IdispatchProps {
  brandList: any;
  totalPages: number;
  showEditBrandModal: boolean;
  getBrands: any;
  toggleEditBrandModal: typeof toggleEditBrandModal;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  selectedItem: any;
  searchFieldConfig: any;
}

class ManageBrand extends React.Component<Iprops & IdispatchProps, Istate> {
  public searchFieldConfigBanner: any;
  public buttonInAction = false;
  public deleteAction = false;
  // private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
      selectedItem: {},
      searchFieldConfig: {}
    };
  }
  componentWillMount(): void {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    this.setColumns();
  }

  componentDidMount(): void {
    this.props.getBrands();
  }

  handleEdit(selectedItem: any) {
    this.setState({ selectedItem });
    this.props.toggleEditBrandModal()
    console.log("EDIT:", selectedItem);
  }

  handleDelete(deletedItem: any) {
    const toastrConfirmOptions = {
      onOk: () => {
        // deletedItem = {
        //     ...deletedItem,
        //     buildingID: this.props.selectedBuilding.id,
        //     floorID: this.props.selectedFloor.id,
        //     locationID: this.props.selectedLocation.id
        // };
        // this.props.deleteAnyLocation(deletedItem);
        console.log('deleted', deletedItem);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirm'), toastrConfirmOptions);
  }

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
            // this.props.toggleEditBrandModal();
          } else if (this.deleteAction === false) {
            if ('facilityID' in locationObject) {
              // BUILDING
              // this.props.setTableFilter({
              //   facilityID: this.props.facility.id,
              //   buildingID: locationObject.id,
              //   locationID: undefined,
              //   floorID: undefined
              // });
            } else if ('buildingID' in locationObject) {
              // FLOOR
              // this.props.setTableFilter({
              //   locationID: undefined,
              //   floorID: locationObject.id
              // });
            } else if ('floorID' in locationObject) {
              // LOCATION
              // this.props.setTableFilter({ locationID: locationObject.id });
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

  render() {
    const { t, brandList } = this.props;

    return (
      <div className="manage-brand">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />

        <ReactTable
          data={brandList}
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

        <EditBrandModal
          selectedItem={this.state.selectedItem}
          selectedType={'Brand'}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        {/*{brandList &&*/}
        {/*  brandList.result.map((brand: any) => (*/}
        {/*    <h3 key={brand.id}>{brand.name}</h3>*/}
        {/*  ))}*/}
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState) => {
  return {
    brandList: state.manageBrand.brandList,
    totalPages: state.manageBrand.totalPages,
    showEditBrandModal: state.manageBrand.showEditBrandModal
  };
};

export default translate('manageBrand')(
  connect(
    mapStateToProps,
    { getBrands, toggleEditBrandModal }
  )(ManageBrand)
);
