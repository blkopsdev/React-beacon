/*
* The New User Manage
*/
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import ReactTable, { SortingRule } from 'react-table';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  ItableFiltersReducer,
  Itile,
  ImanageTrainingProgress,
  ImanageTrainingReducer
} from '../../models';
import { TableUtil } from '../common/TableUtil';
import { emptyTile } from '../../reducers/initialState';
import Banner from '../common/Banner';

import SearchTableForm from '../common/SearchTableForm';
import constants from '../../constants/constants';
import { FieldConfig } from 'react-reactive-form';
import {
  getManageTraining,
  setTableFilter
} from 'src/actions/manageTrainingActions';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  getManageTraining: typeof getManageTraining;
  manageTraining: ImanageTrainingReducer;
  setTableFilter: typeof setTableFilter;
  tableFilters: ItableFiltersReducer;
  tableData: ImanageTrainingProgress[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
  columns: any[];
}

class ManageTraining extends React.Component<Iprops & IdispatchProps, Istate> {
  public searchFieldConfig: FieldConfig;
  public buttonInAction = false;
  private setTableFilterTimeout: any;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
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
            colWidth: 4,
            type: 'text',
            placeholder: 'searchPlaceholder',
            defaultValue: this.props.tableFilters.search
          }
        }
      }
    };
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname),
      columns: this.setColumns()
    });
  }
  componentDidMount() {
    // refresh the ManageTraining every time the component mounts
    // this.props.getManageTraining();
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    // automatically get data every time a fitler changes
    if (prevProps.tableFilters !== this.props.tableFilters) {
      this.props.getManageTraining();
    }
  }

  /*
  * Set Columns sets columns to state
  * setting columns here in order to reset them if and after we receive customers
  */
  setColumns = () => {
    return TableUtil.translateHeaders(
      [
        {
          Header: 'userName',
          accessor: 'userName'
        },
        {
          Header: 'courseName',
          accessor: 'courseName'
        },
        {
          Header: 'progress',
          accessor: 'progress'
        },
        {
          Header: 'results',
          accessor: 'results'
        }
      ],
      this.props.t
    );
  };

  /*
  * (reusable)
  * get the next or previous page of data.  the table is 0 indexed but the API is not
  */
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
      case 'customer':
        this.props.setTableFilter({ customer: value, page: 1 });
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
  /*
  * (reusable)
  * set the sorted changes to redux
  */
  onSortedChanged = (
    newSorted: SortingRule[],
    column: any,
    shiftKey: boolean
  ) => {
    this.props.setTableFilter({ sorted: newSorted });
    this.setState({ selectedRow: {} });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="training-manage">
        <Banner
          title={t('bannerTitle')}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          fieldConfig={this.searchFieldConfig}
          handleSubmit={this.props.getManageTraining}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          subscribeValueChanges={true}
          onValueChanges={this.onSearchValueChanges}
        />
        <ReactTable
          data={this.props.tableData}
          onSortedChange={this.onSortedChanged}
          columns={this.state.columns}
          pageSize={this.props.tableData.length}
          page={this.props.tableFilters.page - 1}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pages={this.props.manageTraining.totalPages}
          showPageSizeOptions={false}
          className={`beacon-table -highlight ${this.state.currentTile.color}`}
          previousText={t('common:previous')}
          nextText={t('common:next')}
          onPageChange={this.onPageChange}
          sortable={false}
          noDataText={t('common:noDataText')}
          resizable={false}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    manageTraining: state.manageTraining,
    loading: state.ajaxCallsInProgress > 0,
    tableData: state.manageTraining.data,
    tableFilters: state.manageTraining.tableFilters
  };
};
export default translate('manageTraining')(
  connect(
    mapStateToProps,
    {
      getManageTraining,
      setTableFilter
    }
  )(ManageTraining)
);
