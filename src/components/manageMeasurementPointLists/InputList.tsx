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
const uuidv4 = require('uuid/v4');

interface Iprops {
  meta: any;
  onChange: any;
}

interface Istate {
  options: ImeasurementPointSelectOption[];
  value: string;
}

class InputList extends React.Component<Iprops, Istate> {
  constructor(props: any) {
    super(props);
    console.log(this.props.meta.startOptions);
    this.state = { options: this.props.meta.startOptions, value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.addOption = this.addOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.makeDefault = this.makeDefault.bind(this);
  }
  handleChange(e: any) {
    this.setState({ value: e.target.value });
  }
  addOption() {
    const newOption: ImeasurementPointSelectOption = {
      id: uuidv4(),
      label: this.state.value,
      value: this.state.value,
      isDeleted: false,
      isDefault:
        this.state.options.filter(o => {
          return o.isDeleted !== true;
        }).length === 0
          ? true
          : false
    };
    // console.log('adding option', newOption);
    this.setState(
      {
        options: [...this.state.options, newOption],
        value: ''
      },
      () => {
        this.props.onChange(this.state.options);
      }
    );
  }
  deleteOption(mpo: ImeasurementPointSelectOption) {
    this.setState(
      {
        options: this.state.options.map((o: ImeasurementPointSelectOption) => {
          if (o.id === mpo.id) {
            return { ...o, isDefault: false, isDeleted: true };
          }
          return o;
        })
      },
      () => {
        this.props.onChange(this.state.options);
      }
    );
  }
  makeDefault(mpo: ImeasurementPointSelectOption) {
    this.setState(
      {
        options: this.state.options.map((o: ImeasurementPointSelectOption) => {
          if (o.id === mpo.id) {
            return { ...o, isDefault: true };
          } else {
            return { ...o, isDefault: false };
          }
        })
      },
      () => {
        this.props.onChange(this.state.options);
      }
    );
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
            {map(
              this.state.options,
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
                          {' '}
                          Delete{' '}
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
