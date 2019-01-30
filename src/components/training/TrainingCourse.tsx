import { GFCourse } from 'src/models';
import { addCourseToCart } from 'src/actions/trainingActions';
import * as React from 'react';
import { Col, Panel, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NumberFormat from 'react-number-format';

const shortenTitle = (text: string) => {
  let ret = text;
  const maxLength = 70;
  if (ret.length > maxLength) {
    ret = ret.substr(0, maxLength - 3) + '...';
  }
  return ret;
};

export const TrainingCourse = ({
  course,
  purchasedTraining,
  addCourseToCartCallback
}: {
  course: GFCourse;
  addCourseToCartCallback: typeof addCourseToCart;
  purchasedTraining: string[];
}) => {
  const showBuyButton = (id: string) => purchasedTraining.indexOf(id) === -1;

  const shoppingCartItem = { ...course, quantity: 1 };

  if (course.onSite) {
    return (
      <Col
        key={course.id}
        xs={12}
        sm={4}
        md={4}
        className="course animated fadeInUp"
      >
        <Panel className="text-center">
          <h3 style={{ fontSize: '20px', lineHeight: '28px' }}>
            {shortenTitle(course.name)}
          </h3>
          {showBuyButton(course.id) && (
            <span>
              <Button
                bsStyle="warning"
                type="button"
                onClick={() =>
                  addCourseToCartCallback(shoppingCartItem, 'TRAINING')
                }
              >
                Purchase Entire Course
              </Button>
              <h4>
                <NumberFormat
                  value={shoppingCartItem.cost / 100}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
              </h4>
            </span>
          )}
          <LinkContainer to={`training/${course.id}`}>
            <div className="course-footer">{'View Course Description'}</div>
          </LinkContainer>
        </Panel>
      </Col>
    );
  } else {
    return (
      <Col
        key={course.id}
        xs={12}
        sm={4}
        md={4}
        className="course animated fadeInUp"
      >
        <Panel className="text-center">
          <h3 style={{ fontSize: '20px', lineHeight: '28px' }}>
            {shortenTitle(course.name)}
          </h3>
          {showBuyButton(course.id) && (
            <span>
              <Button
                bsStyle="warning"
                type="button"
                onClick={() =>
                  addCourseToCartCallback(shoppingCartItem, 'TRAINING')
                }
              >
                Purchase Entire Course
              </Button>
              <h4>
                <NumberFormat
                  value={shoppingCartItem.cost / 100}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
              </h4>
            </span>
          )}

          <p className="purchase-text">
            Save 25% by purchasing the entire course rather than all the lessons
            individually
          </p>
          <LinkContainer to={`training/${course.id}`}>
            <div className="course-footer">{'View Lessons'}</div>
          </LinkContainer>
        </Panel>
      </Col>
    );
  }
};
