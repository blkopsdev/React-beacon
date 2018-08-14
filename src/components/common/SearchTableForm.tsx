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

// Field config to configure form
const fieldConfig = {
  controls: {
    search: {
      render: FormUtil.TextInputWithoutValidation,
      meta: { label: 'common:search', colWidth: 4, type: 'text' }
    }
  }
};

interface Iprops extends React.Props<SearchTableForm> {
  handleSubmit: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
}
export default class SearchTableForm extends React.Component<Iprops, {}> {
  public searchForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, props.t);
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.handleSubmit(this.searchForm.value);
  };
  setForm = (form: any) => {
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
          <Col xs={2} className="search-form-button">
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
