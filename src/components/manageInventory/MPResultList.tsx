import * as React from 'react';
import { translate } from 'react-i18next';

import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { ImeasurementPointResult } from 'src/models';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  selectedItem: ImeasurementPointResult;
}

class MPResultListClass extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
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
      </div>
    );
  }
}

export const MPResultList = translate('measurementPointResults')(
  MPResultListClass
);
