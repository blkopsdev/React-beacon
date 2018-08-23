/*
* The New User Manage
*/
import * as React from 'react';
import { connect } from 'react-redux';
import { updateUserProfile } from '../../actions/userManageActions';
import {
  IinitialState,
  // Iuser,
  Itile,
  Icustomer
} from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import Banner from '../common/Banner';
import constants from '../../constants/constants';
import { translate, TranslationFunction, I18n } from 'react-i18next';

interface Iprops extends RouteComponentProps<any> {
  // Add your regular properties here
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  updateUserProfile: () => void;
  customers: Icustomer[];
}

interface Istate {
  currentTile: Itile;
}

class UserManage extends React.Component<Iprops & IdispatchProps, Istate> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
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
  }

  componentWillMount() {
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
  }
  // componentDidUpdate(prevProps: Iprops) {

  // }

  render() {
    // if (this.props.userManage.data.length === 0) {
    //   return <div>EFF</div>;
    // }
    const { t } = this.props;
    return (
      <div className="user-profile">
        <Banner
          title={t('bannerTitle')}
          img="http://placekitten.com/1440/60"
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        profile form here
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
    customers: state.customers,
    facilities: state.facilities,
    loading: state.ajaxCallsInProgress > 0
  };
};
export default translate('userManage')(
  connect(
    mapStateToProps,
    {
      updateUserProfile
    }
  )(UserManage)
);
