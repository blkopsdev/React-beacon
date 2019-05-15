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
import { IAlert } from 'src/models';
// import * as moment from "../manageJob/EditJobForm";
// import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component

interface Iprops {
  handleSubmit: any;
  handleEdit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  showEditAlertModal: any;
  selectedAlert: IAlert;
  clearSelectedAlertID: typeof clearSelectedAlertID;
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
}

interface State {
  file: any;
  fieldConfig: FieldConfig;
}

class EditAlertForm extends React.Component<Iprops, State> {
  private formGroup: FormGroup;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    // this.fieldConfig = FormUtil.translateForm(buildFieldConfig(this.onFileChange), this.props.t);
    this.state = {
      file: '',
      fieldConfig: this.buildFieldConfig(this.onFileChange)
    };
  }
  componentDidMount() {
    if (!this.props.selectedAlert) {
      console.log(`adding a new Alert`);
    } else {
      this.props.setFormValues(this.props.selectedAlert);
      // forEach(this.props.selectedAlert, (value, key) => {
      //     if (typeof value === 'string' && key.split('ID').length === 1) {
      //       // it is a string and did Not find 'ID'
      //       this.formGroup.patchValue({ [key]: value });
      //     }
      // });
    }
  }

  componentDidUpdate(prevProps: Iprops, prevState: State) {
    if (prevState.file !== this.state.file) {
      this.setState({ fieldConfig: this.buildFieldConfig(this.onFileChange) });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.props.clearSelectedAlertID();
  }

  buildFieldConfig = (onFileChange: any) => {
    const { selectedAlert, formValues } = this.props;
    let { type, title, text, imageUrl } = selectedAlert;

    const fileName = this.state && this.state.file ? this.state.file.name : '';

    type = formValues.type ? formValues.type : type;
    title = formValues.title ? formValues.title : title;
    text = formValues.text ? formValues.text : text;
    imageUrl = fileName ? fileName : imageUrl;
    const selectedType =
      constants.alertTypes.find(t => t.value === type) || null;
      
    const fieldConfigControls = {
      title: {
        options: {
          validators: [Validators.required]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'alertTitleLabel',
          colWidth: 12,
          autoFocus: true,
          name: 'alert-title'
        },
        formState: title
      },
      type: {
        options: {
          validators: [Validators.required]
        },
        render: FormUtil.Select,
        meta: {
          options: constants.alertTypes,
          label: 'alertTypeLabel',
          colWidth: 12,
          autoFocus: true,
          name: 'alert-type'
        },
        formState: {
          value: selectedType
        }
      },
      text: {
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'alertTextLabel',
          colWidth: 12,
          name: 'alert-text',
          required: false,
          initialContent: text
        }
      },
      file: {
        render: FormUtil.FileInput,
        meta: {
          type: 'file',
          label: 'alertFileLabel',
          colWidth: 12,
          name: 'alert-file',
          required: false,
          onChange: onFileChange,
          fileName: fileName || imageUrl
        }
        //   formState: fileName || imageUrl || ''
      }
    };
    return FormUtil.translateForm(
      {
        controls: { ...fieldConfigControls }
      },
      this.props.t
    );
  };

  onFileChange = (file: File) => {
    this.setState({ file });
  };

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
    const formData = this.props.formValues;
    if (this.state.file) {
      formData['file'] = this.state.file;
    }
    if (!this.props.selectedAlert) {
      this.props.handleSubmit(this.toFormData(formData));
    } else {
      formData['id'] = this.props.selectedAlert.id;
      this.props.handleEdit(this.toFormData(formData));
    }
  };

  toFormData<T>(formValue: T) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, typeof value === 'object' ? value.value : value);
    }

    return formData;
  }

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
        <FormGenerator
          onMount={this.setForm}
          fieldConfig={this.state.fieldConfig}
        />
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
