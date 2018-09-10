/*
* The Manage Team user modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateUser,
  saveTeamUser,
  toggleEditUserModal
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
  updateUser: typeof updateUser;
  saveTeamUser: typeof saveTeamUser;
  toggleEditUserModal: () => void;
  getFacilitiesByCustomer: () => Promise<void>;
  user: Iuser;
}

class EditManageTeamModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let submitFunc;
    let modalTitle;
    if (this.props.selectedUser) {
      submitFunc = this.props.updateUser;
      modalTitle = this.props.t('teamManage:editTeamModalTitle');
    } else {
      submitFunc = this.props.saveTeamUser;
      modalTitle = this.props.t('teamManage:saveTeamModalTitle');
    }
    return (
      <CommonModal
        modalVisible={this.props.showEditUserModal}
        className="user-edit"
        onHide={this.props.toggleEditUserModal}
        body={
          <UserManageForm
            handleSubmit={submitFunc}
            handleCancel={this.props.toggleEditUserModal}
            selectedUser={this.props.selectedUser}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            customerOptions={this.props.customerOptions}
            facilityOptions={this.props.facilityOptions}
            getFacilitiesByCustomer={this.props.getFacilitiesByCustomer}
            user={this.props.user}
          />
        }
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
    updateUser,
    saveTeamUser,
    toggleEditUserModal,
    getFacilitiesByCustomer
  }
)(EditManageTeamModal);
