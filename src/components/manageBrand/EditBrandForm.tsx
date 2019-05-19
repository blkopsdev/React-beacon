/*
* Manage Brand Form
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { forEach } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { ItableFiltersReducer } from '../../models';
import { saveBrand, updateBrand } from '../../actions/manageBrands';
import { constants } from 'src/constants/constants';
import { clearSelectedBrandID } from '../../actions/manageBrandActions';

const buildFieldConfig = () => {
  const fieldConfigControls = {
    name: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: {
        label: 'name',
        colWidth: 12,
        type: 'input',
        autoFocus: true,
        name: 'brand-name'
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  toggleModal: () => void;
  selectedBrand?: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  tableFilters: ItableFiltersReducer;
  saveBrand: typeof saveBrand;
  updateBrand: typeof updateBrand;
  clearSelectedID: typeof clearSelectedBrandID;
}

class ManageBrandForm extends React.Component<Iprops, {}> {
  public form: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(buildFieldConfig(), this.props.t);
  }

  componentDidMount() {
    if (this.props.selectedBrand) {
      // set values
      forEach(this.props.selectedBrand, (value, key) => {
        if (typeof value === 'string' && key.split('ID').length === 1) {
          // it is a string and did Not find 'ID'
          this.form.patchValue({ [key]: value });
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.clearSelectedID();
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.form.status === 'INVALID') {
      this.form.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }

    const { name } = this.form.value;
    if (
      this.props.selectedBrand &&
      this.props.selectedBrand.id &&
      this.props.selectedBrand.id.length
    ) {
      const newItem = {
        ...this.props.selectedBrand,
        name
      };
      // updating a brand object
      this.props.updateBrand(newItem);
    } else {
      // creating a new brand
      this.props.saveBrand(name);
    }
    this.props.toggleModal();
  };
  setForm = (form: AbstractControl) => {
    this.form = form;
    // this.form.
    this.form.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `beacon-form location-form ${this.props.colorButton}`;

    return (
      <div>
        <form onSubmit={this.handleSubmit} className={formClassName}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
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
              {t('common:save')}
            </Button>
          </Col>
        </form>
      </div>
    );
  }
}
export default translate('manageBrand')(ManageBrandForm);
