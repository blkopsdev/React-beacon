/* 
* Manage Inventory Form 
* Edit inventory items
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, differenceBy, filter, find, map } from 'lodash';
import { forEach, find, filter } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Iproduct, Ioption, IproductInfo, Isubcategory } from '../../models';
interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const buildFieldConfig = (
  productInfo: IproductInfo,
  filterSubcategories: (id: string) => void
) => {
  const fieldConfigControls = {
    name: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'name', colWidth: 12, type: 'input' }
    },
    sku: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'sku', colWidth: 12, type: 'input' }
    },
    description: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'description', colWidth: 12, componentClass: 'textarea' }
    },
    productGroupID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.productGroupOptions,
        label: 'common:productGroup',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    brandID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.brandOptions,
        label: 'common:brand',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    manufacturerID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.manufacturerOptions,
        label: 'common:manufacturer',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    mainCategoryID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.mainCategoryOptions,
        label: 'common:mainCategory',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              filterSubcategories(c.value.value);
            }
          }
        ]
      }
    },
    subcategoryID: {
      render: FormUtil.Select,
      meta: {
        // options: productInfo.subcategoryOptions,
        label: 'common:subcategory',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    gasTypeID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.gasTypeOptions,
        label: 'common:gasType',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    powerID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.powerOptions,
        label: 'common:power',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    systemSizeID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.systemSizeOptions,
        label: 'common:systemSize',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    standardID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.standardOptions,
        label: 'common:standard',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  selectedItem?: Iproduct;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
  selectedFacility: Ioption;
}

class ManageInventoryForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.productInfo, this.filterSubcategories),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {
  // }

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
    }
  }
  filterSubcategories = (mainCategoryID: string) => {
    if (mainCategoryID) {
      const filteredSubcategories = filter(
        this.props.productInfo.subcategories,
        (sub: Isubcategory) => {
          return sub.mainCategoryID === mainCategoryID;
        }
      );
      const subcategoryControl = this.userForm.get(
        'subcategoryID'
      ) as AbstractControlEdited;
      subcategoryControl.meta.options = FormUtil.convertToOptions(
        filteredSubcategories
      );
      subcategoryControl.stateChanges.next();
      // try to set the value to the one selected by the user
      if (this.props.selectedItem) {
        const newSubcategory =
          find(subcategoryControl.meta.options, {
            value: this.props.selectedItem.subcategoryID
          }) || {};
        this.userForm.patchValue({ subcategoryID: newSubcategory });
      } else {
        // subcategoryControl.reset();
        // subcategoryControl.markAsPristine();
        // subcategoryControl.stateChanges.next();
        this.userForm.patchValue({ subcategoryID: null });
      }
    }
  };

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
      standardID: standardID.value,
      facilityID: this.props.selectedFacility.value
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
export default translate('manageInventory')(ManageInventoryForm);
