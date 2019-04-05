/*
* Rich Text View
*/

import * as React from 'react';
import { TranslationFunction } from 'react-i18next';

import { Col, Button } from 'react-bootstrap';

interface Iprops {
  HTMLcontent: string;
  toggleModal: () => void;
  t: TranslationFunction;
  colorButton: string;
}

export const RichTextView = ({
  HTMLcontent,
  toggleModal,
  t,
  colorButton
}: Iprops) => (
  <div>
    <Col xs={12}>
      <div dangerouslySetInnerHTML={{ __html: HTMLcontent }} />
    </Col>
    <Col xs={12} className="form-buttons text-right">
      <Button bsStyle={colorButton} type="button" onClick={toggleModal}>
        {t('common:done')}
      </Button>
    </Col>
  </div>
);
