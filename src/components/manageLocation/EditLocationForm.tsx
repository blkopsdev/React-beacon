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
import { Ibuilding, ItableFiltersReducer } from '../../models';
import {
  saveBuilding,
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
  selectedItem?: Ibuilding;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  tableFilters: ItableFiltersReducer;
  saveBuilding: typeof saveBuilding;
  // updateProduct: typeof updateProduct;
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
      console.log('adding a new location');
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

    // let newItem = {
    //   ...this.form.value
    // };

    // if (
    //   this.props.selectedItem &&
    //   this.props.selectedItem.id &&
    //   this.props.selectedItem.id.length
    // ) {
    //   newItem = { ...newItem, id: this.props.selectedItem.id };
    //     // updating a product object
    //     if (this.props.tableFilters.facility) {
    //       newItem = {
    //         ...newItem,
    //         facilityID: this.props.tableFilters.facility.value
    //       };
    //       this.props.updateProduct(newItem);
    //     }
    // } else {
    //   // creating a new product
    //   if (this.props.tableFilters.facility) {
    //     newItem = {
    //       ...newItem,
    //       facilityID: this.props.tableFilters.facility.value
    //     };
    //     this.props.saveProduct(newItem);
    //   }
    // }
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
          {!(this.props.selectedItem && this.props.selectedItem.id) && (
            <Col xs={12}>
              <p style={{ lineHeight: '1.4rem' }}>
                {t('newProductInstructions')}
              </p>
            </Col>
          )}

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
