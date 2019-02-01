import * as React from 'react';
import { filter, sortBy } from 'lodash';
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
  getPurchasedTraining,
  getQuizResults
} from '../../actions/trainingActions';

import {
  ListGroup,
  ListGroupItem,
  Media,
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
import Quiz from './Quiz';
import { TrainingCourse } from './TrainingCourse';
import { toastr } from 'react-redux-toastr';

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
  trainingCheckout: any;
  getPurchasedTraining: typeof getPurchasedTraining;
  closeAllModals: typeof closeAllModals;
  purchasedTraining: string[];
  getQuizResults: typeof getQuizResults;
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
    this.props.getQuizResults();
    const query = queryString.parse(this.props.location.search);
    console.log('query params', query, query.transactionNumber);

    // if we receive a transation number, that means we were recently redirected from a UTA transaction.  Now we need to actually checkout.
    if (query && query.transactionNumber && query.transactionNumber.length) {
      this.props.trainingCheckout(query.transactionNumber).then(() => {
        this.props.history.replace('/training');
      });
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
    if (prevProps.match.params.courseID !== this.props.match.params.courseID) {
      this.loadCourseLessons(this.props.match.params.courseID);
    }
  }
  componentWillUnmount() {
    this.props.closeAllModals();
  }

  /*
  * Get the lessons for the selected course and show them
  */
  loadCourseLessons = (gfCourseId: string) => {
    // get lessons
    const filteredLessons = filter(this.props.lessons, lesson => {
      const courseLesson = filter(lesson.courseLessons, {
        courseID: gfCourseId
      });
      return courseLesson.length ? true : false;
    });
    const sortedLessons = sortBy(filteredLessons, (el: GFLesson) => {
      return el.courseLessons[0].order;
    });
    const sc = this.props.courses.filter(
      (course: any) => course.id === gfCourseId
    )[0];
    // TODO why is this being called while the component is not mounted???
    if (sc) {
      this.setState({
        selectedCourse: sc,
        display: 'lessons',
        filteredLessons: sortedLessons
      });
    } else {
      console.error(
        'missing selected course',
        this.props.courses.length,
        gfCourseId
      );
      // TODO should we just set lessons?
      if (filteredLessons.length) {
        this.setState({ filteredLessons: sortedLessons });
      }
    }

    // if we do not have the lessons, then try one more time
    // maybe the user's plan is out of date
    if (!filteredLessons.length) {
      this.getLessonsByCourseID(gfCourseId);
    }
  };

  getLessonsByCourseID = (courseId: string) => {
    this.props.getLessonsByCourseID(courseId, this.props.user);
  };

  loadLessonAndQuizzes = (gfLesson: any) => {
    // mixpanel.track('Lesson clicked', {
    //   lesson: gfLesson.id,
    //   name: gfLesson.name
    // })
    // did they purchase this lesson?
    if (!this.hasLessonBeenPurchased(gfLesson)) {
      toastr.warning(
        'Warning',
        'Please purchase this lesson.',
        constants.toastrWarning
      );
      return;
    }
    this.props.setLesson(
      this.props.lessons[gfLesson.id]
      // this.props.lessons.filter((lesson: any) => lesson.id === gfLesson.id)[0]
    );
    window.scrollTo(0, 0);
    this.props.history.push(`${this.props.match.url}/${gfLesson.id}`);
  };

  handleChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value } as State);
  };

  goBack = () => {
    let path = ``;
    if (this.state.display === 'lessons') {
      this.setState({ display: 'courses' });
      path = `/training`;
    }
    this.props.history.push(path);
  };
  goToProgress = () => {
    this.props.history.push('/progress');
  };
  hasLessonBeenPurchased = (lesson: GFLesson) => {
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

  printStudentCourses = () => {
    return (
      <Col
        xs={12}
        key="courses"
        className="main-content content-without-sidebar courses animated fadeIn"
      >
        <Col xs={12} sm={12}>
          <div className="courses-tiles text-center">
            {this.props.courses.map(gfCourse => (
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
  shortenDescription = (text: string) => {
    let ret = text;
    const maxLength = 95;
    if (ret.length > maxLength) {
      ret = ret.substr(0, maxLength - 3) + '...';
    }
    return ret;
  };

  /*
  * printLesonsList prints the list of lessons.  Each lesson is conditionaly displayed if it is not protected or it is protected and all the previous
  * lessons are complete. Each lesson item conditionaly displays a buy button and prevents viewing or progress
  */
  printLessonsList = () => {
    // allLessonsComplete keeps track of all the previously complete lessons
    let allLessonsComplete = true;
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
    const QuizResultColumn = ({
      score,
      quizName
    }: {
      score: number;
      quizName: string;
    }) => (
      <Col md={3}>
        <span
          className="lesson-name lesson-progress"
          style={{
            color: score === 100 ? 'green' : 'inherit'
          }}
        >
          {`${quizName} ${score}%`}
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

    return (
      <div className="col-xs-12 lessons courses main-content content-without-sidebar student animated fadeIn">
        <Row>
          <Col xs={10} className="course-description">
            <p>{this.state.selectedCourse.description}</p>
          </Col>
        </Row>
        <div className="row courses-list">
          <ListGroup>
            {this.state.filteredLessons.map((gfLesson, index) => {
              if (gfLesson.isProtected && !allLessonsComplete) {
                return null;
              }
              let imagePath = gfLesson.imagePath;
              if (imagePath === null || imagePath === '') {
                imagePath = require('../../images/Azure.png');
              }
              const shoppingCartItem = { ...gfLesson, quantity: 1 };
              const lp = this.props.lessonProgress[gfLesson.id];
              let progress = 0;
              if (lp) {
                progress = lp.isComplete
                  ? 100
                  : Math.round((lp.timeSpent / lp.totalTime) * 99); // multiplying by 99 because we do not want to display 100% here.  display 100% only if .isComplete is true.
                if (!lp.isComplete) {
                  allLessonsComplete = false;
                }
              } else {
                allLessonsComplete = false;
              }

              return (
                <ListGroupItem className="lesson list-item" key={gfLesson.id}>
                  <Media>
                    <Col
                      md={gfLesson.score ? 6 : 9}
                      onClick={() => {
                        this.loadLessonAndQuizzes(gfLesson || '');
                      }}
                    >
                      <img width={32} height={32} src={imagePath} alt="Image" />
                      <span className="lesson-name">{gfLesson.name}</span>
                    </Col>
                    {gfLesson.score &&
                      gfLesson.quizName && (
                        <QuizResultColumn
                          score={gfLesson.score}
                          quizName={gfLesson.quizName}
                        />
                      )}
                    {this.hasLessonBeenPurchased(gfLesson) && (
                      <ProgressColumn progress={progress} />
                    )}
                    {!this.hasLessonBeenPurchased(gfLesson) && (
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
  };

  /*
  * figure out what to display, courses for students, courses for teachers, or a list of lessons after they select a course
  */
  displayCourseHtml = () => {
    let displayHtml = <div />;
    if (this.state.display === 'courses') {
      displayHtml = this.printStudentCourses();
    }
    if (this.state.display === 'lessons') {
      displayHtml = this.printLessonsList();
    }
    return displayHtml;
  };

  getBreadcrumbs = () => {
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
            {this.props.quiz.name}
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
  };

  getBannerTitle = () => {
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
  };

  render() {
    return (
      <Row className="training">
        <Col xs={12}>
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
              render={() => this.printLessonsList()}
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
      closeAllModals,
      getQuizResults
    }
  )(Courses)
);
