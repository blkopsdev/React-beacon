/* 
* Edit Quote Form
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Validators
} from 'react-reactive-form';
// import { Col, Button, Row, Badge } from 'react-bootstrap';
import {
  Col,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

import { mapValues, forEach } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Ioption, IproductInfo, IshoppingCart, Iproduct } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NumberInputWithButton = ({
  handler,
  touched,
  hasError,
  meta,
  pristine,
  errors,
  submitted
}: AbstractControl) => (
  <FormGroup
    bsSize="sm"
    validationState={FormUtil.getValidationState(pristine, errors, submitted)}
  >
    <Col xs={9}>
      <ControlLabel>{meta.label}</ControlLabel>
    </Col>
    <Col xs={3} style={{ textAlign: 'center' }}>
      <FormControl
        placeholder={meta.placeholder}
        type="number"
        {...handler()}
      />
      <Button
        bsStyle="link"
        style={{ fontSize: '1.6em' }}
        onClick={() => meta.buttonAction(meta.id)}
      >
        <FontAwesomeIcon icon={['far', 'times']} />
      </Button>
    </Col>
  </FormGroup>
);

const buildFieldConfig = (
  products: { [key: string]: Iproduct },
  deleteFromCart: any
) => {
  const productControls = mapValues(products, prod => {
    return {
      render: NumberInputWithButton,
      options: {
        validators: Validators.min(1)
      },
      meta: {
        label: prod.name,
        defaultValue: prod.quantity,
        buttonAction: deleteFromCart,
        id: prod.id
      }
    };
  });
  const fieldConfigControls = {
    //     other:{
    //   render: FormUtil.TextInputWithoutValidation,
    //   meta: { label: 'message', colWidth: 12}
    // },
    message: {
      render: FormUtil.TextInputWithoutValidation,
      inputType: 'textarea',
      meta: { label: 'message', colWidth: 12, type: 'textarea' }
    }
  };
  return {
    controls: { ...productControls, ...fieldConfigControls }
  };
};

// const ProductItem = ({
//   name,
//   quantity,
//   id
// }: {
//   name: string;
//   quantity: number;
//   id: string;
// }) => {
//   return (
//     <Row key={id}>
//       <Col xs={8} className="quote-item-name">
//         {' '}
//         <h5>{name}</h5>{' '}
//       </Col>
//       <Col xs={4} className="quote-item-buttons">
//         <Button bsStyle="link" bsSize="sm">
//           <FontAwesomeIcon icon={['far', 'plus']} />
//         </Button>
//         <Button bsStyle="link" bsSize="sm">
//           <FontAwesomeIcon icon={['far', 'minus']} />
//         </Button>
//         <Badge>{quantity}</Badge>
//         <Button bsStyle="link" bsSize="sm">
//           <FontAwesomeIcon icon={['far', 'times']} />
//         </Button>
//       </Col>
//     </Row>
//   );
// };

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
  cart: IshoppingCart;
  selectedFacilityID: string;
  updateQuantityCart: any;
  deleteFromCart: any;
}
interface Istate {
  fieldConfig: any;
}

class EditQuoteForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.cart.productsByID, this.props.deleteFromCart),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
    this.state = {
      fieldConfig: FormUtil.translateForm(
        buildFieldConfig(
          this.props.cart.productsByID,
          this.props.deleteFromCart
        ),
        this.props.t
      )
    };
  }
  // TODO keep the message somewhere, patch the value
  componentDidMount() {
    this.setState({
      fieldConfig: FormUtil.translateForm(
        buildFieldConfig(
          this.props.cart.productsByID,
          this.props.deleteFromCart
        ),
        this.props.t
      )
    });
    forEach(this.fieldConfig.controls, (input: any, key) => {
      if (this.userForm && input.meta && input.meta.defaultValue) {
        this.userForm.patchValue({ [key]: input.meta.defaultValue });
      }
      if (this.userForm && this.props.cart.addedIDs.length) {
        this.subscription = this.userForm
          .get(key)
          .valueChanges.subscribe((value: any) => {
            this.props.updateQuantityCart(value, key);
          });
      }
    });
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  componentDidUpdate(prevProps: Iprops) {
    if (prevProps.cart.productsByID !== this.props.cart.productsByID) {
      console.log('products changed');
      // this.fieldConfig = FormUtil.translateForm(buildFieldConfig(this.props.cart.productsByID, this.props.deleteFromCart), this.props.t);
      // this.forceUpdate();
      this.setState({
        fieldConfig: FormUtil.translateForm(
          buildFieldConfig(
            this.props.cart.productsByID,
            this.props.deleteFromCart
          ),
          this.props.t
        )
      });
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

    this.props.handleSubmit({
      ...this.userForm.value,
      facilityID: this.props.selectedFacilityID
    });
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
    if (this.props.cart.addedIDs.length === 0) {
      return (
        <h4 style={{ padding: '15px' }}>{this.props.t('emptyQuoteMessage')}</h4>
      );
    }
    return (
      <div>
        <div className={formClassName}>
          <form onSubmit={this.handleSubmit} className="user-form">
            {/*<Col xs={12}>
              {map(this.props.cart.productsByID, (product, key) => {
                console.log(product, key, this.props.productInfo.productGroups);
                return <ProductItem {...product} />;
              })}
            </Col>*/}
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.state.fieldConfig}
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
                {t('request')}
              </Button>
            </Col>
          </form>
        </div>
      </div>
    );
  }
}
export default translate('manageInventory')(EditQuoteForm);
