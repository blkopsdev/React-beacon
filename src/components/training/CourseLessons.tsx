import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import {
  ListGroup,
  ListGroupItem,
  Media,
  Col,
  Button,
  Row
} from 'react-bootstrap';
import { initialCourse } from 'src/reducers/initialState';
import {
  IshoppingCartProduct,
  GFCourse,
  GFLesson,
  Iuser,
  LessonProgress,
  IinitialState
} from 'src/models';
import { filter, sortBy } from 'lodash';
import {
  addLessonToCart,
  getLessonsByCourseID
} from 'src/actions/trainingActions';
import { toastr } from 'react-redux-toastr';
import { constants } from 'src/constants/constants';

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
  shoppingCartItem,
  addLesson
}: {
  shoppingCartItem: IshoppingCartProduct;
  addLesson: (item: IshoppingCartProduct, type: string) => void;
}) => (
  <Col md={3}>
    <Button
      bsStyle="warning"
      type="button"
      onClick={() => addLesson(shoppingCartItem, 'TRAINING')}
    >
      Buy Lesson <b>(${`${shoppingCartItem.cost / 100}`})</b>
    </Button>
  </Col>
);

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Props extends RouteComponentProps<RouterParams> {
  user: Iuser;
  filteredLessons: GFLesson[];
  getLessonsByCourseID: typeof getLessonsByCourseID;
  loading: boolean;
  selectedCourse: GFCourse;
  lessonProgress: { [key: string]: LessonProgress };
  addLessonToCart: typeof addLessonToCart;
  purchasedTraining: string[];
}
/*
  * printLesonsList prints the list of lessons.  Each lesson is conditionaly displayed if it is not protected or it is protected and all the previous
  * lessons are complete. Each lesson item conditionaly displays a buy button and prevents viewing or progress
  */

class CourseLessonsClass extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  componentWillMount() {
    // if we have a courseID then display the lessons in that course
    const { courseID } = this.props.match.params;

    if (!courseID) {
      console.warn('missing courseID when trying to view courseLessons');
      this.props.history.push('/training');
      return;
    }

    if (!this.props.filteredLessons.length) {
      this.props.getLessonsByCourseID(courseID, this.props.user);
    }
  }
  handleLessonClick = (gfLesson: GFLesson) => {
    if (!this.hasLessonBeenPurchased(gfLesson)) {
      toastr.warning(
        'Warning',
        'Please purchase this lesson.',
        constants.toastrWarning
      );
      return;
    }
    this.props.history.push(`${this.props.match.url}/${gfLesson.id}`);
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

  render() {
    // allLessonsComplete keeps track of all the previously complete lessons
    let allLessonsComplete = true;
    return (
      <div className="col-xs-12 lessons courses main-content content-without-sidebar student animated fadeIn">
        <Row>
          <Col xs={10} className="course-description">
            <p>{this.props.selectedCourse.description}</p>
          </Col>
        </Row>
        <div className="row courses-list">
          <ListGroup>
            {this.props.filteredLessons.map((gfLesson, index) => {
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
                if (!lp.isComplete && !gfLesson.isProtected) {
                  allLessonsComplete = false;
                }
              } else if (!gfLesson.isProtected) {
                allLessonsComplete = false;
              }

              return (
                <ListGroupItem className="lesson list-item" key={gfLesson.id}>
                  <Media>
                    <Col
                      md={gfLesson.score ? 6 : 9}
                      onClick={() => this.handleLessonClick(gfLesson)}
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
                    {this.hasLessonBeenPurchased(gfLesson) &&
                      gfLesson.primaryVideoPath.length > 0 && (
                        <ProgressColumn progress={progress} />
                      )}
                    {!this.hasLessonBeenPurchased(gfLesson) && (
                      <BuyColumn
                        shoppingCartItem={shoppingCartItem}
                        addLesson={this.props.addLessonToCart}
                      />
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
}

const mapStateToProps = (state: IinitialState, ownProps: Props) => {
  const selectedCourse =
    state.training.courses[ownProps.match.params.courseID] || initialCourse;
  let filteredLessons = filter(state.training.lessons, lesson => {
    const courseLesson = filter(lesson.courseLessons, {
      courseID: ownProps.match.params.courseID
    });
    return courseLesson.length ? true : false;
  });
  filteredLessons = sortBy(filteredLessons, (el: GFLesson) => {
    return el.courseLessons[0].order;
  });
  return {
    user: state.user,
    filteredLessons,
    selectedCourse,
    lessonProgress: state.training.lessonProgress,
    purchasedTraining: state.training.purchasedTraining,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  {
    getLessonsByCourseID,
    addLessonToCart
  }
)(CourseLessonsClass);
