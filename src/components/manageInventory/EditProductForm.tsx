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
  Observable,
  GroupProps,
  FormGroup
} from 'react-reactive-form';
import { filter } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  Iproduct,
  IproductInfo,
  Isubcategory,
  ItableFiltersReducer,
  IproductQueueObject,
  Iuser,
  Ioption
} from '../../models';
import {
  saveProduct,
  updateProduct,
  toggleSearchNewProductsModal,
  createProductName
} from '../../actions/manageInventoryActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import { constants } from '../../constants/constants';

interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

interface Iprops {
  toggleModal: () => void;
  selectedItem: Iproduct;
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
  user: Iuser;
  toggleSearchNewProductsModal: typeof toggleSearchNewProductsModal;
}

class ManageInventoryForm extends React.Component<Iprops, {}> {
  private userForm: FormGroup | any;
  public fieldConfig: FieldConfig;
  private subscription: any;

  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      this.buildFieldConfig(
        this.props.productInfo,
        this.canEditInstalls() === false
      ),
      this.props.t
    );
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  subscribeToValueChanges = () => {
    this.subscription = this.userForm
      .get('mainCategoryID')
      .valueChanges.subscribe((value: Ioption | null) => {
        if (value !== null) {
          this.updateControlOptions(
            this.filterSubcategories(value.value),
            'subcategoryID'
          );
          this.updateControlOptions(
            this.filterProductTypes(value.value),
            'productTypeID'
          );
          this.updateControlOptions(
            this.filterSystemSizes(value.value),
            'systemSizeID'
          );
        }
      });
  };
  buildFieldConfig = (productInfo: IproductInfo, disabled: boolean) => {
    const {
      sku,
      description,
      brandID,
      subcategoryID,
      productTypeID,
      powerID,
      systemSizeID,
      standardID,
      id
    } = this.props.selectedItem;
    let filteredSubcategoryOptions: Ioption[] = [];
    let productTypeOptions = productInfo.productTypeOptions;
    let systemSizeOptions = productInfo.systemSizeOptions;
    // let selectedSubcategoryID = null;
    let selectedMainCategory: any = null;
    const selectedBrand = brandID ? productInfo.brands[brandID] : null;
    const selectedSubcategory = subcategoryID
      ? productInfo.subcategories[subcategoryID]
      : null;
    const selectedProductType = productTypeID
      ? productInfo.productTypes[productTypeID]
      : null;
    const selectedPower = powerID ? productInfo.powers[powerID] : null;
    const selectedSystemSize = systemSizeID
      ? productInfo.systemSizes[systemSizeID]
      : null;
    // default to a standard when creating a new product
    const defaultStandard = id.length
      ? null
      : productInfo.standards[constants.defaultProductStandardID];
    const selectedStandard = standardID
      ? productInfo.standards[standardID]
      : defaultStandard;
    if (subcategoryID) {
      // TODO for now grabbing the first mainCategoryID.  when we actually support having multiple mainCategories related to a single subCategory, we will need to store the mainCategoryID on the product object
      const mainCategoryID =
        productInfo.subcategories[subcategoryID].mainCategoryIDs[0];
      if (mainCategoryID) {
        selectedMainCategory = productInfo.mainCategories[mainCategoryID];
        filteredSubcategoryOptions = FormUtil.convertToOptions(
          this.filterSubcategories(mainCategoryID)
        );
        productTypeOptions = FormUtil.convertToOptions(
          this.filterProductTypes(mainCategoryID)
        );
        systemSizeOptions = FormUtil.convertToOptions(
          this.filterSystemSizes(mainCategoryID)
        );
      }
    }
    const fieldConfigControls = {
      sku: {
        render: FormUtil.TextInput,
        meta: {
          label: 'sku',
          colWidth: 12,
          type: 'input',
          name: 'sku',
          required: false
        },
        formState: { value: sku, disabled }
      },
      description: {
        render: FormUtil.TextInput,
        meta: {
          label: 'description',
          colWidth: 12,
          componentClass: 'textarea',
          name: 'description',
          required: false
        },
        formState: { value: description, disabled }
      },
      brandID: {
        render: FormUtil.Select,
        meta: {
          options: productInfo.brandOptions,
          label: 'brand',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'brand'
        },
        options: {
          validators: Validators.required
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedBrand),
          disabled
        }
      },
      mainCategoryID: {
        render: FormUtil.Select,
        meta: {
          options: productInfo.mainCategoryOptions,
          label: 'mainCategory',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'main-category'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedMainCategory),
          disabled
        }
      },
      subcategoryID: {
        render: FormUtil.Select,
        meta: {
          options: selectedMainCategory ? filteredSubcategoryOptions : [],
          label: 'subcategory',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'subcategory'
        },
        options: {
          validators: Validators.required
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedSubcategory),
          disabled
        }
      },
      productTypeID: {
        render: FormUtil.Select,
        meta: {
          options: productTypeOptions,
          label: 'productType',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'gas-type',
          isClearable: true,
          required: false
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedProductType),
          disabled
        }
      },
      powerID: {
        render: FormUtil.Select,
        meta: {
          options: productInfo.powerOptions,
          label: 'power',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'power',
          isClearable: true,
          required: false
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedPower),
          disabled
        }
      },
      // model
      systemSizeID: {
        render: FormUtil.Select,
        meta: {
          options: systemSizeOptions,
          label: 'systemSize',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'system-size',
          isClearable: true,
          required: false
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedSystemSize),
          disabled
        }
      },
      standardID: {
        render: FormUtil.Select,
        meta: {
          options: productInfo.standardOptions,
          label: 'standard',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          name: 'standard',
          isClearable: true,
          required: false
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedStandard),
          disabled
        }
      }
    } as { [key: string]: GroupProps };
    return {
      controls: { ...fieldConfigControls }
    };
  };

  filterSubcategories = (mainCategoryID: string) => {
    return filter(this.props.productInfo.subcategories, (sub: Isubcategory) => {
      return sub.mainCategoryID === mainCategoryID;
    });
  };

  filterProductTypes = (mainCategoryID: string) => {
    return filter(this.props.productInfo.productTypes, type => {
      return type.mainCategoryIDs.indexOf(mainCategoryID) !== -1;
    });
  };
  filterSystemSizes = (mainCategoryID: string) => {
    return filter(this.props.productInfo.systemSizes, systemSize => {
      return systemSize.mainCategoryIDs.indexOf(mainCategoryID) !== -1;
    });
  };
  updateControlOptions = (options: any[], controlKey: string) => {
    const control = this.userForm.get(controlKey) as AbstractControlEdited;
    control.meta.options = FormUtil.convertToOptions(options);
    control.stateChanges.next();
    this.userForm.patchValue({ [controlKey]: null });
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
      brandID,
      subcategoryID,
      mainCategoryID,
      productTypeID,
      powerID,
      systemSizeID,
      standardID
    } = this.userForm.value as {
      brandID: Ioption;
      subcategoryID: Ioption;
      mainCategoryID: Ioption;
      productTypeID: Ioption;
      powerID: Ioption;
      systemSizeID: Ioption;
      standardID: string;
    };
    const productName = createProductName(
      brandID,
      mainCategoryID,
      subcategoryID,
      productTypeID,
      powerID,
      systemSizeID,
      standardID
    );

    let newItem = {
      ...this.userForm.value,
      brandID: brandID.value,
      subcategoryID: subcategoryID ? subcategoryID.value : '',
      mainCategoryID: mainCategoryID.value,
      productTypeID: productTypeID ? productTypeID.value : '',
      powerID: powerID ? powerID.value : '',
      systemSizeID: systemSizeID ? systemSizeID.value : '',
      standardID: standardID ? standardID : '',
      name: productName
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
    this.subscribeToValueChanges();
  };

  canEditInstalls = () => {
    return (
      constants.hasSecurityFunction(
        this.props.user,
        constants.securityFunctions.ManageInventory.id
      ) ||
      constants.hasSecurityFunction(
        this.props.user,
        constants.securityFunctions.FSE.id
      )
    );
  };

  render() {
    const { t } = this.props;
    return (
      <div className={this.props.colorButton}>
        {this.props.selectedQueueObject && (
          <Button
            bsStyle="link"
            type="button"
            disabled={this.props.loading}
            onClick={this.props.toggleSearchNewProductsModal}
            style={{ marginBottom: '-10px' }}
            className="pull-right"
          >
            {t('manageInventory:mergeProduct')}
          </Button>
        )}
        {!(this.props.selectedItem && this.props.selectedItem.id) && (
          <Col xs={12}>
            <p style={{ lineHeight: '1.4rem' }}>
              {t('newProductInstructions')}
            </p>
          </Col>
        )}
        {this.props.selectedItem &&
          this.props.selectedItem.id && (
            <Col xs={12}>
              <h5 style={{ lineHeight: '1.4rem' }}>
                {this.props.selectedItem.name}
              </h5>
            </Col>
          )}

        <form onSubmit={this.handleSubmit} className="clearfix beacon-form">
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
            {this.canEditInstalls() && (
              <Button
                bsStyle={this.props.colorButton}
                type="submit"
                disabled={this.props.loading}
                style={{ marginRight: '20px' }}
              >
                {t('common:save')}
              </Button>
            )}
            {this.props.selectedQueueObject && (
              <Button
                bsStyle={this.props.colorButton}
                type="button"
                disabled={this.props.loading}
                onClick={(e: any) => this.handleSubmit(e, true)}
              >
                {t('manageInventory:saveApprove')}
              </Button>
            )}
          </Col>
        </form>
      </div>
    );
  }
}
export default translate('manageInventory')(ManageInventoryForm);
