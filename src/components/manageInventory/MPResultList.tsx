import * as React from 'react';
import { TranslationFunction } from 'react-i18next';

import { ListGroup, ListGroupItem, Col, Button, Row } from 'react-bootstrap';
import {
  ImeasurementPointResult,
  ImeasurementPointAnswer,
  ImeasurementPoint
} from 'src/models';
import { getMeasurementPointList } from 'src/actions/manageMeasurementPointListsActions';
import { isEmpty } from 'lodash';
import { constants } from 'src/constants/constants';

interface Props {
  selectedItem: ImeasurementPointResult;
  colorButton: string;
  t: TranslationFunction;
  toggleModal: () => void;
  getMeasurementPointList: typeof getMeasurementPointList;
  measurementPointsByID: { [key: string]: ImeasurementPoint };
  locationString: string;
}

const AnswerListItem = (
  mpAnswer: ImeasurementPointAnswer,
  measurementPoint: ImeasurementPoint,
  t: TranslationFunction
) => {
  let AnswerElement = () => <div>no answer</div>;
  if (mpAnswer.numericValue !== null) {
    AnswerElement = () => <div>mpAnswer.numericValue</div>;
  }
  if (mpAnswer.pass !== null) {
    if (mpAnswer.pass === 1) {
      AnswerElement = () => (
        <div
          style={{ textTransform: 'uppercase', color: constants.colors.red }}
        >
          {t('fail')}
        </div>
      );
    } else if (mpAnswer.pass === 2) {
      AnswerElement = () => (
        <div
          style={{ textTransform: 'uppercase', color: constants.colors.green }}
        >
          {t('pass')}
        </div>
      );
    } else {
      AnswerElement = () => (
        <div style={{ textTransform: 'uppercase' }}>{t('N/A')}</div>
      );
    }
  }
  if (mpAnswer.textValue !== null) {
    AnswerElement = () => <div>{mpAnswer.textValue}</div>;
  }

  if (
    mpAnswer.measurementPointSelectOptionID !== null &&
    measurementPoint.selectOptions
  ) {
    const { selectOptions } = measurementPoint;
    const selectedOption = selectOptions.find(
      option => option.id === mpAnswer.measurementPointSelectOptionID
    ) || { label: '' };

    AnswerElement = () => <div>{selectedOption.label}</div>;
  }

  return (
    <ListGroupItem key={mpAnswer.measurementPointID}>
      <Row>
        <Col xs={8}>
          {measurementPoint.label} {measurementPoint.guideText}
        </Col>
        <Col xs={4} style={{ fontWeight: 'bolder', textAlign: 'right' }}>
          <AnswerElement />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <small>{mpAnswer.notes}</small>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export class MPResultList extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  componentWillMount() {
    this.props.getMeasurementPointList(
      this.props.selectedItem.measurementPointListID
    );
  }

  render() {
    const { t } = this.props;
    if (isEmpty(this.props.measurementPointsByID)) {
      return <h4>Loading...</h4>;
    }
    return (
      <div>
        <h5 style={{ paddingLeft: '15px', paddingBottom: '15px' }}>
          {this.props.locationString}
        </h5>
        <ListGroup>
          {this.props.selectedItem.measurementPointAnswers.map(mpAnswer => {
            const measurementPoint = this.props.measurementPointsByID[
              mpAnswer.measurementPointID
            ];
            return AnswerListItem(mpAnswer, measurementPoint, t);
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
