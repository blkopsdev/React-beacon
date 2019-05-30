import Banner from '../common/Banner';
import * as React from 'react';
import { FieldConfig } from 'react-reactive-form';
import { I18n, translate } from 'react-i18next';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router';
import { TranslationFunction } from 'i18next';
import { constants } from '../../constants/constants';
import { connect } from 'react-redux';
import {
  IinitialState,
  ItableFiltersReducer,
  Itile,
  IBrand,
  Ibrand
} from '../../models';
import {
  clearSelectedBrandID,
  deleteBrand,
  getBrands,
  setSelectedBrandID,
  setTableFilter,
  toggleEditBrandModal
} from '../../actions/manageBrandActions';
import { TableUtil } from '../common/TableUtil';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { Button } from 'react-bootstrap';
import ReactTable, { FinalState, RowInfo } from 'react-table';
import EditBrandModal from './EditBrandModal';
import * as moment from 'moment';
import { orderBy } from 'lodash';

interface RowInfoBrand extends RowInfo {
  original: IBrand;
}

interface Iprops extends RouteComponentProps<any> {
  t: TranslationFunction;
  i18n: I18n;
}

interface IdispatchProps {
  tableData: Ibrand[];
  totalPages: number;
  showEditBrandModal: boolean;
  getBrands: any;
  toggleEditBrandModal: typeof toggleEditBrandModal;
  deleteBrand: typeof deleteBrand;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  loading: boolean;
  setSelectedBrandID: typeof setSelectedBrandID;
  clearSelectedBrandID: typeof clearSelectedBrandID;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  searchFieldConfig: FieldConfig;
}

class ManageBrand extends React.Component<Iprops & IdispatchProps, Istate> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      selectedRow: {},
      currentTile: emptyTile,
      columns: [],
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

  handleEdit(row: any) {
    this.setState({ selectedRow: row.index });
    this.props.toggleEditBrandModal();
    this.props.setSelectedBrandID(row.original.id);
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
  getTrProps = (state: FinalState, rowInfo: RowInfoBrand) => {
    if (rowInfo) {
      return {
        onClick: (e: React.MouseEvent<HTMLFormElement>) => {
          this.handleEdit(rowInfo);
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

  render() {
    const { t, tableData = [], totalPages } = this.props;
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
              this.setState({ selectedRow: null }, () => {
                this.props.toggleEditBrandModal();
              });
            }}
          >
            {t(`manageBrand:newBrand`)}
          </Button>
        </div>
        <ReactTable
          data={tableData}
          columns={this.state.columns}
          getTrProps={this.getTrProps}
          pageSize={tableData.length}
          manual
          pages={totalPages}
          page={this.props.tableFilters.page - 1}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          multiSort={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />

        <EditBrandModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState) => {
  const tableData = orderBy(
    state.manageBrand.data,
    res => moment.utc(res.createDate).unix(),
    'desc'
  );
  return {
    tableData,
    totalPages: state.manageBrand.totalPages,
    showEditBrandModal: state.manageBrand.showEditBrandModal,
    tableFilters: state.manageBrand.tableFilters
  };
};

export default translate('manageBrand')(
  connect(
    mapStateToProps,
    {
      getBrands,
      toggleEditBrandModal,
      deleteBrand,
      setTableFilter,
      setSelectedBrandID,
      clearSelectedBrandID
    }
  )(ManageBrand)
);
