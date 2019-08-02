/* 
* Edit Measurement Point List Test Procedures Form
* 
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps,
  FormGroup
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { constants } from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { ImeasurementPointList } from '../../models';

const fieldConfig = (
  measurementPointList: ImeasurementPointList,
  disabled: boolean
) => {
  const { testProcedures } = measurementPointList;
  const initialContent = testProcedures ? testProcedures : '';
  return {
    controls: {
      testProcedures: {
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'manageMeasurementPointLists:procedureLabel',
          colWidth: 12,
          initialContent
        },
        formState: { value: initialContent, disabled }
      }
    } as {
      [key: string]: GroupProps;
    }
  };
};

interface Iprops {
  toggleModal: () => void;
  loading: boolean;
  colorButton: string;
  selectedMeasurementPointList: ImeasurementPointList;
  t: TranslationFunction;
  updateGlobalMeasurementPointList: (
    mpl: ImeasurementPointList,
    persistToAPI: boolean,
    isCustomer: boolean
  ) => Promise<void>;
  customerID: string;
}

class EditMeasurementPointListTestProceduresFormClass extends React.Component<
  Iprops,
  {}
> {
  private userForm: FormGroup | any;
  private fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      fieldConfig(
        this.props.selectedMeasurementPointList,
        this.props.customerID.length > 0
      ),
      this.props.t
    );
  }
  // componentDidUpdate(prevProps: Iprops) {

  // }

  // componentDidMount() {

  // }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const { testProcedures } = this.userForm.value;
    this.props
      .updateGlobalMeasurementPointList(
        {
          ...this.props.selectedMeasurementPointList,
          testProcedures
        },
        false,
        false
      )
      .catch((error: any) => console.error(error));
    this.props.toggleModal();
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
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
            onClick={this.props.toggleModal}
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
export const EditMeasurementPointListTestProceduresForm = translate(
  'manageMeasurementPointLists'
)(EditMeasurementPointListTestProceduresFormClass);
