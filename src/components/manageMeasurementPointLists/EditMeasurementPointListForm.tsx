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
import { forEach, find, map, keys, keyBy } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  Ioption,
  ImeasurementPointList,
  ImeasurementPoint
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  addGlobalMeasurementPointList,
  updateGlobalMeasurementPointList,
  addQuestionToMeasurementPointList,
  deleteGlobalMeasurementPoint
} from '../../actions/manageMeasurementPointListsActions';
import EditMeasurementPointModal from './EditMeasurementPointModal';
import { constants } from 'src/constants/constants';
import { initialMeasurementPoint } from 'src/reducers/initialState';
import { MeasurementPointList } from './MeasurementPointList';
const uuidv4 = require('uuid/v4');

const buildFieldConfig = (
  typeOptions: Ioption[],
  mainCategoryOptions: Ioption[],
  standardOptions: Ioption[]
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
        options: mainCategoryOptions,
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
  measurementPointListTypeOptions: Ioption[];
  standardOptions: Ioption[];
  mainCategoryOptions: Ioption[];
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addGlobalMeasurementPointList: typeof addGlobalMeasurementPointList;
  updateGlobalMeasurementPointList: typeof updateGlobalMeasurementPointList;
  addQuestionToMeasurementPointList: typeof addQuestionToMeasurementPointList;
  deleteGlobalMeasurementPoint: typeof deleteGlobalMeasurementPoint;
}

interface Istate {
  selectedMeasurementPoint: ImeasurementPoint;
  questions: ImeasurementPoint[];
}

class EditMeasurementPointListForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      selectedMeasurementPoint: initialMeasurementPoint,
      questions: this.parseQuestions()
    };
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        this.props.measurementPointListTypeOptions,
        this.props.mainCategoryOptions,
        this.props.standardOptions
      ),
      this.props.t
    );
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
      mainCategoryID,
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
        this.props.mainCategoryOptions,
        (tOpt: any) => tOpt.value === mainCategoryID
      )
    });
    this.measurementsForm.patchValue({
      standard: find(
        this.props.standardOptions,
        (tOpt: any) => tOpt.value === standardID
      )
    });
  }
  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedMeasurementPointList) {
      console.error('missing selected measurement point');
      return;
    }

    if (
      JSON.stringify(this.props.selectedMeasurementPointList) !==
      JSON.stringify(prevProps.selectedMeasurementPointList)
    ) {
      console.log('update!!!!');
      this.setState({ questions: this.parseQuestions() });
    }
  }

  parseQuestions = () => {
    const mps = map(
      this.props.selectedMeasurementPointList.measurementPoints,
      mp => {
        return mp;
      }
    );
    mps.sort((a: ImeasurementPoint, b: ImeasurementPoint) => {
      return a.order - b.order;
    });
    return map(mps, (mp, index) => {
      return { ...mp, order: index };
    });
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.measurementsForm.status === 'INVALID') {
      this.measurementsForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    const mpl = {
      ...this.props.selectedMeasurementPointList,
      mainCategoryID: this.measurementsForm.value.equipmentType.value,
      standardID: this.measurementsForm.value.standard.value,
      type: this.measurementsForm.value.type.value,
      measurementPoints: keyBy(
        this.state.questions,
        (item: ImeasurementPoint) => item.id
      )
    };
    if (mpl.id === '') {
      mpl.id = uuidv4();
      // add new mpl
      this.props.addGlobalMeasurementPointList(mpl);
    } else {
      // update existing mpl
      this.props.updateGlobalMeasurementPointList(mpl);
    }
    // console.log(mpl);
  };

  setForm = (form: AbstractControl) => {
    this.measurementsForm = form;
    this.measurementsForm.meta = {
      loading: this.props.loading
    };
  };

  setSelectedMeasurementPoint = (measurementPoint: ImeasurementPoint) => {
    this.setState({ selectedMeasurementPoint: measurementPoint });
    this.props.toggleEditMeasurementPointModal();
  };

  deleteMeasurementPoint = (measurementPoint: ImeasurementPoint) => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.deleteGlobalMeasurementPoint(
          this.props.selectedMeasurementPointList.id,
          measurementPoint.id
        );
        console.log('deleted', measurementPoint);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteMeasurementPointOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirm'), toastrConfirmOptions);
  };

  newMeasurementPoint = (type: number): ImeasurementPoint => {
    return {
      id: uuidv4(),
      type,
      label: '',
      order: keys(this.props.selectedMeasurementPointList.measurementPoints)
        .length,
      guideText: '',
      allowNotes: true,
      helpText: ''
    };
  };

  swapQuestionOrder = (q1Index: number, q2Index: number) => {
    const mps = this.state.questions;
    console.log('Swapping ', mps[q1Index].label, mps[q2Index].label);
    const tempOrder = mps[q1Index].order;
    mps[q1Index] = { ...mps[q1Index], order: mps[q2Index].order };
    mps[q2Index] = { ...mps[q2Index], order: tempOrder };
    mps.sort((a: ImeasurementPoint, b: ImeasurementPoint) => {
      return a.order - b.order;
    });
    this.setState({
      questions: mps
    });
  };

  render() {
    const { t } = this.props;

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
              type="button"
              className=""
              onClick={() => {
                this.setSelectedMeasurementPoint(
                  this.newMeasurementPoint(
                    constants.measurementPointTypes.GROUP
                  )
                );
              }}
            >
              Add Group
            </Button>
            <Button
              bsStyle="link"
              type="button"
              className=""
              onClick={() => {
                this.setSelectedMeasurementPoint(
                  this.newMeasurementPoint(
                    constants.measurementPointTypes.PROCEDURE
                  )
                );
              }}
            >
              Add Procedure
            </Button>
            <Button
              bsStyle="link"
              type="button"
              className=""
              onClick={() => {
                this.setSelectedMeasurementPoint(
                  this.newMeasurementPoint(
                    constants.measurementPointTypes.QUESTION_PASSFAIL
                  )
                );
              }}
            >
              Add Question
            </Button>
          </Col>
          <Col xs={12} className="">
            <MeasurementPointList
              measurementPointList={this.state.questions}
              setSelectedMeasurementPoint={this.setSelectedMeasurementPoint}
              swapQuestionOrder={this.swapQuestionOrder}
              deleteMeasurementPoint={this.deleteMeasurementPoint}
            />
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
        <EditMeasurementPointModal
          selectedMeasurementPointList={this.props.selectedMeasurementPointList}
          selectedMeasurementPoint={this.state.selectedMeasurementPoint}
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
