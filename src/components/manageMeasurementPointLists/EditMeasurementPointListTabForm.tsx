/* 
* Edit Measurement Point List Form
* 
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, find } from "lodash";
import { constants } from 'src/constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { ImeasurementPointListTab, ImeasurementPointList } from 'src/models';
import {
  toggleEditMeasurementPointTabModal,
  updateMeasurementPointListTab
} from 'src/actions/manageMeasurementPointListsActions';
// import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component

const fieldConfig = (selectedTab: ImeasurementPointListTab) => {
  return {
    controls: {
      name: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'measurementPointTabLabel',
          colWidth: 12,
          name: 'measurement-point-tab'
        },
        formState: { value: selectedTab.name, disabled: false }
      }
    } as {
      [key: string]: GroupProps;
    }
  };
};

interface Iprops {
  toggleEditMeasurementPointTabModal: typeof toggleEditMeasurementPointTabModal;
  loading: boolean;
  colorButton: string;
  selectedTab: ImeasurementPointListTab;
  selectedMeasurementPointList: ImeasurementPointList;
  updateMeasurementPointListTab: typeof updateMeasurementPointListTab;
  t: TranslationFunction;
}

class EditMeasurementPointListTabForm extends React.Component<Iprops, {}> {
  private userForm: AbstractControl;
  private fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      fieldConfig(this.props.selectedTab),
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
    const { name } = this.userForm.value;
    this.props.updateMeasurementPointListTab({
      ...this.props.selectedTab,
      name
    });
  };
  handleDelete = () => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.updateMeasurementPointListTab({
          ...this.props.selectedTab,
          isDeleted: true
        });
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteMeasurementPointTabOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirmMPLT'), toastrConfirmOptions);
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
            onClick={this.props.toggleEditMeasurementPointTabModal}
          >
            {t('common:cancel')}
          </Button>
          <Button
            bsStyle="warning"
            type="button"
            style={{ marginRight: '15px' }}
            onClick={this.handleDelete}
          >
            {t('common:delete')}
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
export default translate('manageMeasurementPointLists')(
  EditMeasurementPointListTabForm
);
