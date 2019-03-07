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
  GroupProps
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
  toggleEditProductModal,
  updateProduct,
  toggleSearchNewProductsModal
} from '../../actions/manageInventoryActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import { constants } from 'src/constants/constants';

interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

interface Iprops {
  toggleEditProductModal: typeof toggleEditProductModal;
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
  public userForm: AbstractControl;
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
  // componentDidUpdate(prevProps: Iprops) {
  // }

  // componentDidMount() {
  //   if (!this.props.selectedItem) {
  //     console.log('adding a new user');
  //   } else {
  //     // set values
  //     forEach(this.props.selectedItem, (value, key) => {
  //       if (typeof value === 'string' && key.split('ID').length === 1) {
  //         // it is a string and did Not find 'ID'
  //         this.userForm.patchValue({ [key]: value });
  //       } else if (value !== null) {
  //         this.userForm.patchValue({
  //           [key]: find(
  //             this.props.productInfo[`${key.split('ID')[0]}Options`],
  //             { value }
  //           )
  //         });
  //         // special set for mainCategory
  //         if (key === 'subcategory' && typeof value === 'object') {
  //           const subcat = value as Isubcategory;
  //           const { mainCategoryID } = subcat;
  //           this.userForm.patchValue({
  //             mainCategoryID: find(
  //               this.props.productInfo[`mainCategoryOptions`],
  //               { value: mainCategoryID }
  //             )
  //           });
  //         }
  //       }
  //     });
  //   }
  // }

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
          this.filterSubcategories(value.value);
        }
      });
    // this.subscription = this.userForm
    //   .get('floorID')
    //   .valueChanges.subscribe((value: Ioption | null) => {
    //     if (value !== null) {
    //       this.filterLocations(value.value);
    //     }
    //   });
    // this.subscription = this.userForm
    //   .get('locationID')
    //   .valueChanges.subscribe((value: Ioption | null) => {
    //     if (value !== null) {
    //       this.filterRooms(value.value);
    //     }
    //   });
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
      standardID
    } = this.props.selectedItem;
    let filteredSubcategories: Isubcategory[] = [];
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
    const selectedStandard = standardID
      ? productInfo.standards[standardID]
      : null;
    if (subcategoryID) {
      // TODO for now grabbing the first mainCategoryID.  when we actually support having multiple mainCategories related to a single subCategory, we will need to store the mainCategoryID on the product object
      const mainCategoryID =
        productInfo.subcategories[subcategoryID].mainCategoryIDs[0];
      if (mainCategoryID) {
        selectedMainCategory = productInfo.mainCategories[mainCategoryID];
        filteredSubcategories = filter(
          productInfo.subcategories,
          (sub: Isubcategory) => {
            return sub.mainCategoryIDs.indexOf(mainCategoryID) !== -1;
          }
        );
      }
    }
    const fieldConfigControls = {
      // name: {
      //   options: {
      //     validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      //   },
      //   render: FormUtil.TextInput,
      //   meta: {
      //     label: 'name',
      //     colWidth: 12,
      //     type: 'input',
      //     name: 'product-name',
      //     disabled
      //   }
      // },
      sku: {
        // options: {
        //   validators: [Validators.required, FormUtil.validators.requiredWithTrim]
        // },
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
        // options: {
        //   validators: [Validators.required, FormUtil.validators.requiredWithTrim]
        // },
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
          options: selectedMainCategory
            ? FormUtil.convertToOptions(filteredSubcategories)
            : [],
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
          options: productInfo.productTypeOptions,
          label: 'productType',
          colWidth: 6,
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
          colWidth: 6,
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
      systemSizeID: {
        render: FormUtil.Select,
        meta: {
          options: productInfo.systemSizeOptions,
          label: 'systemSize',
          colWidth: 6,
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
          colWidth: 6,
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
      this.userForm.patchValue({ subcategoryID: null });
    }
  };

  /*
  * product names are generated by: category, subcategory, type, power, model
  */
  createProductName = (
    mainCategoryID: Ioption,
    subcategoryID: Ioption,
    productTypeID: Ioption,
    powerID: Ioption,
    systemSizeID: Ioption
  ) => {
    const category = mainCategoryID ? mainCategoryID.label : '';
    const subcategory = subcategoryID ? `: ${subcategoryID.label}` : '';
    const productType = productTypeID ? `: ${productTypeID.label}` : '';
    const power = powerID ? `: ${powerID.label}` : '';
    const systemSize = systemSizeID ? `: ${systemSizeID.label}` : '';
    return `${category}${subcategory}${productType}${power}${systemSize}`;
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
      standardID: Ioption;
    };
    const productName = this.createProductName(
      mainCategoryID,
      subcategoryID,
      productTypeID,
      powerID,
      systemSizeID
    );

    let newItem = {
      ...this.userForm.value,
      brandID: brandID.value,
      subcategoryID: subcategoryID ? subcategoryID.value : '',
      mainCategoryID: mainCategoryID.value,
      productTypeID: productTypeID ? productTypeID.value : '',
      powerID: powerID ? powerID.value : '',
      systemSizeID: systemSizeID ? systemSizeID.value : '',
      standardID: standardID ? standardID.value : '',
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
              onClick={this.props.toggleEditProductModal}
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
