/*
* The Manage Team user modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateUser,
  toggleEditUserModal
} from '../../actions/teamManageActions';
import { IinitialState, Iuser } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserManageForm from './TeamManageForm';
import { TranslationFunction } from 'react-i18next';
// import { FormUtil } from '../common/FormUtil';

interface Iprops {
  selectedUser: Iuser;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditUserModal: boolean;
  loading: boolean;
  updateUser: typeof updateUser;
  toggleEditUserModal: () => void;
}

class EditManageTeamModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditUserModal}
        className="user-edit"
        onHide={this.props.toggleEditUserModal}
        body={
          <UserManageForm
            handleSubmit={this.props.updateUser}
            handleCancel={this.props.toggleEditUserModal}
            selectedUser={this.props.selectedUser}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
          />
        }
        title={this.props.t('teamManage:editTeamModalTitle')}
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
    showEditUserModal: state.showEditTeamModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateUser,
    toggleEditUserModal
  }
)(EditManageTeamModal);
