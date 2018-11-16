/* 
* Manage Inventory Form 
* Edit inventory items
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { forEach, find, filter } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  Iproduct,
  IproductInfo,
  Isubcategory,
  ItableFiltersReducer,
  IproductQueueObject
} from '../../models';
import {
  saveProduct,
  toggleEditProductModal,
  updateProduct
} from '../../actions/manageInventoryActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import constants from '../../constants/constants';

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
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'name', colWidth: 12, type: 'input' }
    },
    sku: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'sku', colWidth: 12, type: 'input' }
    },
    description: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
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
        label: 'brand',
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
        label: 'manufacturer',
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
        label: 'mainCategory',
        colWidth: 12,
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
        label: 'subcategory',
        colWidth: 12,
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
        label: 'gasType',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      }
    },
    powerID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.powerOptions,
        label: 'power',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      }
    },
    systemSizeID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.systemSizeOptions,
        label: 'systemSize',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      }
    },
    standardID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.standardOptions,
        label: 'standard',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  toggleEditProductModal: typeof toggleEditProductModal;
  selectedItem?: Iproduct;
  selectedQueueObject?: IproductQueueObject;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  tableFilters: ItableFiltersReducer;
  saveProduct: typeof saveProduct;
  updateProduct: typeof updateProduct;
  updateQueueProduct: typeof updateQueueProduct;
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
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {
  // }

  componentDidMount() {
    if (!this.props.selectedItem) {
      console.log('adding a new user');
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
        const newSubcategory = find(subcategoryControl.meta.options, {
          value: this.props.selectedItem.subcategoryID
        }) || { value: '' };
        this.userForm.patchValue({ subcategoryID: newSubcategory });
        if (!newSubcategory.value.length) {
          subcategoryControl.markAsDirty();
          subcategoryControl.setErrors({
            required: { required: { message: 'this is required' } }
          });
          this.userForm.patchValue({ subcategoryID: null });
        }
      } else {
        // subcategoryControl.reset();
        // subcategoryControl.markAsPristine();
        // subcategoryControl.stateChanges.next();
        this.userForm.patchValue({ subcategoryID: null });
      }
    }
  };

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove: boolean = false
  ) => {
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
      mainCategoryID,
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
      mainCategoryID: mainCategoryID.value,
      gasTypeID: gasTypeID.value,
      powerID: powerID.value,
      systemSizeID: systemSizeID.value,
      standardID: standardID.value
    };

    if (
      this.props.selectedItem &&
      this.props.selectedItem.id &&
      this.props.selectedItem.id.length
    ) {
      newItem = { ...newItem, id: this.props.selectedItem.id };
      if (this.props.selectedQueueObject) {
        // updating a queue object, no need for a facilityID
        this.props.updateQueueProduct(
          newItem,
          shouldApprove,
          this.props.selectedQueueObject.id
        );
      } else {
        // updating a product object
        if (this.props.tableFilters.facility) {
          newItem = {
            ...newItem,
            facilityID: this.props.tableFilters.facility.value
          };
          this.props.updateProduct(newItem);
        }
      }
    } else {
      // creating a new product
      if (this.props.tableFilters.facility) {
        newItem = {
          ...newItem,
          facilityID: this.props.tableFilters.facility.value
        };
        this.props.saveProduct(newItem);
      }
    }
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix user-form manage-form ${
      this.props.colorButton
    }`;

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

          <form
            onSubmit={this.handleSubmit}
            className="clearfix beacon-form user-form"
          >
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={this.props.toggleEditProductModal}
              >
                {t('common:cancel')}
              </Button>
              {this.props.selectedQueueObject && (
                <Button
                  bsStyle={this.props.colorButton}
                  type="button"
                  disabled={this.props.loading}
                  onClick={(e: any) => this.handleSubmit(e, true)}
                  style={{ marginRight: '20px' }}
                >
                  {t('manageInventory:saveApprove')}
                </Button>
              )}
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
export default translate('manageInventory')(ManageInventoryForm);
