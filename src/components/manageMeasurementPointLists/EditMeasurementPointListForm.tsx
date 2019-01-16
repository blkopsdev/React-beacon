/* 
* EditMeasurementPointListForm 
* Edit measurement point lists
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
  // Observable
} from 'react-reactive-form';
import { forEach, find } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Ioption, ImeasurementPointList } from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointQuestionModal
} from '../../actions/manageMeasurementPointListsActions';
import EditMeasurementPointQuestionModal from './EditMeasurementPointQuestionModal';
import constants from '../../constants/constants';
const uuidv4 = require('uuid/v4');

// passing in an object, but we need an array back
// const securityOptions = [
//   ...FormUtil.convertToOptions(constants.securityFunctions)
// ];

// interface IstateChanges extends Observable<any> {
//   next: () => void;
// }

// interface AbstractControlEdited extends AbstractControl {
//   stateChanges: IstateChanges;
// }

const buildFieldConfig = (
  typeOptions: any[],
  productGroupOptions: any[],
  standardOptions: any[]
) => {
  // Field config to configure form
  const fieldConfigControls = {
    type: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: typeOptions,
        label: 'manageMeasurementPointLists:type',
        colWidth: 12,
        placeholder: 'manageMeasurementPointLists:typePlaceholder'
      },
      options: {
        validators: [Validators.required]
      }
    },
    equipmentType: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: productGroupOptions,
        label: 'manageMeasurementPointLists:equipmentType',
        colWidth: 12,
        placeholder: 'manageMeasurementPointLists:equipmentTypePlaceholder'
      },
      options: {
        validators: [Validators.required]
      }
    },
    standard: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: standardOptions,
        label: 'manageMeasurementPointLists:standard',
        colWidth: 12,
        placeholder: 'manageMeasurementPointLists:standardPlaceholder'
      },
      options: {
        validators: [Validators.required]
      }
    }
  };
  const fieldConfig = {
    controls: { ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

interface Iprops extends React.Props<EditMeasurementPointListForm> {
  selectedMeasurementPointList: ImeasurementPointList;
  measurementPointListTypeOptions: any[];
  standardOptions: Ioption[];
  productGroupOptions: Ioption[];
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointQuestionModal: typeof toggleEditMeasurementPointQuestionModal;
}

interface Istate {
  selectedMeasurementPointQuestion: any;
}

class EditMeasurementPointListForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      selectedMeasurementPointQuestion: null
    };
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        this.props.measurementPointListTypeOptions,
        this.props.productGroupOptions,
        this.props.standardOptions
      ),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedMeasurementPointList) {
      return;
    }
  }

  componentDidMount() {
    if (!this.props.selectedMeasurementPointList) {
      console.error('missing measurement point list');
      return;
    }
    // set values
    forEach(this.props.selectedMeasurementPointList, (value, key) => {
      this.measurementsForm.patchValue({ [key]: value });
    });

    const {
      type,
      productGroupID,
      standardID
    } = this.props.selectedMeasurementPointList;
    this.measurementsForm.patchValue({
      type: find(
        this.props.measurementPointListTypeOptions,
        (tOpt: any) => tOpt.value === type
      )
    });
    this.measurementsForm.patchValue({
      equipmentType: find(
        this.props.productGroupOptions,
        (tOpt: any) => tOpt.value === productGroupID
      )
    });
    this.measurementsForm.patchValue({
      standard: find(
        this.props.standardOptions,
        (tOpt: any) => tOpt.value === standardID
      )
    });
  }
  // componentWillUnmount() {}

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove?: boolean
  ) => {
    e.preventDefault();
    if (this.measurementsForm.status === 'INVALID') {
      this.measurementsForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.measurementsForm.value);
    // this.props.updateUser({
    //   id: this.props.selectedMeasurementPointList.id,
    //   ...this.measurementsForm.value,
    //   customerID: this.measurementsForm.value.customerID.value,
    //   facilities: facilitiesArray,
    //   securityFunctions: securityFunctionsArray,
    //   email: this.props.selectedMeasurementPointList.email // have to add back the email because disabling the input removes it
    // });
  };

  setForm = (form: AbstractControl) => {
    this.measurementsForm = form;
    this.measurementsForm.meta = {
      loading: this.props.loading
    };
  };

  setSelectedQuestion(question: any) {
    this.setState({ selectedMeasurementPointQuestion: question });
    this.props.toggleEditMeasurementPointQuestionModal();
  }

  newQuestion(type: number) {
    return {
      id: uuidv4(),
      type,
      label: ''
    };
  }

  render() {
    const { t } = this.props;
    // const selectedCustomer = this.measurementsForm
    //   ? this.measurementsForm.value.customerID
    //   : undefined;

    const formClassName = `clearfix beacon-form ${this.props.colorButton}`;

    return (
      <div>
        <form onSubmit={this.handleSubmit} className={formClassName}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
          <Col xs={12} className="">
            <Button
              bsStyle="link"
              className=""
              onClick={() => {
                this.setSelectedQuestion(
                  this.newQuestion(
                    constants.measurementPointQuestionTypes.GROUP
                  )
                );
              }}
            >
              Add Group
            </Button>
            <Button
              bsStyle="link"
              className=""
              onClick={() => {
                this.setSelectedQuestion(
                  this.newQuestion(
                    constants.measurementPointQuestionTypes.PROCEDURE
                  )
                );
              }}
            >
              Add Procedure
            </Button>
            <Button
              bsStyle="link"
              className=""
              onClick={() => {
                this.setSelectedQuestion(
                  this.newQuestion(
                    constants.measurementPointQuestionTypes.QUESTION_PASSFAIL
                  )
                );
              }}
            >
              Add Question
            </Button>
          </Col>
          <Col xs={12} className="">
            RENDER QUESTIONS HERE
          </Col>
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleEditMeasurementPointListModal}
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
        <EditMeasurementPointQuestionModal
          selectedMeasurementPointList={this.props.selectedMeasurementPointList}
          selectedMeasurementPointQuestion={
            this.state.selectedMeasurementPointQuestion
          }
          colorButton={this.props.colorButton}
          t={this.props.t}
        />
      </div>
    );
  }
}
export default translate('manageMeasurementPointLists')(
  EditMeasurementPointListForm
);
