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
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { forEach } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Ioption, IproductInfo, IinstallBase, Iproduct } from '../../models';

const buildFieldConfig = (productInfo: IproductInfo) => {
  const fieldConfigControls = {
    nickname: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'nickname', colWidth: 12, type: 'input' }
    },
    serialNumber: {
      render: FormUtil.TextInput,
      meta: { label: 'serial number', colWidth: 6, type: 'input' }
    },
    rfid: {
      render: FormUtil.TextInput,
      meta: { label: 'rfid', colWidth: 6, type: 'input' }
    },
    remarks: {
      render: FormUtil.TextInput,
      meta: { label: 'remarks', colWidth: 12, componentClass: 'textarea' }
    },
    quantity: {
      options: {
        validators: Validators.min(1)
      },
      render: FormUtil.TextInput,
      inputType: 'number',
      meta: { label: 'quantity', colWidth: 6, type: 'number', defaultValue: 1 }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  selectedItem: IinstallBase;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
  selectedFacility: Ioption;
  selectedProduct: Iproduct;
  deleteInstall: (id: string, prodID: string) => void;
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
    if (!this.props.selectedProduct.id) {
      console.error('missing product');
      toastr.error(
        'Error',
        'Missing product, please try again or contact support.',
        constants.toastrError
      );
      this.props.handleCancel();
    }
    if (
      !this.props.selectedItem ||
      (this.props.selectedItem && !this.props.selectedItem.id)
    ) {
      console.log('adding a new install');
      this.userForm.patchValue({ quantity: 1 });
    } else {
      // set values
      forEach(this.props.selectedItem, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });
      const quantityControl = this.userForm.get('quantity');
      quantityControl.disable();
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

    let newItem = {
      ...this.userForm.value,
      facilityID: this.props.selectedFacility.value,
      productID: this.props.selectedProduct.id
    };

    if (this.props.selectedItem) {
      newItem = { ...newItem, id: this.props.selectedItem.id };
    }
    this.props.handleSubmit(newItem, this.props.selectedProduct.id);
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
                bsStyle="warning"
                style={{ marginRight: '15px' }}
                type="button"
                className=""
                disabled={this.props.selectedItem.id === undefined}
                onClick={() =>
                  this.props.deleteInstall(
                    this.props.selectedItem.id,
                    this.props.selectedProduct.id
                  )
                }
              >
                {t('delete')}
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
