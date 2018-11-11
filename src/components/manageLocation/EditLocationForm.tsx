/* 
* Manage Inventory Form 
* Edit inventory items
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
import {
  Ibuilding,
  ItableFiltersReducer,
  Ifloor,
  Ilocation,
  Iroom,
  Ifacility
} from '../../models';
import {
  saveAnyLocation,
  updateAnyLocation,
  toggleEditLocationModal
} from '../../actions/manageLocationActions';
import constants from '../../constants/constants';

// interface IstateChanges extends Observable<any> {
//   next: () => void;
// }
// interface AbstractControlEdited extends AbstractControl {
//   stateChanges: IstateChanges;
// }

const buildFieldConfig = () => {
  const fieldConfigControls = {
    name: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'name', colWidth: 12, type: 'input' }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  toggleEditLocationModal: typeof toggleEditLocationModal;
  selectedItem?: any;
  selectedType: string;
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
  selectedRoom: Iroom;
}

class ManageLocationForm extends React.Component<Iprops, {}> {
  public form: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(buildFieldConfig(), this.props.t);
    this.setForm = this.setForm.bind(this);
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

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove: boolean = false
  ) => {
    e.preventDefault();
    if (this.form.status === 'INVALID') {
      this.form.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.form.value);

    let newItem = {
      ...this.form.value
    };

    if (
      this.props.selectedItem &&
      this.props.selectedItem.id &&
      this.props.selectedItem.id.length
    ) {
      newItem = { ...this.props.selectedItem, ...newItem };
      // updating a location object
      this.props.updateAnyLocation(newItem, this.props.selectedType);
    } else {
      // creating a new location
      if (this.props.selectedType === 'Building') {
        newItem = {
          ...newItem,
          facilityID: this.props.facility.id,
          floors: []
        };
      } else if (this.props.selectedType === 'Floor') {
        newItem = {
          ...newItem,
          buildingID: this.props.selectedBuilding.id,
          locations: []
        };
      } else if (this.props.selectedType === 'Location') {
        newItem = {
          ...newItem,
          floorID: this.props.selectedFloor.id,
          rooms: []
        };
      } else {
        newItem = {
          ...newItem,
          locationID: this.props.selectedLocation.id
        };
      }
      this.props.saveAnyLocation(newItem, this.props.selectedType);
      // console.error(newItem, this.props.selectedType);
    }
  };
  setForm = (form: AbstractControl) => {
    this.form = form;
    this.form.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `user-form manage-form ${this.props.colorButton}`;

    return (
      <div>
        <div className={formClassName}>
          {/* {!(this.props.selectedItem && this.props.selectedItem.id) && (
            <Col xs={12}>
              <p style={{ lineHeight: '1.4rem' }}>
                {t('newProductInstructions')}
              </p>
            </Col>
          )} */}

          <form onSubmit={this.handleSubmit} className="user-form">
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={this.props.toggleEditLocationModal}
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
      </div>
    );
  }
}
export default translate('manageLocation')(ManageLocationForm);
