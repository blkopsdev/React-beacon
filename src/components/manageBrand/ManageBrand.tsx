import Banner from '../common/Banner';
import * as React from 'react';
import { FieldConfig } from 'react-reactive-form';
import { I18n, translate } from 'react-i18next';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router';
import { TranslationFunction } from 'i18next';
import { constants } from '../../constants/constants';
import { connect } from 'react-redux';
import { IinitialState, ItableFiltersReducer, Itile } from '../../models';
import {
  deleteBrand,
  getBrands,
  setTableFilter,
  toggleEditBrandModal
} from '../../actions/manageBrandActions';
import { TableUtil } from '../common/TableUtil';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { Button } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import ReactTable, { FinalState, RowInfo } from 'react-table';
import EditBrandModal from './EditBrandModal';
// import './ManageBrand.less';
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
  deleteBrand: typeof deleteBrand;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  selectedItem: any;
  searchFieldConfig: FieldConfig;
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
      searchFieldConfig: this.buildSearchControls()
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

  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditBrandModal !== this.props.showEditBrandModal &&
      !this.props.showEditBrandModal
    ) {
      this.setState({ selectedRow: null });
    }
    // automatically get inventory every time a fitler changes
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      console.log(
        'user manage filters changed',
        prevProps.tableFilters,
        this.props.tableFilters
      );
      this.props.getBrands();
    }
  }

  buildSearchControls = (): FieldConfig => {
    const mainSearchControls = {
      name: {
        render: FormUtil.TextInputWithoutValidation,
        meta: {
          label: 'common:Brand',
          colWidth: 3,
          type: 'text',
          placeholder: 'Search by text',
          defaultValue: this.props.tableFilters.brand,
          isClearable: true
        }
      }
    };

    const searchFieldConfig = {
      controls: { ...mainSearchControls }
    } as FieldConfig;
    return searchFieldConfig;
  };

  onSearchValueChanges = (value: any, key: string) => {
    switch (key) {
      case 'name':
        this.props.setTableFilter({ name: value, page: 1 });
        break;
      default:
        break;
    }
  };

  handleEdit(selectedItem: any) {
    this.setState({ selectedItem });
    this.props.toggleEditBrandModal();
    console.log('EDIT:', selectedItem);
  }

  handleDelete(deletedItem: any) {
    const toastrConfirmOptions = {
      onOk: () => {
        deletedItem = {
          ...deletedItem
        };
        this.props.deleteBrand(deletedItem);
        console.log('deleted', deletedItem);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirm'), toastrConfirmOptions);
  }

  onPageChange = (page: number) => {
    const newPage = page + 1;
    this.props.setTableFilter({ page: newPage });
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
          this.buttonInAction = false;
          this.deleteAction = false;
          this.handleEdit(rowInfo.original);
        }
        // style: {
        //   background: this.state.selectedRow[rowInfo.viewIndex]
        //     ? constants.colors[`${this.state.currentTile.color}Tr`]
        //     : ''
        // }
      };
    } else {
      return {};
    }
  };

  render() {
    const { t, brandList = [], totalPages } = this.props;
    console.log('brandList', brandList);
    return (
      <div className="manage-brand">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.state.searchFieldConfig}
          handleSubmit={this.props.getBrands}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
          t={this.props.t}
          showSearchButton={false}
        />
        <div>
          <Button
            className="table-add-button"
            bsStyle="link"
            onClick={() => {
              this.setState({ selectedItem: {} }, () => {
                this.props.toggleEditBrandModal();
              });
            }}
          >
            {t(`manageBrand:newBrand`)}
          </Button>
        </div>
        <ReactTable
          data={brandList}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={brandList.length}
          manual
          pages={totalPages}
          page={this.props.tableFilters.page - 1}
          showPageSizeOptions={false}
          defaultPageSize={10}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
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
    showEditBrandModal: state.manageBrand.showEditBrandModal,
    tableFilters: state.manageBrand.tableFilters
  };
};

export default translate('manageBrand')(
  connect(
    mapStateToProps,
    { getBrands, toggleEditBrandModal, deleteBrand, setTableFilter }
  )(ManageBrand)
);