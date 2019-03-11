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
import { ImeasurementPointSelectOption } from 'src/models';
import { FormUtil } from '../common/FormUtil';
const uuidv4 = require('uuid/v4');

interface Iprops {
  meta: any;
  handler: any;
  pristine: boolean;
  errors: any;
  submitted: boolean;
}

interface Istate {
  value: string;
}

class InputList extends React.Component<Iprops, Istate> {
  constructor(props: any) {
    super(props);
    console.log(this.props.meta.startOptions);
    this.handleChange = this.handleChange.bind(this);
    this.addOption = this.addOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.makeDefault = this.makeDefault.bind(this);
    this.state = {
      value: ''
    };
  }
  handleChange = (e: any) => {
    this.setState({ value: e.target.value });
  };
  addOption = () => {
    const newOption: ImeasurementPointSelectOption = {
      id: uuidv4(),
      label: this.state.value,
      value: this.state.value,
      isDeleted: false,
      isDefault: this.props.handler().value ? false : true // if it is the first one make it the default
    };
    if (this.props.handler().value) {
      this.props.handler().onChange([...this.props.handler().value, newOption]);
    } else {
      this.props.handler().onChange([newOption]);
    }
  };
  deleteOption = (mpo: ImeasurementPointSelectOption) => {
    const newSelectOptions = this.props
      .handler()
      .value.map((o: ImeasurementPointSelectOption) => {
        if (o.id === mpo.id) {
          return { ...o, isDefault: false, isDeleted: true };
        }
        return o;
      });
    this.props.handler().onChange(newSelectOptions);
  };
  makeDefault = (mpo: ImeasurementPointSelectOption) => {
    const newOptions = this.props
      .handler()
      .value.map((o: ImeasurementPointSelectOption) => {
        if (o.id === mpo.id) {
          return { ...o, isDefault: true };
        } else {
          return { ...o, isDefault: false };
        }
      });
    this.props.handler().onChange(newOptions);
  };
  render() {
    const { pristine, errors, submitted } = this.props;
    return (
      <Col xs={this.props.meta.colWidth}>
        <FormGroup
          validationState={FormUtil.getValidationState(
            pristine,
            errors,
            submitted
          )}
        >
          <ControlLabel>{this.props.meta.label}</ControlLabel>
          <InputGroup>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder={this.props.meta.placeholder}
              onChange={this.handleChange}
              style={{ zIndex: 0 }}
            />
            <InputGroup.Button>
              <Button
                onClick={this.addOption}
                bsStyle={this.props.meta.colorButton}
                style={{ zIndex: 0 }}
              >
                {this.props.meta.buttonLabel}
              </Button>
            </InputGroup.Button>
          </InputGroup>
          <ListGroup className="options-list">
            {this.props.handler().value.length > 0 &&
              map(
                this.props.handler().value,
                (mp: ImeasurementPointSelectOption, index: number) => {
                  if (mp.isDeleted === true) {
                    return '';
                  }
                  return (
                    <div className="options-list-item-container" key={index}>
                      <span className="button-controls">
                        <Button
                          onClick={() => {
                            this.deleteOption(mp);
                          }}
                        >
                          <FontAwesomeIcon icon={['far', 'times']}>
                            Delete
                          </FontAwesomeIcon>
                        </Button>
                      </span>
                      <ListGroupItem
                        className="options-list-item"
                        onClick={() => {
                          this.makeDefault(mp);
                        }}
                      >
                        {mp.isDefault === true && <h5>{mp.label} (Default)</h5>}
                        {mp.isDefault === false && <h5>{mp.label}</h5>}
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

export default InputList;
