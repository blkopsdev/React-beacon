/* 
* UserForm 
* User signs up directly to the platform
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button, Row } from 'react-bootstrap';
import { FormUtil } from '../common/FormUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TranslationFunction } from 'react-i18next';
import { forEach } from 'lodash';

interface Iprops extends React.Props<SearchTableForm> {
  fieldConfig: FieldConfig;
  handleSubmit: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  onValueChanges?: any;
  subscribeValueChanges?: boolean;
}
export default class SearchTableForm extends React.Component<Iprops, {}> {
  public searchForm: AbstractControl;
  public fieldConfig: FieldConfig;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fieldConfig = FormUtil.translateForm(this.props.fieldConfig, props.t);
  }
  componentDidMount() {
    forEach(this.props.fieldConfig.controls, (input: any, key) => {
      if (input.meta && input.meta.defaultValue) {
        this.searchForm.patchValue({ [key]: input.meta.defaultValue });
      }
      if (this.props.subscribeValueChanges) {
        this.subscription = this.searchForm
          .get(key)
          .valueChanges.subscribe((value: any) => {
            this.props.onValueChanges(value, key);
          });
      }
    });
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.handleSubmit(this.searchForm.value);
  };
  setForm = (form: AbstractControl) => {
    this.searchForm = form;
    this.searchForm.meta = {
      loading: this.props.loading
    };
  };
  render() {
    return (
      <Row className="search-table-form">
        <form onSubmit={this.handleSubmit}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
          <Col xs={1} className="search-form-button">
            <Button
              bsStyle={this.props.colorButton}
              bsSize="sm"
              type="submit"
              disabled={this.props.loading}
            >
              <FontAwesomeIcon icon="search" />
            </Button>
          </Col>
        </form>
      </Row>
    );
  }
}
