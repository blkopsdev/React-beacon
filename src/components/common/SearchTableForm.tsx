/* 
* UserForm 
* User signs up directly to the platform
*/

import * as React from 'react';
import { FormGenerator, AbstractControl } from 'react-reactive-form';
import { Col, Button, Row } from 'react-bootstrap';
import { FormUtil } from '../common/FormUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Field config to configure form
const fieldConfig = {
  controls: {
    search: {
      render: FormUtil.TextInputWithoutValidation,
      meta: { label: 'Search', colWidth: 4, type: 'text' }
    }
  }
};

interface Iprops extends React.Props<SearchTableForm> {
  handleSubmit: any;
  loading: boolean;
}
export default class SearchTableForm extends React.Component<Iprops, {}> {
  public searchForm: AbstractControl;
  constructor(props: Iprops) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
          <Col xs={2} className="search-form-button">
            <Button
              bsStyle="warning" // TODO make this color dynamic
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
