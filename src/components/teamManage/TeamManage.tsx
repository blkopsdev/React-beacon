/*
* hopsital Managers manage their team
* Note: did minimal renaming from the UserManage component
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getUserManage,
  toggleEditUserModal
} from '../../actions/teamManageActions';
import {
  IinitialState,
  Iuser,
  Itile,
  IteamManage,
  Icustomer
} from '../../models';
import { emptyTile } from '../../reducers/initialState';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import Banner from '../common/Banner';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import constants from '../../constants/constants';
import * as moment from 'moment';
import { translate, TranslationFunction, I18n } from 'react-i18next';
// import { find } from 'lodash';
import { FormUtil } from '../common/FormUtil';
import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';
import EditUserManageModal from './EditTeamManageModal';
import { closeAllModals } from '../../actions/commonActions';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditUserModal: boolean;
  loading: boolean;
  userManage: IteamManage;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditUserModal: () => void;
  toggleSecurityFunctionsModal: () => void;
  getUserManage: (value: number, search: string, customerID: string) => void;
  customers: Icustomer[];
  closeAllModals: typeof closeAllModals;
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class TeamManage extends React.Component<Iprops & IdispatchProps, Istate> {
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
          id: 'name',
          Header: 'name',
          // accessor: "user",
          Cell: (row: any) => (
            <span>
              {row.original.first} {row.original.last}
            </span>
          )
        },
        {
          Header: 'email',
          accessor: 'email'
        },
        {
          Header: 'manager',
          accessor: ({ hasTeamMembers }: Iuser) => {
            return hasTeamMembers ? 'Yes' : 'No';
          },
          id: 'manager'
        },
        {
          Header: 'login',
          accessor: ({ lastLoginDate }: Iuser) => {
            return lastLoginDate
              ? moment.utc(lastLoginDate).format('MM/DD/YYYY hh:mm a')
              : 'n/a';
          },
          id: 'login'
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
    this.props.getUserManage(1, '', '');
    // refresh the list of customers every time the component mounts
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      prevProps.showEditUserModal !== this.props.showEditUserModal &&
      !this.props.showEditUserModal
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
    this.props.getUserManage(page + 1, '', '');
  };
  onSearchSubmit = ({
    search,
    customerID
  }: {
    search: string;
    customerID: { value: string; title: string };
  }) => {
    const custID = customerID ? customerID.value : '';
    this.props.getUserManage(this.props.userManage.page, search, custID);
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
          resizable={false}
        />
        <EditUserManageModal
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
    userManage: state.teamManage,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditUserModal: state.showEditTeamModal
  };
};
export default translate('teamManage')(
  connect(
    mapStateToProps,
    {
      getUserManage,
      toggleEditUserModal,
      closeAllModals
    }
  )(TeamManage)
);
