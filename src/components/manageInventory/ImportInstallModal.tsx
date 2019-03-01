/*
* Import Instal Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { IinitialState } from '../../models';
import {
  importInstall,
  toggleImportInstallModal
} from '../../actions/manageInventoryActions';
import CommonModal from '../common/CommonModal';
import ImportInstallForm from './ImportInstallForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  importInstall: typeof importInstall;
  toggleImportInstallModal: typeof toggleImportInstallModal;
}

class ImportInstallModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleImportInstallModal}
        body={<ImportInstallForm {...this.props} />}
        title={this.props.t('importInstallModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showImportInstall
  };
};

export default connect(
  mapStateToProps,
  {
    importInstall,
    toggleImportInstallModal
  }
)(ImportInstallModal);
