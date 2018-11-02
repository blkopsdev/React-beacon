/* 
* Manage Install Form 
* Edit Install items
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
  IinstallBase,
  Ioption,
  Iproduct,
  ItableFiltersReducer
} from '../../models';
import {
  saveInstall,
  toggleEditInstallModal,
  updateInstall
} from '../../actions/manageInventoryActions';
import constants from '../../constants/constants';

const buildFieldConfig = (shouldRequireQuantity: boolean) => {
  let quantityValidators = [Validators.min(1), Validators.max(1000)];
  if (shouldRequireQuantity) {
    quantityValidators = [
      Validators.min(1),
      Validators.max(1000),
      Validators.required
    ];
  }
  const fieldConfigControls = {
    productInfo: {
      render: FormUtil.TextLabel,
      meta: { label: 'productInfo', colWidth: 12 }
    },
    nickname: {
      render: FormUtil.TextInput,
      meta: { label: 'nickname', colWidth: 12, type: 'input' }
    },
    serialNumber: {
      render: FormUtil.TextInput,
      meta: { label: 'serialNumber', colWidth: 6, type: 'input' }
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
        validators: quantityValidators
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
  updateInstall: typeof updateInstall;
  saveInstall: typeof saveInstall;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  selectedItem: IinstallBase;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  facilityOptions: Ioption[];
  tableFilters: ItableFiltersReducer;
  selectedProduct: Iproduct;
  deleteInstall: (id: string, prodID: string) => void;
}

class ManageInstallForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        !!(this.props.selectedItem && this.props.selectedItem.id)
      ),
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
      this.props.toggleEditInstallModal();
    }
    this.userForm.patchValue({ productInfo: this.props.selectedProduct.name });
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
      // we don't use quantity on existing products, but we need to pass validation
      this.userForm.patchValue({ quantity: 1 });
      const quantityControl = this.userForm.get('quantity');
      quantityControl.meta = {
        ...quantityControl.meta,
        style: { display: 'none' }
      };
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
    if (this.props.tableFilters.facility) {
      let newItem = {
        ...this.userForm.value,
        facilityID: this.props.tableFilters.facility.value,
        productID: this.props.selectedProduct.id
      };

      if (this.props.selectedItem && this.props.selectedItem.id) {
        newItem = { ...newItem, id: this.props.selectedItem.id };
        this.props.updateInstall(newItem, this.props.selectedProduct.id);
      } else {
        this.props.saveInstall(newItem, this.props.selectedProduct.id);
      }
    } else {
      console.error('missing facility, unable to save install');
      toastr.error(
        'Error',
        'Missing facility, please try again or contact support',
        constants.toastrError
      );
    }
  };
  handleDelete = () => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.deleteInstall(
          this.props.selectedItem.id,
          this.props.selectedProduct.id
        );
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('installDeleteOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('installDeleteConfirm'), toastrConfirmOptions);
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
    const deleteButtonStyle =
      this.props.selectedItem.id === undefined
        ? { marginRight: '15px', display: 'none' }
        : { marginRight: '15px' };
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
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={this.props.toggleEditInstallModal}
              >
                {t('common:cancel')}
              </Button>
              <Button
                bsStyle="warning"
                style={deleteButtonStyle}
                type="button"
                className=""
                disabled={this.props.loading}
                onClick={this.handleDelete}
              >
                {t('common:delete')}
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
export default translate('manageInventory')(ManageInstallForm);
