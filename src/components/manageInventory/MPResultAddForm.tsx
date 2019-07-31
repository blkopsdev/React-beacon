/*
* MPResultAddForm
* Manually add a result to the installBase in order to update the status of the install base
*/

import { Button } from 'react-bootstrap';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import {
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps,
  Validators
} from 'react-reactive-form';
import { FormUtil } from '../common/FormUtil';
import { toastr } from 'react-redux-toastr';
import { constants } from '../../constants/constants';
import { submitMeasurementPointResult } from '../../actions/measurementPointResultsActions';

interface Iprops {
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  selectedInstallBaseID: string;
  submitMeasurementPointResult: typeof submitMeasurementPointResult;
  toggleModal: () => void;
}
interface Istate {
  fieldConfig: FieldConfig;
}

class MPResultAddFormClass extends React.Component<Iprops, Istate> {
  private form: AbstractControl | any;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: FormUtil.translateForm(this.buildFieldConfig(), this.props.t)
    };
  }

  componentWillMount() {
    if (!this.props.selectedInstallBaseID.length) {
      console.error('missing sellected installBase ID');
      return;
    }
  }

  buildFieldConfig = () => {
    const controls = {
      status: {
        render: FormUtil.Select,
        meta: {
          options: FormUtil.convertIndexedObjectToOptions(
            constants.measurementPointResultStatusTypes
          ),
          label: 'common:status',
          colWidth: 12,
          placeholder: 'statusPlaceholder',
          name: 'status'
        },
        options: {
          validators: [Validators.required]
        }
      },
      notes: {
        render: FormUtil.TextInput,
        meta: {
          label: 'comment',
          colWidth: 12,
          componentClass: 'textarea',
          type: 'input',
          name: 'comment',
          required: true,
          rows: 10
        },
        options: {
          validators: Validators.required
        }
      }
    } as { [key: string]: GroupProps };

    return {
      controls
    } as FieldConfig;
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.form.status === 'INVALID') {
      this.form.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.form.value);

    this.props.submitMeasurementPointResult(
      this.form.value,
      this.props.selectedInstallBaseID
    );
    this.props.toggleModal();
  };

  setForm = (form: AbstractControl) => {
    this.form = form;
    this.form.meta = {
      loading: this.props.loading
    };
  };
  render() {
    const { t } = this.props;
    if (!this.props.selectedInstallBaseID.length) {
      return null;
    }
    return (
      <div className="job-details-content beacon-form">
        <form onSubmit={this.handleSubmit} className="clearfix beacon-form">
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.state.fieldConfig}
          />
          <div className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleModal}
            >
              {t('cancel')}
            </Button>
            <Button
              bsStyle={this.props.colorButton}
              type="submit"
              disabled={this.props.loading}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
export const MPResultAddForm = translate('manageInventory')(
  MPResultAddFormClass
);
