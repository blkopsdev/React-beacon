/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, Iuser, Ioption } from '../../models';
import { getFacilitiesByCustomer } from '../../actions/commonActions';
import {
  toggleEditProfileModal,
  updateUserProfile,
  deleteUserAccount
} from '../../actions/userActions';
import CommonModal from '../common/CommonModal';
import UserProfileForm from './UserProfileForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  customers: any[];
  facilityOptions: Ioption[];
  updateUserProfile: typeof updateUserProfile;
  toggleModal: () => void;
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  user: Iuser;
  deleteUserAccount: typeof deleteUserAccount;
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
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleModal}
        body={<UserProfileForm {...this.props} />}
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
    showModal: state.showEditProfileModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleEditProfileModal,
    getFacilitiesByCustomer,
    updateUserProfile,
    deleteUserAccount
  }
)(EditManageUserModal);
