import * as React from 'react';
import { filter } from 'lodash';
import { connect } from 'react-redux';
import {
  Iuser,
  GFCourse,
  GFLesson,
  GFQuizItem,
  GFLessons,
  IinitialState,
  Itile,
  LessonProgress,
  IshoppingCart,
  IshoppingCartProduct
} from '../../models';
import {
  loadCourses,
  getLessonsByCourseID,
  setLesson,
  getAllLessons,
  getAllQuizzes,
  getAllLessonProgress,
  trainingCheckout,
  addCourseToCart,
  addLessonToCart,
  getPurchasedTraining
} from '../../actions/trainingActions';

import {
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
  Col,
  Button,
  Breadcrumb,
  Badge
} from 'react-bootstrap';
import queryString from 'query-string';

import { RouteComponentProps, Switch, Route } from 'react-router';
import Lesson from './Lesson';
import Banner from '../common/Banner';
import constants from '../../constants/constants';
import { emptyTile } from '../../reducers/initialState';
import ShoppingCartModal from '../shoppingCart/ShoppingCartModal';
import { toggleShoppingCartModal } from '../../actions/shoppingCartActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TranslationFunction } from 'i18next';
import { I18n, translate } from 'react-i18next';
import { getTotal } from 'src/reducers/cartReducer';
import TrainingCheckoutForm from './TrainingCheckoutForm';
import { closeAllModals } from 'src/actions/commonActions';

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Props extends RouteComponentProps<RouterParams> {
  user: Iuser;
  courses: GFCourse[];
  lessons: GFLessons;
  quizzes: { [key: string]: GFQuizItem };
  quiz: GFQuizItem;
  lesson: GFLesson;
  lessonProgress: { [key: string]: LessonProgress };
  loadCourses: any;
  getLessonsByCourseID: any;
  setLesson: any;
  loading: boolean;
  getAllLessons: typeof getAllLessons;
  getAllQuizzes: typeof getAllQuizzes;
  getAllLessonProgress: typeof getAllLessonProgress;
  toggleShoppingCartModal: typeof toggleShoppingCartModal;
  addCourseToCart: typeof addCourseToCart;
  addLessonToCart: typeof addLessonToCart;
  cartTotal: number;
  t: TranslationFunction;
  i18n: I18n;
  cart: IshoppingCart;
  trainingCheckout: typeof trainingCheckout;
  getPurchasedTraining: typeof getPurchasedTraining;
  closeAllModals: typeof closeAllModals;
  purchasedTraining: string[];
}

interface State {
  currentTile: Itile;
  display: string;
  selectedCourse: any;
  filteredLessons: GFLesson[];
}

