/*
* The Save a new Team Member modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  saveTeamUser,
  toggleSaveUserModal
} from '../../actions/teamManageActions';
import { IinitialState } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserManageForm from './TeamManageForm';
import { TranslationFunction } from 'react-i18next';
// import { FormUtil } from '../common/FormUtil';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditUserModal: boolean;
  loading: boolean;
  saveTeamUser: typeof saveTeamUser;
  toggleSaveUserModal: () => void;
}

class SaveManageTeamModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditUserModal}
        className="user-edit"
        onHide={this.props.toggleSaveUserModal}
        body={
          <UserManageForm
            handleSubmit={this.props.saveTeamUser}
            handleCancel={this.props.toggleSaveUserModal}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
          />
        }
        title={this.props.t('teamManage:saveTeamModalTitle')}
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
    showEditUserModal: state.showSaveTeamModal
  };
};

export default connect(
  mapStateToProps,
  {
    saveTeamUser,
    toggleSaveUserModal
  }
)(SaveManageTeamModal);
