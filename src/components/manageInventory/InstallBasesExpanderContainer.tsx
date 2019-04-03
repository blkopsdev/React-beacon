/*
* Installs Expander Container connects the InstallBasesExpander to redux
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { IinitialState, IinstallBase } from 'src/models';
import { InstallBasesExpander } from './InstallBasesExpander';
import { RowInfo } from 'react-table';
import { addToCart } from 'src/actions/shoppingCartActions';
import { selectResult } from 'src/actions/measurementPointResultsActions';
import { toggleMPResultModal } from 'src/actions/manageInventoryActions';

interface Iprops extends RowInfo {
  t: TranslationFunction;
  addInstallation: (row: any) => void;
  showAddInstallation: boolean;
  showRequestQuote: boolean;
  handleInstallBaseSelect: (i: IinstallBase) => void;
  contactAboutInstall: (i: IinstallBase) => void;
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    facility: state.manageLocation.facility,
    loading: state.ajaxCallsInProgress > 0
  };
};

export const InstallBasesExpanderContainer = connect(
  mapStateToProps,
  {
    addToCart,
    selectResult,
    toggleMPResultModal
  }
)(InstallBasesExpander);