class Courses extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTile: emptyTile,
      display: 'courses',
      selectedCourse: { name: '', description: '' },
      filteredLessons: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.printStudentCourses = this.printStudentCourses.bind(this);
    this.printLessonsList = this.printLessonsList.bind(this);
    this.loadCourseLessons = this.loadCourseLessons.bind(this);
    this.loadLessonAndQuizzes = this.loadLessonAndQuizzes.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goToProgress = this.goToProgress.bind(this);
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
    this.props.getAllQuizzes(this.props.user);
    this.props.getAllLessonProgress();
    this.props.getPurchasedTraining();
    const query = queryString.parse(this.props.location.search);
    console.log('query params', query, query.transactionNumber);

    // if we receive a transation number, that means we were recently redirected from a UTA transaction.  Now we need to actually checkout.
    if (query && query.transactionNumber && query.transactionNumber.length) {
      this.props.trainingCheckout(query.transactionNumber);
    }

    // }
    // if we have a courseID then display the lessons in that course
    // if (!!this.props.match.params.courseID) {
    //   this.loadCourseLessons(this.props.match.params.courseID);
    // } else {
    //   this.setState({ display: 'courses' });
    // }
  }

  componentWillReceiveProps(nextProps: any) {
    if (!nextProps.match.params.courseID) {
      this.setState({ display: 'courses' });
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.lessons !== this.props.lessons &&
      !!this.props.match.params.courseID
    ) {
      this.loadCourseLessons(this.props.match.params.courseID);
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * Get the lessons for the selected course and show them
  */
  loadCourseLessons(gfCourseId: string) {
    // get lessons
    const filteredLessons = filter(this.props.lessons, lesson => {
      const courseLesson = filter(lesson.courseLessons, {
        courseID: gfCourseId
      });
      return courseLesson.length ? true : false;
    });

    // replace current path so we know which course is selected
    const path = `/training/${gfCourseId}`;
    this.props.history.push(path);
    const sc = this.props.courses.filter(
      (course: any) => course.id === gfCourseId
    )[0];
    // TODO why is this being called while the component is not mounted???
    if (sc) {
      this.setState({
        selectedCourse: sc,
        display: 'lessons',
        filteredLessons
      });
    } else {
      console.error(
        'missing selected course',
        this.props.courses.length,
        gfCourseId
      );
      // TODO should we just set lessons?
      if (filteredLessons.length) {
        this.setState({ filteredLessons });
      }
    }

    // if we do not have the lessons, then try one more time
    // maybe the user's plan is out of date
    if (!filteredLessons.length) {
      this.getLessonsByCourseID(gfCourseId);
    }
  }

  getLessonsByCourseID(courseId: string) {
    this.props.getLessonsByCourseID(courseId, this.props.user);
  }

  loadLessonAndQuizzes(gfLesson: any) {
    // mixpanel.track('Lesson clicked', {
    //   lesson: gfLesson.id,
    //   name: gfLesson.name
    // })

    this.props.setLesson(
      this.props.lessons[gfLesson.id]
      // this.props.lessons.filter((lesson: any) => lesson.id === gfLesson.id)[0]
    );
    window.scrollTo(0, 0);
    this.props.history.push(`${this.props.match.url}/${gfLesson.id}`);
  }

  handleChange(e: any) {
    this.setState({ [e.target.name]: e.target.value } as State);
  }

  goBack() {
    let path = ``;
    if (this.state.display === 'lessons') {
      this.setState({ display: 'courses' });
      path = `/training`;
    }
    this.props.history.push(path);
  }
  goToProgress() {
    this.props.history.push('/progress');
  }

  printStudentCourses() {
    const showBuyButton = (id: string) =>
      this.props.purchasedTraining.indexOf(id) === -1;

    return (
      <div
        key="courses"
        className="main-content content-without-sidebar courses animated fadeIn"
      >
        <Row className="">
          <Col xs={12} sm={12}>
            <div className="courses-tiles text-center">
              {this.props.user.isActive &&
                this.props.courses.map(gfCourse => {
                  const shoppingCartItem = { ...gfCourse, quantity: 1 };
                  return (
                    <Col
                      key={gfCourse.id}
                      xs={12}
                      sm={4}
                      md={4}
                      className="course animated fadeInUp"
                    >
                      <Panel className="text-center">
                        <h2>{this.shortenTitle(gfCourse.name)}</h2>
                        {showBuyButton(gfCourse.id) && (
                          <span>
                            <Button
                              bsStyle="warning"
                              type="button"
                              onClick={() =>
                                this.props.addCourseToCart(
                                  shoppingCartItem,
                                  'TRAINING'
                                )
                              }
                            >
                              Purchase Entire Course
                            </Button>
                            <h4>${`${shoppingCartItem.cost / 100}`}</h4>
                          </span>
                        )}

                        <p className="purchase-text">
                          Save 25% by purchasing the entire course rather than
                          all the lessons individually
                        </p>
                        <div
                          className="course-footer"
                          onClick={() => {
                            this.loadCourseLessons(gfCourse.id || '');
                          }}
                        >
                          {'View Lessons'}
                        </div>
                      </Panel>
                    </Col>
                  );
                })}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  shortenDescription(text: string) {
    let ret = text;
    const maxLength = 95;
    if (ret.length > maxLength) {
      ret = ret.substr(0, maxLength - 3) + '...';
    }
    return ret;
  }

  shortenTitle(text: string) {
    let ret = text;
    const maxLength = 55;
    if (ret.length > maxLength) {
      ret = ret.substr(0, maxLength - 3) + '...';
    }
    return ret;
  }

  printLessonsList() {
    const ProgressColumn = ({ progress }: { progress: number }) => (
      <Col md={3}>
        <span
          className="lesson-name lesson-progress"
          style={{
            color: progress === 100 ? 'green' : 'inherit'
          }}
        >
          {`${progress}% Complete`}
        </span>
      </Col>
    );
    const BuyColumn = ({
      shoppingCartItem
    }: {
      shoppingCartItem: IshoppingCartProduct;
    }) => (
      <Col md={3}>
        <Button
          bsStyle="warning"
          type="button"
          onClick={() =>
            this.props.addLessonToCart(shoppingCartItem, 'TRAINING')
          }
        >
          Buy Lesson <b>(${`${shoppingCartItem.cost / 100}`})</b>
        </Button>
      </Col>
    );

    const showProgressColumn = (lesson: GFLesson) => {
      const lessonPurchased =
        this.props.purchasedTraining.indexOf(lesson.id) !== -1;
      let coursePurchased = false;
      lesson.courseLessons.forEach(cl => {
        if (this.props.purchasedTraining.indexOf(cl.courseID) !== -1) {
          coursePurchased = true;
        }
      });

      return lessonPurchased || coursePurchased;
    };
    return (
      <div className="courses main-content content-without-sidebar student animated fadeIn">
        <div className="row courses-list">
          <ListGroup className="col-md-12">
            {this.state.filteredLessons.map((gfLesson, index) => {
              let imagePath = gfLesson.imagePath;
              if (imagePath === null || imagePath === '') {
                imagePath = require('../../images/Azure.png');
              }
              const shoppingCartItem = { ...gfLesson, quantity: 1 };
              const progress = this.props.lessonProgress[gfLesson.id]
                ? this.props.lessonProgress[gfLesson.id].isComplete
                  ? 100
                  : this.props.lessonProgress[gfLesson.id].percentageComplete
                : 0;
              return (
                <ListGroupItem className="lesson list-item" key={gfLesson.id}>
                  <Media>
                    <Col
                      md={9}
                      onClick={() => {
                        this.loadLessonAndQuizzes(gfLesson || '');
                      }}
                    >
                      <img width={32} height={32} src={imagePath} alt="Image" />
                      <span className="lesson-name">{gfLesson.name}</span>
                    </Col>
                    {showProgressColumn(gfLesson) && (
                      <ProgressColumn progress={progress} />
                    )}
                    {!showProgressColumn(gfLesson) && (
                      <BuyColumn shoppingCartItem={shoppingCartItem} />
                    )}
                  </Media>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </div>
      </div>
    );
  }

  /*
  * figure out what to display, courses for students, courses for teachers, or a list of lessons after they select a course
  */
  displayCourseHtml() {
    let displayHtml = <div />;
    if (this.state.display === 'courses') {
      displayHtml = this.printStudentCourses();
    }
    if (this.state.display === 'lessons') {
      displayHtml = this.printLessonsList();
    }
    return displayHtml;
  }

  getBreadcrumbs() {
    if (!!this.props.match.params.quizID) {
      return (
        <Breadcrumb>
          <Breadcrumb.Item>
            <span
              onClick={() => {
                this.setState({ selectedCourse: {} });
                this.props.history.push('/training');
              }}
            >
              Training
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span
              onClick={() => {
                this.props.history.replace(
                  `/training/${this.props.match.params.courseID}`
                );
              }}
            >
              {this.state.selectedCourse.name}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span
              onClick={() => {
                this.props.history.replace(
                  `/training/${this.props.match.params.courseID}/${
                    this.props.match.params.lessonID
                  }`
                );
              }}
            >
              {this.props.lesson.name}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {this.props.lesson.name}
          </Breadcrumb.Item>
        </Breadcrumb>
      );
    }

    if (!!this.props.match.params.lessonID) {
      return (
        <Breadcrumb>
          <Breadcrumb.Item>
            <span
              onClick={() => {
                this.setState({ selectedCourse: {} });
                this.props.history.push('/training');
              }}
            >
              Training
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              {this.state.selectedCourse.name}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {this.props.lesson.name}
          </Breadcrumb.Item>
        </Breadcrumb>
      );
    }

    if (!!this.props.match.params.courseID) {
      return (
        <Breadcrumb>
          <Breadcrumb.Item>
            <span
              onClick={() => {
                this.setState({ selectedCourse: {} });
                this.props.history.goBack();
              }}
            >
              Training
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {this.state.selectedCourse.name}
          </Breadcrumb.Item>
        </Breadcrumb>
      );
    }

    return '';
  }

  getBannerTitle() {
    if (!!this.props.match.params.quizID) {
      return this.props.quiz.name;
    }
    if (!!this.props.match.params.lessonID) {
      return this.props.lesson.name;
    }
    if (!!this.props.match.params.courseID) {
      return this.state.selectedCourse.name;
    }
    return 'Training';
  }

  render() {
    return (
      <div className="manage-training">
        <Banner
          title={this.getBannerTitle()}
          img={this.state.currentTile.srcBanner}
          color={constants.colors[`${this.state.currentTile.color}`]}
        />
        <Button
          className="request-for-quote-cart-button"
          bsStyle="primary"
          onClick={() => this.props.toggleShoppingCartModal('TRAINING')}
        >
          <FontAwesomeIcon icon="shopping-cart" />
          <Badge>{this.props.cartTotal} </Badge>
        </Button>
        {this.getBreadcrumbs()}
        <Switch>
          {/* <Route exact path={`/training/:courseID/:lessonID/:quizID`} component={Lesson} /> */}
          <Route
            exact
            path={`/training/:courseID/:lessonID`}
            component={Lesson}
          />
          <Route
            exact
            path={`/training/:courseID`}
            render={() => this.printLessonsList()}
          />
          <Route
            exact
            path={`/training`}
            render={() => this.printStudentCourses()}
          />
        </Switch>
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
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Props) => {
  return {
    user: state.user,
    courses: state.training.courses,
    lessons: state.training.lessons,
    quizzes: state.training.quizzes,
    quiz: state.training.quiz,
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
      getLessonsByCourseID,
      setLesson,
      getAllLessons,
      getAllQuizzes,
      getAllLessonProgress,
      toggleShoppingCartModal,
      addCourseToCart,
      addLessonToCart,
      trainingCheckout,
      getPurchasedTraining,
      closeAllModals
    }
  )(Courses)
);
