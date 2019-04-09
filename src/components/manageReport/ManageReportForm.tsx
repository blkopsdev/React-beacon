/* 
* Manage Report Form
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps
} from 'react-reactive-form';
import { forEach } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { TranslationFunction } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Ireport, IdefaultReport, Ioption } from '../../models';
import { constants } from 'src/constants/constants';
import { runReport, updateReport } from 'src/actions/manageReportActions';

interface Iprops {
  selectedItem: Ireport;
  selectedDefaultReport: IdefaultReport;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  toggleModal: () => void;
  runReport: typeof runReport;
  updateReport: typeof updateReport;
  jobOptions: Ioption[];
}
interface Istate {
  fieldConfig: FieldConfig;
}

export class EditReportForm extends React.Component<Iprops, Istate> {
  public formControl: AbstractControl;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: FormUtil.translateForm(this.buildFieldConfig(), this.props.t)
    };
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  buildFieldConfig = () => {
    const disabled = false;
    // commented out selectedItem until we decide to add support for persisting the selectedItem to redux
    // const { coverLetter, jobID = null } = this.props.selectedItem;
    // const coverLetterValue = coverLetter
    //   ? coverLetter
    //   : this.props.selectedDefaultReport.defaultCoverLetter;
    const jobID = null;
    const coverLetterValue = this.props.selectedDefaultReport
      .defaultCoverLetter;

    // Field config to configure form
    const fieldConfigControls = {
      jobID: {
        render: FormUtil.Select,
        meta: {
          options: this.props.jobOptions,
          label: 'common:job',
          colWidth: 12,
          placeholder: 'jobPlaceholder',
          name: 'job'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: jobID,
          disabled
        }
      },
      coverLetter: {
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'coverLetter',
          colWidth: 12,
          name: 'coverLetter',
          type: 'text',
          initialContent: coverLetterValue ? coverLetterValue : ''
        },
        options: {
          validators: Validators.required
        },
        formState: {
          value: coverLetterValue,
          disabled
        }
      }
    } as { [key: string]: GroupProps };
    const fieldConfig = {
      controls: { ...fieldConfigControls }
    };
    return fieldConfig as FieldConfig;
  };

  subscribeToValueChanges = () => {
    forEach(this.state.fieldConfig.controls, (input: any, key) => {
      this.subscription = this.formControl
        .get(key)
        .valueChanges.subscribe((value: any) => {
          this.onValueChanges(value, key);
        });
    });
  };
  /*
  * (reusable)
  * save to redux on each value change
  */
  onValueChanges = (value: any, key: string) => {
    switch (key) {
      default:
        this.props.updateReport(this.props.selectedDefaultReport, {
          [key]: value
        });
        break;
    }
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.formControl.status === 'INVALID') {
      this.formControl.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.formControl.value);
    this.props.runReport(
      this.formControl.value,
      this.props.selectedDefaultReport.reportType
    );
  };
  setForm = (form: AbstractControl) => {
    this.formControl = form;
    this.formControl.meta = {
      loading: this.props.loading
    };
    // this.subscribeToValueChanges();
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix job-form beacon-form ${
      this.props.colorButton
    }`;

    return (
      <form onSubmit={this.handleSubmit} className={formClassName}>
        <FormGenerator
          onMount={this.setForm}
          fieldConfig={this.state.fieldConfig}
        />
        <Col xs={12} className="form-buttons text-right">
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
        </Col>
      </form>
    );
  }
}
