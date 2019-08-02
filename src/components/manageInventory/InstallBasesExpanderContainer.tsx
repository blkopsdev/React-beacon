/*
* Installs Expander Container connects the InstallBasesExpander to redux
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { IinitialState, IinstallBase } from '../../models';
import { InstallBasesExpander } from './InstallBasesExpander';
import { RowInfo } from 'react-table';
import { addToCart } from '../../actions/shoppingCartActions';
import { selectResult } from '../../actions/measurementPointResultsActions';
import {
  toggleMPResultModal,
  toggleMPResultHistory
} from '../../actions/manageInventoryActions';
import { initialFacility } from '../../reducers/initialState';

interface Iprops extends RowInfo {
  t: TranslationFunction;
  addInstallation: (row: any) => void;
  showAddInstallation: boolean;
  showRequestQuote: boolean;
  handleInstallBaseSelect: (i: IinstallBase) => void;
  contactAboutInstall: (i: IinstallBase) => void;
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const facilityID = state.manageInventory.tableFilters.facility
    ? state.manageInventory.tableFilters.facility.value
    : state.user.facilities[0].id;

  const facility = state.facilities[facilityID] || initialFacility;
  return {
    facility,
    loading: state.ajaxCallsInProgress > 0
  };
};

export const InstallBasesExpanderContainer = connect(
  mapStateToProps,
  {
    addToCart,
    selectResult,
    toggleMPResultModal,
    toggleMPResultHistory
  }
)(InstallBasesExpander);
