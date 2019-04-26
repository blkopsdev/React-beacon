import Banner from '../common/Banner';
import * as React from 'react';
import { I18n, translate } from 'react-i18next';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router';
import { TranslationFunction } from 'i18next';
import { constants } from '../../constants/constants';
import { connect } from 'react-redux';
import { IinitialState, Itile } from '../../models';
import { getBrands } from '../../actions/manageBrandActions';
import { TableUtil } from '../common/TableUtil';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastr } from 'react-redux-toastr';
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
    // console.log("EDIT:", item);
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

  render() {
    const { t, brandList } = this.props;

    return (
      <div className="manage-brand">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        {brandList &&
          brandList.result.map((brand: any) => (
            <h3 key={brand.id}>{brand.name}</h3>
          ))}
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState) => {
  return {
    brandList: state.manageBrand.brandList,
    totalPages: state.manageBrand.brandList,
    showEditBrandModal: state.manageBrand.brandList
  };
};

// @ts-ignore
export default translate('manageBrand')(
  connect(
    mapStateToProps,
    { getBrands }
  )(ManageBrand)
);
