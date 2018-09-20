/* 
* Edit Quote Form
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button, Row, Badge } from 'react-bootstrap';
// import { forEach, differenceBy, filter, find, map } from 'lodash';
import { map } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Ioption, IproductInfo, IshoppingCart } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const buildFieldConfig = () => {
  const fieldConfigControls = {
    message: {
      render: FormUtil.TextInputWithoutValidation,
      inputType: 'textarea',
      meta: { label: 'message', colWidth: 12, type: 'textarea' }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

const ProductItem = ({
  name,
  quantity,
  id
}: {
  name: string;
  quantity: number;
  id: string;
}) => {
  return (
    <Row key={id}>
      <Col xs={8} className="quote-item-name">
        {' '}
        <h5>{name}</h5>{' '}
      </Col>
      <Col xs={4} className="quote-item-buttons">
        <Button bsStyle="link" bsSize="sm">
          <FontAwesomeIcon icon={['far', 'plus']} />
        </Button>
        <Button bsStyle="link" bsSize="sm">
          <FontAwesomeIcon icon={['far', 'minus']} />
        </Button>
        <Badge>{quantity}</Badge>
        <Button bsStyle="link" bsSize="sm">
          <FontAwesomeIcon icon={['far', 'times']} />
        </Button>
      </Col>
    </Row>
  );
};

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
}

class EditQuoteForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(buildFieldConfig(), this.props.t);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidMount() {
    // TODO keep the message somewhere, patch the value
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
            <Col xs={12}>
              {map(this.props.cart.productsByID, (product, key) => {
                console.log(product, key, this.props.productInfo.productGroups);
                return <ProductItem {...product} />;
              })}
            </Col>
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
