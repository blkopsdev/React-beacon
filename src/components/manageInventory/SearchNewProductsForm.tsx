/* 
* Manage Inventory Form 
* Edit inventory items
*/

import { Col, Button, ListGroup, Row, Well } from 'react-bootstrap';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { forEach, map, isEmpty } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Iproduct, IproductInfo, ItableFiltersReducer } from '../../models';
import {
  toggleSearchNewProductsModal,
  getProducts,
  toggleEditProductModal,
  resetNewProducts,
  setSelectedProduct,
  toggleEditInstallModal
} from '../../actions/manageInventoryActions';
import constants from '../../constants/constants';

const buildFieldConfig = (productInfo: IproductInfo) => {
  const fieldConfigControls = {
    productGroupID: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: productInfo.productGroupOptions,
        label: 'common:productGroup',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false,
        name: 'product-group'
      }
    },
    search: {
      render: FormUtil.TextInputWithoutValidation,
      meta: {
        label: 'search',
        colWidth: 12,
        type: 'input',
        placeholder: 'searchByName',
        name: 'product-search'
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  toggleSearchNewProductsModal: typeof toggleSearchNewProductsModal;
  toggleEditProductModal: typeof toggleEditProductModal;
  selectedItem?: Iproduct;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  tableFilters: ItableFiltersReducer;
  getProducts: typeof getProducts;
  newProducts: { [key: string]: Iproduct };
  resetNewProducts: typeof resetNewProducts;
  setSelectedProduct: typeof setSelectedProduct;
  toggleEditInstallModal: typeof toggleEditInstallModal;
}

class SearchNewProductsForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  private subscription: any;
  private filterNewProductsTimeout: any;

  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.productInfo),
      this.props.t
    );
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {
  // }
  componentWillMount() {
    this.props.resetNewProducts();
  }
  componentDidMount() {
    // if (!this.props.selectedItem) {
    //   console.log('adding a new user');
    // } else {
    // set values
    // forEach(this.props.selectedItem, (value, key) => {
    //   if (typeof value === 'string' && key.split('ID').length === 1) {
    //     // it is a string and did Not find 'ID'
    //     this.userForm.patchValue({ [key]: value });
    //   } else if (value !== null) {
    //     this.userForm.patchValue({
    //       [key]: find(
    //         this.props.productInfo[`${key.split('ID')[0]}Options`],
    //         { value }
    //       )
    //     });
    //   }
    // });
    // }

    forEach(this.fieldConfig.controls, (input: any, key) => {
      if (input.meta && input.meta.defaultValue) {
        this.userForm.patchValue({ [key]: input.meta.defaultValue });
      }
      this.subscription = this.userForm
        .get(key)
        .valueChanges.subscribe((value: any) => {
          clearTimeout(this.filterNewProductsTimeout);
          this.filterNewProductsTimeout = setTimeout(() => {
            this.handleSubmit();
          }, constants.tableSearchDebounceTime);
        });
    });
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleSubmit = () => {
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);

    const { productGroupID, search } = this.userForm.value;
    const productGroupUUID = productGroupID ? productGroupID.value : '';

    this.props.getProducts(1, search, productGroupUUID);
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix beacon-form search-products-form ${
      this.props.colorButton
    }`;

    let searchActive = false;
    if (
      !this.props.loading &&
      this.userForm &&
      this.userForm.value &&
      (this.userForm.value.search || this.userForm.value.productGroupID)
    ) {
      searchActive = true;
    }

    const ProductListItem = ({
      product,
      productInfo,
      selectedItem,
      index
    }: {
      product: Iproduct;
      productInfo: IproductInfo;
      selectedItem?: Iproduct;
      index: string;
    }) => {
      const className =
        selectedItem && selectedItem.id === index
          ? 'list-group-item new-product-item selected'
          : 'list-group-item new-product-item';
      return (
        <li
          className={className}
          onClick={() => {
            const newProduct = {
              ...product,
              subcategory: productInfo.subcategories[product.subcategoryID]
            };
            this.props.toggleEditInstallModal();
            this.props.setSelectedProduct(newProduct);
          }}
        >
          <h4> {product.name} </h4>
          <Row>
            <Col xs={5}>{product.sku}</Col>
            <Col xs={7}>
              {productInfo.manufacturers[product.manufacturerID].name}
            </Col>
            <Col xs={5}>
              {productInfo.productGroups[product.productGroupID].name}
            </Col>
            <Col xs={7}>{productInfo.brands[product.brandID].name}</Col>
          </Row>
        </li>
      );
    };

    return (
      <div>
        <p
          style={{
            marginLeft: '15px',
            marginRight: '15px',
            lineHeight: '1.5rem'
          }}
        >
          {t('searchNewProductInstructions')}
        </p>

        <form
          onSubmit={(e: React.MouseEvent<HTMLFormElement>) => {
            e.preventDefault();
            this.handleSubmit();
          }}
          className={formClassName}
          style={{ display: 'block' }}
        >
          <Row>
            <Col xs={12}>
              <FormGenerator
                onMount={this.setForm}
                fieldConfig={this.fieldConfig}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ListGroup className="beacon-list-group">
                {map(this.props.newProducts, (product, index) => (
                  <ProductListItem
                    product={product}
                    productInfo={this.props.productInfo}
                    key={product.id}
                    selectedItem={this.props.selectedItem}
                    index={index}
                  />
                ))}
              </ListGroup>
              {isEmpty(this.props.newProducts) &&
                searchActive && (
                  <Col xs={12}>
                    <Well className="text-center">
                      {t('no products found')}
                    </Well>
                  </Col>
                )}
            </Col>
          </Row>
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleSearchNewProductsModal}
            >
              {t('common:cancel')}
            </Button>
            <Button
              bsStyle="link"
              type="button"
              disabled={this.props.loading}
              className="right-side"
              onClick={this.props.toggleEditProductModal}
            >
              {t('addNewProductButton')}
            </Button>
            <button type="submit" style={{ display: 'none' }} />
          </Col>
        </form>
      </div>
    );
  }
}
export default translate('manageInventory')(SearchNewProductsForm);
