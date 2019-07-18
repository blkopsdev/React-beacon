import * as React from 'react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import {
  Iuser,
  GFCourse,
  IinitialState,
  Itile,
  IshoppingCart
} from '../../models';
import {
  loadCourses,
  setLesson,
  getAllLessons,
  getAllLessonProgress,
  trainingCheckout,
  addCourseToCart,
  addLessonToCart,
  getPurchasedTraining,
  getQuizResults
} from '../../actions/trainingActions';

import { Row, Col, Button, Badge } from 'react-bootstrap';
import queryString from 'query-string';

import { RouteComponentProps, Switch, Route } from 'react-router';
import Lesson from './Lesson';
import { constants } from 'src/constants/constants';
import { emptyTile } from '../../reducers/initialState';
import ShoppingCartModal from '../shoppingCart/ShoppingCartModal';
import { toggleShoppingCartModal } from '../../actions/shoppingCartActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TranslationFunction } from 'i18next';
import { I18n, translate } from 'react-i18next';
import { getTotal } from 'src/reducers/cartReducer';
import TrainingCheckoutForm from './TrainingCheckoutForm';
import { closeAllModals } from 'src/actions/commonActions';
import Quiz from './Quiz';
import { TrainingCourse } from './TrainingCourse';
import CourseLessons from './CourseLessons';
import { TrainingBreadcrumbContainer } from './TrainingBreadcrumbContainer';
import { TrainingBannerContainer } from './TrainingBannerContainer';

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Props extends RouteComponentProps<RouterParams> {
  user: Iuser;
  courses: { [key: string]: GFCourse };
  loadCourses: any;
  setLesson: any;
  loading: boolean;
  getAllLessons: typeof getAllLessons;
  getAllLessonProgress: typeof getAllLessonProgress;
  toggleShoppingCartModal: typeof toggleShoppingCartModal;
  addCourseToCart: typeof addCourseToCart;
  addLessonToCart: typeof addLessonToCart;
  cartTotal: number;
  t: TranslationFunction;
  i18n: I18n;
  cart: IshoppingCart;
  trainingCheckout: any;
  getPurchasedTraining: typeof getPurchasedTraining;
  closeAllModals: typeof closeAllModals;
  purchasedTraining: string[];
  getQuizResults: typeof getQuizResults;
}

interface State {
  currentTile: Itile;
}

class Courses extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTile: emptyTile
    };
  }
  componentWillMount() {
    this.props.closeAllModals();
    this.setState({
      currentTile: constants.getTileByURL(this.props.location.pathname)
    });
  }

  componentDidMount() {
    // TODO get updated courses based on time like we are doing in App.tsx in GrammarFlip.  for now we will get them every time.
    // if (!this.props.courses.length) {
    this.props.loadCourses(this.props.user);
    this.props.getAllLessons(this.props.user);
    this.props.getAllLessonProgress();
    this.props.getPurchasedTraining();
    this.props.getQuizResults();
    const query = queryString.parse(this.props.location.search);

    // if we receive a transation number, that means we were recently redirected from a UTA transaction.  Now we need to actually checkout.
    if (query && query.transactionNumber && query.transactionNumber.length) {
      this.props
        .trainingCheckout(query.transactionNumber)
        .then(() => {
          this.props.history.replace('/training');
        })
        .catch((error: any) => console.error(error));
    }
  }

  componentWillUnmount() {
    this.props.closeAllModals();
  }

  printStudentCourses = () => {
    return (
      <Col
        xs={12}
        key="courses"
        className="main-content content-without-sidebar courses animated fadeIn"
      >
        <Col xs={12} sm={12}>
          <div className="courses-tiles text-center">
            {map(this.props.courses, gfCourse => (
              <TrainingCourse
                course={gfCourse}
                purchasedTraining={this.props.purchasedTraining}
                addCourseToCartCallback={this.props.addCourseToCart}
              />
            ))}
          </div>
        </Col>
      </Col>
    );
  };

  render() {
    return (
      <Row className="training">
        <Col xs={12}>
          <TrainingBannerContainer
            img={this.state.currentTile.srcBanner}
            color={this.state.currentTile.color}
            match={this.props.match}
            history={this.props.history}
            location={this.props.location}
            staticContext={this.props.staticContext}
          />
          <Button
            className="request-for-quote-cart-button"
            bsStyle="primary"
            onClick={() => this.props.toggleShoppingCartModal('TRAINING')}
          >
            <FontAwesomeIcon icon="shopping-cart" />
            <Badge>{this.props.cartTotal} </Badge>
          </Button>
          <TrainingBreadcrumbContainer
            match={this.props.match}
            history={this.props.history}
            location={this.props.location}
            staticContext={this.props.staticContext}
          />
          <Switch>
            <Route
              exact
              path={`/training/:courseID/:lessonID/:quizID`}
              component={Quiz}
            />
            <Route
              exact
              path={`/training/:courseID/:lessonID`}
              component={Lesson}
            />
            <Route
              exact
              path={`/training/:courseID`}
              component={CourseLessons}
            />
            <Route
              exact
              path={`/training`}
              render={() => this.printStudentCourses()}
            />
          </Switch>
        </Col>
        <ShoppingCartModal
          colorButton={
            constants.colors[`${this.state.currentTile.color}Button`]
          }
          t={this.props.t}
          cart={this.props.cart}
          title={this.props.t('training:shoppingCartTitle')}
          cartName="TRAINING"
          showCost={true}
          ShoppingCartForm={TrainingCheckoutForm}
        />
      </Row>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Props) => {
  return {
    user: state.user,
    courses: state.training.courses,
    lesson: state.training.lesson,
    purchasedTraining: state.training.purchasedTraining,
    lessonProgress: state.training.lessonProgress,
    loading: state.ajaxCallsInProgress > 0,
    cartTotal: getTotal(state.training.cart),
    cart: state.training.cart
  };
};

export default translate('training')(
  connect(
    mapStateToProps,
    {
      loadCourses,
      setLesson,
      getAllLessons,
      getAllLessonProgress,
      toggleShoppingCartModal,
      addCourseToCart,
      addLessonToCart,
      trainingCheckout,
      getPurchasedTraining,
      closeAllModals,
      getQuizResults
    }
  )(Courses)
);
