/*
* The Manage Team user modal - Container
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateTeamUser,
  saveTeamUser,
  toggleEditTeamUserModal
} from '../../actions/teamManageActions';
import { IinitialState, Iuser } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserManageForm from './TeamManageForm';
import { TranslationFunction } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';
import { getFacilitiesByCustomer } from '../../actions/userQueueActions';

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
}

class EditManageTeamModal extends React.Component<Iprops & IdispatchProps, {}> {
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
    userManage: state.teamManage,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    showEditUserModal: state.showEditTeamModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateTeamUser,
    saveTeamUser,
    toggleEditTeamUserModal,
    getFacilitiesByCustomer
  }
)(EditManageTeamModal);
