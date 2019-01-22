import * as React from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Col
} from 'react-bootstrap';
import { map } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImeasurementPointQuestionSelectOption } from 'src/models';
const uuidv4 = require('uuid/v4');

interface Iprops {
  meta: any;
}

interface Istate {
  options: ImeasurementPointQuestionSelectOption[];
  value: string;
}

class RichTextEditor extends React.Component<Iprops, Istate> {
  constructor(props: any) {
    super(props);
    this.state = { options: [], value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.addOption = this.addOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
  }
  handleChange(e: any) {
    this.setState({ value: e.target.value });
  }
  addOption() {
    const newOption: ImeasurementPointQuestionSelectOption = {
      id: uuidv4(),
      label: this.state.value,
      value: this.state.value
    };
    console.log('adding option', newOption);
    this.setState({
      options: [...this.state.options, newOption],
      value: ''
    });
  }
  deleteOption(index: number) {
    this.setState({
      options: [
        ...this.state.options.filter((v: any, i: number) => {
          return i !== index;
        })
      ]
    });
  }
  render() {
    return (
      <Col xs={this.props.meta.colWidth}>
        <FormGroup>
          <ControlLabel>{this.props.meta.label}</ControlLabel>
          <InputGroup>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder={this.props.meta.placeholder}
              onChange={this.handleChange}
            />
            <InputGroup.Button>
              <Button
                onClick={this.addOption}
                bsStyle={this.props.meta.colorButton}
              >
                {this.props.meta.buttonLabel}
              </Button>
            </InputGroup.Button>
          </InputGroup>
          <ListGroup className="options-list">
            {map(
              this.state.options,
              (mp: ImeasurementPointQuestionSelectOption, index: number) => {
                return (
                  <div className="options-list-item-container" key={index}>
                    <span className="button-controls">
                      <Button
                        onClick={() => {
                          this.deleteOption(index);
                        }}
                      >
                        <FontAwesomeIcon icon={['far', 'times']}>
                          {' '}
                          Delete{' '}
                        </FontAwesomeIcon>
                      </Button>
                    </span>
                    <ListGroupItem className="options-list-item">
                      <h5>{mp.label}</h5>
                    </ListGroupItem>
                  </div>
                );
              }
            )}
          </ListGroup>
        </FormGroup>
      </Col>
    );
  }
}

export default RichTextEditor;
