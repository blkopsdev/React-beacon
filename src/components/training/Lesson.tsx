import * as React from 'react';
import { connect } from 'react-redux';
import { filter, isEmpty } from 'lodash';
import { GFQuizItem, GFLesson, GFCourse } from '../../models';

import {
  setLesson
  // setQuiz
} from '../../actions/trainingActions';

import {
  ListGroup,
  ListGroupItem,
  Media,
  Row,
  Col
  // Breadcrumb
} from 'react-bootstrap';
// const FontAwesome = require("react-fontawesome");
// const mixpanel = require("mixpanel-browser");

import { RouteComponentProps } from 'react-router';
import Player from '@vimeo/player';
interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Props extends RouteComponentProps<RouterParams> {
  user: any;
  courses: GFCourse[];
  lesson: GFLesson;
  lessons: GFLesson[];
  quiz: GFQuizItem;
  quizzes: GFQuizItem[];
  setLesson: typeof setLesson;
  setQuiz: any;
  loading: boolean;
  params: any;
}

interface State {
  primaryVideo: string;
  lessonQuizzes: GFQuizItem[]; // the quizzes for this lesson
  waitingCount: number;
}

class Lesson extends React.Component<Props, State> {
  private player: any;
  private pElem: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      primaryVideo: `https://player.vimeo.com/video/${
        this.props.lesson.primaryVideoPath
      }`,
      lessonQuizzes: [],
      waitingCount: 0
    };
    /* video embed URLS
    * YouTube: `https://www.youtube.com/embed/${this.props.lesson.secondaryVideoPath}?ecver=1` 
    * Wistia: `https://fast.wistia.net/embed/iframe/${this.props.lesson.secondaryVideoPath}?videoFoam=true`
    * Vimeo: `https://player.vimeo.com/video/${this.props.lesson.primaryVideoPath}`
    */

    this.handleChange = this.handleChange.bind(this);
    this.loadQuizzes = this.loadQuizzes.bind(this);
    this.goBack = this.goBack.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.backToCourses = this.backToCourses.bind(this);
    this.backToAllCourses = this.backToAllCourses.bind(this);
    this.displayLessonsHTML = this.displayLessonsHTML.bind(this);
  }

  componentWillMount() {
    // process the quizzes immediately
    this.loadQuizzes();
  }

  componentDidMount() {
    console.log('component did mount in lesson');
    if (
      !this.props.match.params.lessonID ||
      !this.props.match.params.courseID
    ) {
      // no lesson id and no coursID is not allowed
      this.props.history.replace(`/training`);
      return;
    }

    // Check to make sure we have already loaded courses, lessons and quizzes in redux
    if (
      isEmpty(this.props.courses) ||
      isEmpty(this.props.lessons) ||
      isEmpty(this.props.quizzes)
    ) {
      this.props.history.push(`/training`);
      return;
    }

    // Check to see if there is any lesson in redux
    // If there is a lesson we make sure it matches the lesson we are loading in the params otherwise
    // direct links will load whatever lesson is left in redux
    if (this.props.lesson.id !== this.props.match.params.lessonID) {
      this.setLesson(this.props.match.params.lessonID);
    }

    this.setUpPlayer();
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.quizzes !== this.props.quizzes) {
      this.loadQuizzes();
    }
    if (prevProps.lessons !== this.props.lessons) {
      this.setLesson(this.props.match.params.lessonID);
    }
  }

  componentWillUnmount() {
    if (typeof this.player !== 'undefined') {
      this.player.off('play');
      this.player.off('pause');
      this.player.off('timeupdate');
      this.player.off('seeked');
    }
  }

  setUpPlayer() {
    const options = {
      id: this.props.lesson.primaryVideoPath,
      width: this.pElem.offsetWidth < 723 ? this.pElem.offsetWidth : 723,
      loop: true
    };

    this.player = new Player('lessonPlayer', options);
    // this.player = new Player("lessonPlayer");
    this.player.ready().then(() => {
      // set up event listeners
      this.player.on('play', (data: any) => {
        console.log('PLAY:', data);
      });
      this.player.on('pause', (data: any) => {
        console.log('PAUSE:', data);
      });
      this.player.on('timeupdate', (data: any) => {
        console.log('TIMEUPDATE:', data);
      });
      this.player.on('seeked', (data: any) => {
        console.log('SEEKED:', data);
      });
    });
  }

  setLesson(lessonID: string) {
    const newLesson = this.props.lessons[lessonID];
    if (newLesson) {
      this.props.setLesson(
        this.props.lessons[this.props.match.params.lessonID]
      );
    } else {
      console.log('did not find lesson in Redux, loading lessons from API');
    }
  }

  loadQuizzes() {
    const lessonQuizzes = filter(this.props.quizzes, {
      lessonID: this.props.match.params.lessonID
    });
    this.setState({ lessonQuizzes } as State);
  }

  handleChange(e: any) {
    this.setState({ [e.target.name]: e.target.value } as State);
  }

  goBack() {
    this.props.history.replace(`/training/${this.props.match.params.courseID}`);
  }
  /*
  * start a quiz
  */
  startQuiz(gfQuiz: GFQuizItem, index: any) {
    // set the current active quiz item
    // mixpanel.track("Practice Exercise started", {
    //   quiz: gfQuiz.id,
    //   name: gfQuiz.name
    // });
    // as long as this quiz is not already set as the quiz in redux, set it
    if (!this.props.quiz || gfQuiz.id !== this.props.quiz.id) {
      this.props.setQuiz(gfQuiz);
    }
    const path = `/quiz/${this.props.match.params.courseID}/${
      this.props.match.params.lessonID
    }/${gfQuiz.id}`;
    this.props.history.push(path);
  }

  backToCourses() {
    this.props.history.replace(`/training/${this.props.match.params.courseID}`);
  }

  backToAllCourses() {
    this.props.history.push(`/training`);
  }

  displayLessonsHTML() {
    // let courseName;
    // if (this.props.user.id && this.props.lesson.id) {
    //   courseName = this.props.lesson.courseLessons[0].course.name;
    // }
    return (
      <div className="main-content content-without-sidebar lesson animated fadeIn">
        {/* <Row className="sub-header">
          <Col md={10} xs={10} className="gf-breadcrumb lesson">
            <Breadcrumb>
              <Breadcrumb.Item>
                <span onClick={this.backToCourses}>{courseName}</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item active={true}>
                {this.props.lesson.name}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row> */}
        <Row className="lesson-description">
          <Col
            md={12}
            sm={12}
            xs={12}
            dangerouslySetInnerHTML={{ __html: this.props.lesson.description }}
          />
        </Row>
        <Row className="lesson-list">
          <Col md={12} sm={12} xs={12} className="firstVideo text-center">
            <div
              id="lessonPlayer"
              style={{
                maxWidth: '100%'
              }}
              ref={ref => (this.pElem = ref)}
            />
          </Col>
        </Row>
        {this.state.lessonQuizzes.length !== 0 && (
          <h1>Diagnostic, Practice Exercises, and Post-Evaluation</h1>
        )}
        <ListGroup className="lesson-list">
          {this.state.lessonQuizzes.map((gfQuiz, index) => {
            let gfImage = gfQuiz.imagePath;
            if (gfQuiz.imagePath === null || gfQuiz.imagePath === '') {
              gfImage = require('../../images/Azure.png');
            }
            return (
              <ListGroupItem
                key={gfQuiz.id}
                onClick={() => {
                  this.startQuiz(gfQuiz, index);
                }}
              >
                <Media>
                  <Media.Left>
                    <img width={64} height={64} src={gfImage} alt="Image" />
                  </Media.Left>
                  <Media.Body>
                    <Media.Heading>{gfQuiz.name}</Media.Heading>
                  </Media.Body>
                  {gfQuiz.isComplete === true && (
                    <Media.Right>
                      {/* <FontAwesome name="circle 2x blue" /> */}
                    </Media.Right>
                  )}
                </Media>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  }
  render() {
    return this.displayLessonsHTML();
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    user: state.user,
    lessons: state.training.lessons,
    courses: state.training.courses,
    quiz: state.training.quiz,
    lesson: state.training.lesson,
    quizzes: state.training.quizzes,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  {
    setLesson
    // setQuiz,
  }
)(Lesson);
