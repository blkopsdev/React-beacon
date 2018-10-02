/*
* The Manage Team user modal - Container
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, Iuser } from '../../models';
import {
  deleteTeamUser,
  saveTeamUser,
  toggleEditTeamUserModal,
  updateTeamUser
} from '../../actions/manageTeamActions';
import { getFacilitiesByCustomer } from '../../actions/commonActions';
import CommonModal from '../common/CommonModal';
import UserManageForm from './EditTeamMemberForm';

interface Iprops {
  selectedUser: Iuser;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditUserModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateTeamUser: typeof updateTeamUser;
  saveTeamUser: typeof saveTeamUser;
  toggleEditTeamUserModal: typeof toggleEditTeamUserModal;
  getFacilitiesByCustomer: typeof getFacilitiesByCustomer;
  user: Iuser;
  deleteTeamUser: typeof deleteTeamUser;
}

class EditTeamMemberModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let modalTitle;
    if (this.props.selectedUser) {
      modalTitle = this.props.t('teamManage:editTeamModalTitle');
    } else {
      modalTitle = this.props.t('teamManage:saveTeamModalTitle');
    }
    return (
      <CommonModal
        modalVisible={this.props.showEditUserModal}
        className="user-edit"
        onHide={this.props.toggleEditTeamUserModal}
        body={<UserManageForm {...this.props} />}
        title={modalTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    userManage: state.manageTeam,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    showEditUserModal: state.manageTeam.showEditTeamModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateTeamUser,
    saveTeamUser,
    toggleEditTeamUserModal,
    getFacilitiesByCustomer,
    deleteTeamUser
  }
)(EditTeamMemberModal);
