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
  IAlert
} from '../../models';
import {
  clearSelectedAlertID,
  deleteAlert,
  getAlerts,
  setSelectedAlertID,
  setTableFilter,
  toggleEditAlertModal
} from '../../actions/manageAlertActions';
import { TableUtil } from '../common/TableUtil';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { Button } from 'react-bootstrap';
import ReactTable, { FinalState, RowInfo } from 'react-table';
import * as moment from 'moment';
import { orderBy } from 'lodash';
import EditAlertModal from './EditAlertModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastr } from 'react-redux-toastr';

interface RowInfoAlert extends RowInfo {
  original: IAlert;
}

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  // loading: boolean;
}

interface IdispatchProps {
  tableData: IAlert[];
  totalPages: number;
  showEditAlertModal: boolean;
  getAlerts: any;
  toggleEditAlertModal: typeof toggleEditAlertModal;
  deleteAlert: typeof deleteAlert;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  loading: boolean;
  setSelectedAlertID: typeof setSelectedAlertID;
  clearSelectedAlertID: typeof clearSelectedAlertID;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
  searchFieldConfig: FieldConfig;
}

class ManageAlert extends React.Component<Iprops & IdispatchProps, Istate> {
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
    this.props.getAlerts();
  }

  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (
      prevProps.showEditAlertModal !== this.props.showEditAlertModal &&
      !this.props.showEditAlertModal
    ) {
      this.setState({ selectedRow: null });
    }
    // automatically get inventory every time a fitler changes
    if (
      JSON.stringify(prevProps.tableFilters) !==
      JSON.stringify(this.props.tableFilters)
    ) {
      this.props.getAlerts();
    }
  }

  buildSearchControls = (): FieldConfig => {
    const mainSearchControls = {
      name: {
        render: FormUtil.TextInputWithoutValidation,
        meta: {
          label: 'common:Alert',
          colWidth: 3,
          type: 'text',
          placeholder: 'Search by title',
          defaultValue: this.props.tableFilters.title,
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
        this.props.setTableFilter({ title: value, page: 1 });
        break;
      default:
        break;
    }
  };

  handleEdit(row: any) {
    this.setState({ selectedRow: row.index });
    this.props.toggleEditAlertModal();
    this.props.setSelectedAlertID(row.original.id);
  }

  handleDelete(deletedItem: any) {
    const toastrConfirmOptions = {
      onOk: () => {
        deletedItem = {
          ...deletedItem
        };
        this.props.deleteAlert(deletedItem);
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
          Header: 'title',
          accessor: 'title',
          minWidth: 300
        },
        {
          Header: 'type',
          accessor: 'type',
          minWidth: 300
        },
        {
          Header: '',
          Cell: row => (
            <div>
              <Button
                bsStyle="link"
                style={{ float: 'right', color: 'red' }}
                onClick={e => {
                  e.stopPropagation();
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
  getTrProps = (state: FinalState, rowInfo: RowInfoAlert) => {
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
      <div className="manage-alert">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={this.state.currentTile.color}
        />
        <SearchTableForm
          fieldConfig={this.state.searchFieldConfig}
          handleSubmit={this.props.getAlerts}
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
                this.props.toggleEditAlertModal();
              });
            }}
          >
            {t(`manageAlert:newAlert`)}
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
          // onSortedChange={this.onSortedChanged}
          sortable={false}
          multiSort={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />

        <EditAlertModal
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
    state.manageAlert.data,
    res => moment.utc(res.createDate).unix(),
    'desc'
  );
  return {
    tableData,
    totalPages: state.manageAlert.totalPages,
    showEditAlertModal: state.manageAlert.showEditAlertModal,
    tableFilters: state.manageAlert.tableFilters
  };
};

export default translate('manageAlert')(
  connect(
    mapStateToProps,
    {
      getAlerts,
      toggleEditAlertModal,
      deleteAlert,
      setTableFilter,
      setSelectedAlertID,
      clearSelectedAlertID
    }
  )(ManageAlert)
);
