/* 
* InstallContactForm
* Contact beacon about a specific install 
* 
*/

import { Button, Col, ControlLabel, FormGroup } from 'react-bootstrap';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Validators
} from 'react-reactive-form';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinstallBase } from '../../models';
import {
  installContact,
  toggleInstallContactModal
} from '../../actions/manageInventoryActions';
import constants from '../../constants/constants';

const TextLabel = ({ handler, meta }: any) => {
  return (
    <Col xs={meta.colWidth}>
      <FormGroup bsSize="sm">
        <ControlLabel>{meta.label}</ControlLabel>
        <h5 className="queue-form-label">{meta.defaultValue}</h5>
      </FormGroup>
    </Col>
  );
};

interface Iprops {
  toggleInstallContactModal: typeof toggleInstallContactModal;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  installContact: typeof installContact;
  selectedInstall: IinstallBase;
  productName: string;
}

class InstallContactform extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      this.buildFieldConfig(),
      this.props.t
    );
  }

  buildFieldConfig = () => {
    const fieldConfigControls = {
      install: {
        render: TextLabel,
        meta: {
          label: 'productInfoLabel',
          colWidth: 12,
          defaultValue: this.props.productName
        }
      },
      message: {
        render: FormUtil.TextInput,
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        meta: {
          label: 'contactMessageLabel',
          colWidth: 12,
          componentClass: 'textarea',
          rows: 8
        }
      }
    };
    return {
      controls: { ...fieldConfigControls }
    };
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);

    this.props.installContact(
      this.props.selectedInstall.id,
      this.userForm.value.message
    );
  };

  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `beacon-form install-contact-form ${
      this.props.colorButton
    }`;
    return (
      <form onSubmit={this.handleSubmit} className={formClassName}>
        <FormGenerator onMount={this.setForm} fieldConfig={this.fieldConfig} />

        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle="default"
            type="button"
            className="pull-left"
            onClick={this.props.toggleInstallContactModal}
          >
            {t('common:cancel')}
          </Button>
          <Button
            bsStyle={this.props.colorButton}
            type="submit"
            disabled={this.props.loading}
          >
            {t('contactButton')}
          </Button>
        </Col>
      </form>
    );
  }
}
export default translate('manageInventory')(InstallContactform);
