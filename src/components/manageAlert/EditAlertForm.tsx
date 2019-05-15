/* 
* Edit alert Form 
* Add and Edit alerts
* 
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  // AbstractControl,
  FieldConfig,
  FormGroup
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, find } from "lodash";
import { constants } from 'src/constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
// import { forEach } from 'lodash';
import { clearSelectedAlertID } from '../../actions/manageAlertActions';
// import * as moment from "../manageJob/EditJobForm";
// import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component
const buildFieldConfig = () => {
  const fieldConfigControls = {
    title: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: {
        label: 'alertTitleLabel',
        colWidth: 12,
        type: 'input',
        autoFocus: true,
        name: 'alert-title'
      }
    }
    // vat: {
    //   render: FormUtil.TextInput,
    //   meta: {
    //     label: 'customerVatLabel',
    //     colWidth: 12,
    //     name: 'customer-vat',
    //     required: false
    //   }
    // }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  handleSubmit: any;
  handleEdit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  showEditAlertModal: any;
  selectedAlert: any;
  clearSelectedAlertID: typeof clearSelectedAlertID;
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
}

class EditAlertForm extends React.Component<Iprops, {}> {
  private formGroup: FormGroup;
  private fieldConfig: FieldConfig;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(buildFieldConfig(), this.props.t);
  }
  componentDidMount() {
    if (!this.props.selectedAlert) {
      console.log(`adding a new Alert`);
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.props.clearSelectedAlertID();
  }

  /*
  * (reusable)
  * subscribe to the formGroup changes
  */
  subscribeToChanges = () => {
    for (const key in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(key)) {
        this.subscription = this.formGroup
          .get(key)
          .valueChanges.subscribe((value: any) => {
            this.onValueChanges(value, key);
          });
      }
    }
  };

  /*
* (reusable)
* set the table filters to redux on each value change
*/
  onValueChanges = (value: any, key: string) => {
    this.props.updateFormValue({ [key]: value });
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.formGroup.status === 'INVALID') {
      this.formGroup.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.formGroup.value);
    this.props.handleSubmit(this.formGroup.value);
  };

  setForm = (form: FormGroup) => {
    this.formGroup = form;
    this.formGroup.meta = {
      loading: this.props.loading
    };
    this.subscribeToChanges();
  };

  render() {
    const { t } = this.props;

    return (
      <form onSubmit={this.handleSubmit} className="clearfix beacon-form">
        <FormGenerator onMount={this.setForm} fieldConfig={this.fieldConfig} />
        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle="default"
            type="button"
            className="pull-left"
            onClick={this.props.handleCancel}
          >
            {t('common:cancel')}
          </Button>
          <Button
            bsStyle={this.props.colorButton}
            type="submit"
            disabled={this.props.loading}
          >
            {t('save')}
          </Button>
        </Col>
      </form>
    );
  }
}
export default translate('common')(EditAlertForm);
