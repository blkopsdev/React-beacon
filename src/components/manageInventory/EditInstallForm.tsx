/* 
* Manage Install Form 
* Edit Install items
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
  // Observable
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, differenceBy, filter, find, map } from 'lodash';
import { forEach, find } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import {
  // Iproduct,
  Ioption,
  IproductInfo,
  IinstallBase
} from '../../models';
// interface IstateChanges extends Observable<any> {
//   next: () => void;
// }
// interface AbstractControlEdited extends AbstractControl {
//   stateChanges: IstateChanges;
// }
/*
sku(pin): "Test-124"
name(pin): "Test Product"
description(pin): "Test Product"
imagePath(pin): "/image.png"
subcategoryID(pin): "bbbe934e-f5c1-45cb-b850-71d3d4c31f96"
standardID(pin): "444e934e-f5c1-45cb-b850-71d3d4c31f96"
brandID(pin): "ccce934e-f5c1-45cb-b850-71d3d4c31f96"
manufacturerID(pin): "ddde934e-f5c1-45cb-b850-71d3d4c31f96"
gasTypeID(pin): "eeee934e-f5c1-45cb-b850-71d3d4c31f96"
powerID(pin): "fffe934e-f5c1-45cb-b850-71d3d4c31f96"
systemSizeID(pin): "111e934e-f5c1-45cb-b850-71d3d4c31f96"
productGroupID(pin): "222e934e-f5c1-45cb-b850-71d3d4c31f96"
createDate(pin): "2018-08-28T19:35:34.6532093"
updateDate(pin): "2018-09-13T00:55:53.5339951"
*/

const buildFieldConfig = (productInfo: IproductInfo) => {
  const fieldConfigControls = {
    serialNumber: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'serial number', colWidth: 6, type: 'input' }
    },
    rfid: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'rfid', colWidth: 6, type: 'input' }
    },
    remarks: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      inputType: 'textarea',
      meta: { label: 'remarks', colWidth: 12, type: 'textarea' }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

// interface IstateChanges extends Observable<any> {
//   next: () => void;
// }

// interface AbstractControlEdited extends AbstractControl {
//   stateChanges: IstateChanges;
// }

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  selectedItem?: IinstallBase;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  customerOptions: Ioption[];
  facilityOptions: Ioption[];
}

class ManageInstallForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.productInfo),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {}

  componentDidMount() {
    if (!this.props.selectedItem) {
      console.log('adding a new user');
      return;
    } else {
      // set values
      forEach(this.props.selectedItem, (value, key) => {
        if (typeof value === 'string' && key.split('ID').length === 1) {
          // it is a string and did Not find 'ID'
          this.userForm.patchValue({ [key]: value });
        } else if (value !== null) {
          this.userForm.patchValue({
            [key]: find(
              this.props.productInfo[`${key.split('ID')[0]}Options`],
              { value }
            )
          });
          // special set for mainCategory
          if (key === 'subcategory') {
            const { mainCategoryID } = value || ('' as any);
            this.userForm.patchValue({
              mainCategoryID: find(
                this.props.productInfo[`mainCategoryOptions`],
                { value: mainCategoryID }
              )
            });
          }
        }
      });
      //   const {productGroupID, brandID, manufacturerID, subcategoryID, gasTypeID, powerID, systemSizeID, standardID} = this.userForm.value

      //   this.userForm.patchValue({
      //   customerID: find(this.props.selectedItem, { value: productGroupID })
      // });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const {
      productGroupID,
      brandID,
      manufacturerID,
      subcategoryID,
      gasTypeID,
      powerID,
      systemSizeID,
      standardID
    } = this.userForm.value;

    let newItem = {
      ...this.userForm.value,
      productGroupID: productGroupID.value,
      brandID: brandID.value,
      manufacturerID: manufacturerID.value,
      subcategoryID: subcategoryID.value,
      gasTypeID: gasTypeID.value,
      powerID: powerID.value,
      systemSizeID: systemSizeID.value,
      standardID: standardID.value
    };

    if (this.props.selectedItem) {
      newItem = { ...newItem, id: this.props.selectedItem.id };
    }
    this.props.handleSubmit(newItem);
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `user-form manage-form ${this.props.colorButton}`;

    return (
      <div>
        <div className={formClassName}>
          <form onSubmit={this.handleSubmit} className="user-form">
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="link"
                type="button"
                className="pull-left left-side"
                onClick={this.props.handleCancel}
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
        </div>
      </div>
    );
  }
}
export default translate('manageInstall')(ManageInstallForm);
