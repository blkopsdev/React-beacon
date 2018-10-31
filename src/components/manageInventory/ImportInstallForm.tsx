/* 
* Import Installs
*/

import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import {
  importInstall,
  toggleImportInstallModal
} from '../../actions/manageInventoryActions';

interface Iprops {
  toggleImportInstallModal: typeof toggleImportInstallModal;
  importInstall: typeof importInstall;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
}
interface Istate {
  file?: File;
}

class ManageInstallForm extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      file: undefined
    };
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.props.importInstall(this.state.file);
  };
  addFile = (fileInput: HTMLInputElement) => {
    // console.log('updated file', fileInput.files);
    if (fileInput.files) {
      // this.file = fileInput.files[0];
      this.setState({ file: fileInput.files[0] });
    }
  };

  render() {
    const { t } = this.props;
    const selectedFile = this.state.file;

    const formClassName = `user-form manage-form ${this.props.colorButton}`;

    return (
      <div>
        <div className={formClassName}>
          <Col xs={12}>
            <form method="get" action={require('../../images/importest.csv')}>
              <p>{t('uploadInstructions')}</p>
              <Button
                bsStyle="link"
                type="submit"
                style={{ marginBottom: '20px' }}
                className="left-side"
              >
                {t('exampleButton')}
              </Button>
            </form>
          </Col>
          <form onSubmit={this.handleSubmit} className="user-form">
            <Col xs={12}>
              <FormGroup>
                <ControlLabel
                  htmlFor="fileUpload"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="btn btn-default">
                    {t('importInstallLabel')}
                  </span>
                  <FormControl
                    id="fileUpload"
                    type="file"
                    accept=".csv"
                    onChange={e => {
                      const input = e.target as HTMLInputElement;
                      this.addFile(input);
                    }}
                    style={{ display: 'none' }}
                  />
                </ControlLabel>
              </FormGroup>
              {selectedFile && <span>{selectedFile.name}</span>}
            </Col>

            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="link"
                type="button"
                className="pull-left left-side"
                onClick={this.props.toggleImportInstallModal}
              >
                {t('common:cancel')}
              </Button>

              <Button
                bsStyle={this.props.colorButton}
                type="submit"
                disabled={this.props.loading}
              >
                {t('import')}
              </Button>
            </Col>
          </form>
        </div>
      </div>
    );
  }
}
export default translate('manageInventory')(ManageInstallForm);
