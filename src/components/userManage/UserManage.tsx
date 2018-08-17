/*
* The New User Manage
*/
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getUserManage,
  updateUser,
  toggleEditUserModal
} from '../../actions/userManageActions';
import {
  IinitialState,
  Iuser,
  Itile,
  IuserManage,
  Icustomer
} from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import ReactTable from 'react-table';
// import { Button } from "react-bootstrap";
import Banner from '../common/Banner';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import constants from '../../constants/constants';
import * as moment from 'moment';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { find } from 'lodash';

import SearchTableForm from '../common/SearchTableForm';
import { TableUtil } from '../common/TableUtil';
import EditUserManageModal from './EditUserManageModal';
import EditCustomerModal from '../common/EditCustomerModal';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  showEditUserModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  loading: boolean;
  userManage: IuserManage;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  toggleEditUserModal: () => void;
  getUserManage: (value: number, search: string, customerID: string) => void;
  customers: Icustomer[];
}

interface Istate {
  selectedRow: any;
  currentTile: Itile;
}

class UserManage extends React.Component<Iprops & IdispatchProps, Istate> {
  public columns: any[];
  public buttonInAction = false;
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.getTrProps = this.getTrProps.bind(this);
    this.state = {
      selectedRow: null,
      currentTile: {
        icon: '',
        title: '',
        src: '',
        color: '',
        width: 359,
        height: 136,
        url: '',
        securityFunction: ''
      }
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
          id: 'company',
          Header: 'company',
          accessor: ({ customerID }: Iuser) => {
            // !TODO move this to a reducer?
            let cust;
            if (customerID) {
              cust = find(
                this.props.customers,
                c =>
                  c.id.trim().toLowerCase() === customerID.trim().toLowerCase()
              );
            }
            console.log(customerID, cust);
            return cust ? cust.name : '';
          }
        },
        {
          Header: 'created',
          accessor: ({ createDate }: Iuser) => {
            return moment.utc(createDate).format('MM/DD/YYYY hh:mm a');
          },
          id: 'created'
        }
      ],
      this.props.t
    );
  }
  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
    // refresh the userManage every time the component mounts
    this.props.getUserManage(1, '', '');
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      prevProps.showEditUserModal !== this.props.showEditUserModal &&
      !this.props.showEditUserModal
    ) {
      this.setState({ selectedRow: null });
    }
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
  onSearchSubmit = ({ search }: { search: string }) => {
    this.props.getUserManage(this.props.userManage.page, search, '');
  };

  render(): JSX.Element {
    // if (this.props.userManage.data.length === 0) {
    //   return <div>EFF</div>;
    // }
    const { t } = this.props;
    return (
      <div className="user-manage">
        <Banner
          title={t('bannerTitle')}
          img="http://placekitten.com/1440/60"
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <SearchTableForm
          handleSubmit={this.onSearchSubmit}
          loading={this.props.loading}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
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
        />
        <EditUserManageModal
          selectedUser={this.props.userManage.data[this.state.selectedRow]}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
        />
        <EditCustomerModal
          t={this.props.t}
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
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
    userManage: state.userManage,
    customers: state.customers,
    loading: state.ajaxCallsInProgress > 0,
    showEditUserModal: state.showEditUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal
  };
};
export default translate('userManage')(
  connect(
    mapStateToProps,
    {
      getUserManage,
      updateUser,
      toggleEditUserModal
    }
  )(UserManage)
);
