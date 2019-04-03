import * as React from 'react';
import { TranslationFunction } from 'react-i18next';

import { ListGroup, ListGroupItem, Col, Button } from 'react-bootstrap';
import { ImeasurementPointResult } from 'src/models';

interface Props {
  selectedItem: ImeasurementPointResult;
  colorButton: string;
  t: TranslationFunction;
  toggleModal: () => void;
}

export class MPResultList extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <ListGroup>
          {this.props.selectedItem.measurementPointAnswers.map(mpAnswer => {
            return (
              <ListGroupItem key={mpAnswer.measurementPointID}>
                {mpAnswer.measurementPointID}
              </ListGroupItem>
            );
          })}
        </ListGroup>
        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle={this.props.colorButton}
            type="button"
            onClick={this.props.toggleModal}
          >
            {t('common:done')}
          </Button>
        </Col>
      </div>
    );
  }
}
