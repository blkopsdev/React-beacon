/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, Iuser } from '../../models';
import { getFacilitiesByCustomer } from '../../actions/userQueueActions';
import {
  toggleEditProfileModal,
  updateUserProfile
} from '../../actions/userActions';
import CommonModal from '../common/CommonModal';
import UserProfileForm from './UserProfileForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditProfileModal: boolean;
  loading: boolean;
  customers: any[];
  facilityOptions: any[];
  updateUserProfile: typeof updateUserProfile;
  toggleEditProfileModal: () => void;
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  user: Iuser;
}

class EditManageUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }
  // componentWillMount() {

  // }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditProfileModal}
        className="user-edit"
        onHide={this.props.toggleEditProfileModal}
        body={
          <UserProfileForm
            handleSubmit={this.props.updateUserProfile}
            handleCancel={this.props.toggleEditProfileModal}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            customers={this.props.customers}
            facilities={this.props.facilityOptions}
            facilityOptions={this.props.facilityOptions}
            user={this.props.user}
            getFacilitiesByCustomer={this.props.getFacilitiesByCustomer}
          />
        }
        title={this.props.t('user:editProfileModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    customers: state.customers,
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    showEditProfileModal: state.showEditProfileModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditProfileModal,
    getFacilitiesByCustomer,
    updateUserProfile
  }
)(EditManageUserModal);
