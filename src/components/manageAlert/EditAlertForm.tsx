/*
* Edit alert Form
* Add and Edit alerts
*
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  FieldConfig,
  FormGroup
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { constants } from 'src/constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import {
  clearSelectedAlertID,
  toggleEditAlertModal
} from '../../actions/manageAlertActions';
import { IAlert } from 'src/models';

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
  toggleModal: typeof toggleEditAlertModal;
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
    this.state = {
      file: '',
      fieldConfig: this.buildFieldConfig(this.onFileChange)
    };
  }
  componentDidMount() {
    if (this.props.selectedAlert.id) {
      this.props.setFormValues(this.props.selectedAlert);
    }
  }

  componentDidUpdate(prevProps: Iprops, prevState: State) {
    if (prevProps.formValues.imageUrl !== this.props.formValues.imageUrl) {
      this.setState({ fieldConfig: this.buildFieldConfig(this.onFileChange) });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.props.clearSelectedAlertID();
    this.props.setFormValues({});
  }

  buildFieldConfig = (onFileChange: any) => {
    const { selectedAlert, formValues } = this.props;
    let { type, title, text, imageUrl } = selectedAlert;

    type = formValues.type
      ? formValues.type.value
        ? formValues.type.value
        : formValues.type
      : type;
    title = formValues.title ? formValues.title : title;
    text = formValues.text ? formValues.text : text;
    imageUrl = formValues.imageUrl ? formValues.imageUrl : imageUrl;
    const selectedType =
      constants.alertTypes.find(t => t.value === type) || null;

    const fieldConfigControls = {
      title: {
        options: {
          validators: [Validators.required]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'title',
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
          label: 'type',
          colWidth: 12,
          name: 'alert-type',
          isClearable: false
        },
        formState: {
          value: selectedType,
          disabled: false
        }
      },
      text: {
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'text',
          colWidth: 12,
          name: 'alert-text',
          required: false,
          initialContent: text
        },
        formState: text
      },
      file: {
        render: FormUtil.FileInput,
        meta: {
          type: 'file',
          label: 'Select Image',
          colWidth: 12,
          name: 'alert-file',
          required: false,
          onChange: onFileChange,
          imageUrl
        }
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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.onValueChanges(e.target.result, 'imageUrl');
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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

  handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.formGroup.status === 'INVALID') {
      this.formGroup.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    const formData = {
      ...this.formGroup.value,
      type: this.formGroup.value.type.value
    };
    if (this.state.file) {
      formData['file'] = this.state.file;
    }

    if (!this.props.selectedAlert.id) {
      await this.props.handleSubmit(this.toFormData(formData));
    } else {
      formData['id'] = this.props.selectedAlert.id;
      await this.props.handleEdit(this.toFormData(formData));
    }

    this.props.toggleModal();
  };

  toFormData<T>(formValue: T) {
    const data = new FormData();
    Object.keys(formValue).map(key => {
      const value = formValue[key];
      data.append(key, value && value.value ? value.value : value);
    });

    return data;
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
