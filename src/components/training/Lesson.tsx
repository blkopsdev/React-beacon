import * as React from 'react';
import { connect } from 'react-redux';
import { filter, isEmpty } from 'lodash';
import { GFQuizItem, GFLesson, GFCourse, LessonProgress } from '../../models';

import {
  setLesson,
  saveLessonProgress,
  setQuiz,
  getQuizzesByLessonID
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
import * as moment from 'moment';
import { toastr } from 'react-redux-toastr';

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
  saveLessonProgress: typeof saveLessonProgress;
  setQuiz: typeof setQuiz;
  getQuizzesByLessonID: typeof getQuizzesByLessonID;
  loading: boolean;
  params: any;
  progress: LessonProgress;
}

interface State {
  primaryVideo: string;
  lessonQuizzes: GFQuizItem[]; // the quizzes for this lesson
  waitingCount: number;
}

const saveTimeout = 15;

class Lesson extends React.Component<Props, State> {
  private player: any;
  private pElem: any;
  private timeSpent: any;
  private lastUpdate: any;
  private lastSave: any;
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

    this.timeSpent = 0;
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
      console.log('no lesson id or no coursID allowed');
      this.props.history.replace(`/training`);
      return;
    }

    // Check to make sure we have already loaded courses, lessons and quizzes in redux
    if (
      isEmpty(this.props.courses) ||
      isEmpty(this.props.lessons) ||
      isEmpty(this.props.quizzes)
    ) {
      console.log('have not loaded courses, lessons, or quizzes');
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
      // this.loadQuizzes();
      const lessonQuizzes = filter(this.props.quizzes, {
        lessonID: this.props.match.params.lessonID
      });
      this.setState({ lessonQuizzes } as State);
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

  showTimedQuizMessage = (quiz: GFQuizItem) => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.startQuiz(quiz, true);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: 'start test',
      cancelText: 'cancel'
    };
    toastr.confirm(
      'This is a timed test. You have total of 3 attempts during 2 hours to complete/retake the test. Navigating away after starting the test counts as an attempt.',
      toastrConfirmOptions
    );
  };

  setUpPlayer() {
    const options = {
      id: this.props.lesson.primaryVideoPath,
      width: this.pElem.offsetWidth, // > 723 ? this.pElem.offsetWidth : 723,
      loop: false
    };

    this.player = new Player('lessonPlayer', options);
    // this.player = new Player("lessonPlayer");
    this.player.ready().then(() => {
      // set up event listeners
      this.player.on('play', (data: any) => {
        // console.log('PLAY:', data);
      });
      this.player.on('pause', (data: any) => {
        // console.log('PAUSE:', data);
        this.lastUpdate = null;
      });
      this.player.on('ended', (data: any) => {
        const now = moment().unix();
        this.lastSave = now;
        this.lastUpdate = now;
        const progress: LessonProgress = {
          lessonID: this.props.lesson.id,
          currentTime: data.seconds,
          percentageComplete: data.percent * 100,
          totalTime: data.duration,
          timeSpent:
            this.timeSpent < data.duration ? this.timeSpent : data.duration,
          userID: this.props.user.id
        };
        this.props.saveLessonProgress(progress);
      });
      this.player.on('timeupdate', (data: any) => {
        // increment our TimeSpent variable on each timeupdate event.
        // this will track total time spent playing the video, regardless of seeks, etc
        const now = moment().unix();
        if (!this.lastUpdate) {
          this.lastUpdate = now;
        } else {
          this.timeSpent += now - this.lastUpdate;
          this.lastUpdate = now;
        }
        const progress: LessonProgress = {
          lessonID: this.props.lesson.id,
          currentTime: data.seconds,
          percentageComplete: data.percent * 100,
          totalTime: data.duration,
          timeSpent:
            this.timeSpent < data.duration ? this.timeSpent : data.duration,
          userID: this.props.user.id
        };
        // console.log('TIMEUPDATE:', progress);

        if (!this.lastSave) {
          this.lastSave = now;
        }
        if (now - this.lastSave >= saveTimeout) {
          this.props.saveLessonProgress(progress);
          this.lastSave = now;
        }
      });
      this.player.on('seeked', (data: any) => {
        // console.log('SEEKED:', data);
      });

      if (this.props.progress) {
        // set timeSpent
        this.timeSpent = this.props.progress.timeSpent;
        // seek to last played time
        this.player.setCurrentTime(this.props.progress.currentTime);
      }
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
    this.props.getQuizzesByLessonID(
      this.props.match.params.lessonID,
      this.props.user
    );
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
  startQuiz(gfQuiz: GFQuizItem, skipTimedCheck: boolean = false) {
    // set the current active quiz item
    // mixpanel.track("Practice Exercise started", {
    //   quiz: gfQuiz.id,
    //   name: gfQuiz.name
    // });

    if (gfQuiz.isTimed && !skipTimedCheck) {
      this.showTimedQuizMessage(gfQuiz);
      return;
    }
    // as long as this quiz is not already set as the quiz in redux, set it
    if (!this.props.quiz || gfQuiz.id !== this.props.quiz.id) {
      this.props.setQuiz(gfQuiz);
    }
    const path = `/training/${this.props.match.params.courseID}/${
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
    return (
      <div className="main-content content-without-sidebar lesson animated fadeIn">
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
                  this.startQuiz(gfQuiz);
                }}
              >
                <Media>
                  <Media.Left>
                    <img width={32} height={32} src={gfImage} alt="Image" />
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
    progress: state.training.lessonProgress[state.training.lesson.id],
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  {
    setLesson,
    saveLessonProgress,
    setQuiz,
    getQuizzesByLessonID
  }
)(Lesson);
