/* 
* Manage Location Form 
* Edit location items
*/

import { Col, Button, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
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
import {
  Ibuilding,
  ItableFiltersReducer,
  Ifloor,
  Ilocation,
  Ifacility
} from '../../models';
import {
  saveAnyLocation,
  updateAnyLocation
} from '../../actions/manageLocationActions';
import { constants } from 'src/constants/constants';

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
        name: 'location-name'
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  toggleModal: () => void;
  selectedItem?: any;
  selectedType: 'Building' | 'Floor' | 'Location' | 'Room';
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  tableFilters: ItableFiltersReducer;
  saveAnyLocation: typeof saveAnyLocation;
  updateAnyLocation: typeof updateAnyLocation;
  facility: Ifacility;
  selectedBuilding: Ibuilding;
  selectedFloor: Ifloor;
  selectedLocation: Ilocation;
}

class ManageLocationForm extends React.Component<Iprops, {}> {
  public form: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(buildFieldConfig(), this.props.t);
  }

  componentDidMount() {
    if (!this.props.selectedItem) {
      console.log(`adding a new ${this.props.selectedType}`);
    } else {
      // set values
      forEach(this.props.selectedItem, (value, key) => {
        if (typeof value === 'string' && key.split('ID').length === 1) {
          // it is a string and did Not find 'ID'
          this.form.patchValue({ [key]: value });
        }
      });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.form.status === 'INVALID') {
      this.form.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.form.value);
    const { name } = this.form.value;
    if (
      this.props.selectedItem &&
      this.props.selectedItem.id &&
      this.props.selectedItem.id.length
    ) {
      const newItem = {
        ...this.props.selectedItem,
        name
      };
      // updating a location object
      this.props.updateAnyLocation(newItem, this.props.facility.id);
    } else {
      // creating a new location
      this.props.saveAnyLocation(name, this.props.facility.id);
    }
  };
  setForm = (form: AbstractControl) => {
    this.form = form;
    // this.form.
    this.form.meta = {
      loading: this.props.loading
    };
  };

  // get breadcrumb path
  getBreadcrumbs = () => {
    return (
      <Breadcrumb>
        {this.props.selectedBuilding.id ? (
          <BreadcrumbItem active>
            {this.props.selectedBuilding.name}
          </BreadcrumbItem>
        ) : (
          ''
        )}
        {this.props.selectedFloor.id ? (
          <BreadcrumbItem active>
            {this.props.selectedFloor.name}
          </BreadcrumbItem>
        ) : (
          ''
        )}
        {this.props.selectedLocation.id ? (
          <BreadcrumbItem active>
            {this.props.selectedLocation.name}
          </BreadcrumbItem>
        ) : (
          ''
        )}
      </Breadcrumb>
    );
  };

  render() {
    const { t } = this.props;

    const formClassName = `beacon-form location-form ${this.props.colorButton}`;

    return (
      <div>
        {this.getBreadcrumbs()}

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
export default translate('manageLocation')(ManageLocationForm);
