import * as React from 'react';
import { filter } from 'lodash';
import { connect } from 'react-redux';
import {
  Iuser,
  GFCourse,
  GFLesson,
  GFQuizItem,
  GFLessons,
  IinitialState
} from '../../models';
import {
  loadCourses,
  getLessonsByCourseID,
  setLesson
} from '../../actions/trainingActions';

import {
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Grid,
  Row,
  Col
} from 'react-bootstrap';

import { RouteComponentProps } from 'react-router';
// const mixpanel = require('mixpanel-browser')

interface RouterParams {
  courseID: string;
}

interface Props extends RouteComponentProps<RouterParams> {
  user: Iuser;
  courses: GFCourse[];
  lessons: GFLessons;
  quizzes: { [key: string]: GFQuizItem };
  loadCourses: any;
  getLessonsByCourseID: any;
  setLesson: any;
  loading: boolean;
}

interface State {
  display: string;
  selectedCourse: any;
  filteredLessons: GFLesson[];
}

class Courses extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    if (!this.props.courses.length) {
      this.getAllCourses();
    }
    // if we have a courseID then display the lessons in that course
    if (!!this.props.match.params.courseID) {
      this.loadCourseLessons(this.props.match.params.courseID);
    } else {
      this.setState({ display: 'courses' });
    }
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

  getAllCourses() {
    this.props.loadCourses(this.props.user);
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
    this.props.history.replace(path);
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
    // this.props.history.push(`/lesson/${this.props.match.params.courseID}/${gfLesson.id}`)
  }

  handleChange(e: any) {
    this.setState({ [e.target.name]: e.target.value } as State);
  }

  goBack() {
    let path = ``;
    if (this.state.display === 'lessons') {
      this.setState({ display: 'courses' });
      path = `/courses`;
    }
    this.props.history.push(path);
  }
  goToProgress() {
    this.props.history.push('/progress');
  }

  printStudentCourses() {
    return (
      <div
        key="courses"
        className="main-content content-without-sidebar courses animated fadeIn"
      >
        <Row className="sub-header">
          <Col md={12} xs={12}>
            <h1 className="text-center">Training</h1>
          </Col>
        </Row>
        <Row className="">
          <Col xs={12} sm={12}>
            <div className="courses-list text-center">
              {this.props.user.isActive &&
                this.props.courses.map(gfCourse => {
                  return (
                    <Col
                      key={gfCourse.id}
                      onClick={() => {
                        this.loadCourseLessons(gfCourse.id || '');
                      }}
                      xs={12}
                      sm={4}
                      md={4}
                      className="course animated fadeInUp"
                    >
                      <Panel className="text-center">
                        <h2>{this.shortenTitle(gfCourse.name)}</h2>
                        <h4>{this.shortenDescription(gfCourse.description)}</h4>
                        <div className="course-footer" />
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
    return (
      <div className="courses main-content content-without-sidebar student animated fadeIn">
        <div className="row sub-header">
          <Col md={12}>
            <h1 className="text-center">{this.state.selectedCourse.name}</h1>
            <h3 className="text-center">
              {this.state.selectedCourse.description}
            </h3>
          </Col>
        </div>
        <div className="row courses-list">
          <ListGroup className="col-md-12">
            {this.state.filteredLessons.map((gfLesson, index) => {
              let imagePath = gfLesson.imagePath;
              if (imagePath === null || imagePath === '') {
                imagePath = require('../../images/Azure.png');
              }
              return (
                <ListGroupItem className="lesson list-item" key={gfLesson.id}>
                  <Media>
                    <Col
                      md={11}
                      onClick={() => {
                        this.loadLessonAndQuizzes(gfLesson || '');
                      }}
                    >
                      <img width={64} height={64} src={imagePath} alt="Image" />
                      <span className="lesson-name">{gfLesson.name}</span>
                    </Col>
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

  render() {
    return (
      <Grid className="content modal-container">
        {this.displayCourseHtml()}
      </Grid>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: any) => {
  return {
    user: state.user,
    courses: state.training.courses,
    lessons: state.training.lessons,
    quizzes: state.training.quizzes,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  {
    loadCourses,
    getLessonsByCourseID,
    setLesson
  }
)(Courses);
