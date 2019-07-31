import * as React from 'react';
import { connect } from 'react-redux';
import { filter, isEmpty } from 'lodash';
import {
  GFQuizItem,
  GFLesson,
  GFCourse,
  LessonProgress,
  Iuser,
  IinitialState
} from '../../models';

import { saveLessonProgress } from '../../actions/trainingActions';

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
import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { constants } from '../../constants/constants';
import { getQuizzesByLessonID } from '../../actions/trainingQuizActions';
import { initialLesson } from '../../reducers/initialState';

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface IdispatchProps {
  user: Iuser;
  courses: GFCourse[];
  lesson: GFLesson;
  lessons: GFLesson[];
  lessonQuizzes: GFQuizItem[];
  saveLessonProgress: typeof saveLessonProgress;
  getQuizzesByLessonID: typeof getQuizzesByLessonID;
  loading: boolean;
  progress: LessonProgress;
}

interface Props extends RouteComponentProps<RouterParams> {}

interface State {
  primaryVideo: string;
  waitingCount: number;
}

const saveTimeout = 15;

class Lesson extends React.Component<Props & IdispatchProps, State> {
  private player: any;
  private pElem: any;
  private timeSpent: any;
  private lastUpdate: any;
  private lastSave: any;
  constructor(props: Props & IdispatchProps) {
    super(props);
    this.state = {
      primaryVideo: `https://player.vimeo.com/video/${
        this.props.lesson.primaryVideoPath
      }`,
      waitingCount: 0
    };
    this.timeSpent = 0;
  }

  componentWillMount() {
    if (
      !this.props.match.params.lessonID ||
      !this.props.match.params.courseID
    ) {
      // no lesson id and no coursID is not allowed
      console.log('no lesson id or no coursID');
      this.props.history.replace(`/training`);
      return;
    }

    // Check to make sure we have already loaded courses, lessons and quizzes in redux
    if (isEmpty(this.props.courses) || isEmpty(this.props.lessons)) {
      console.log('have not loaded courses, lessons');
      this.props.history.push(`/training`);
      return;
    }
    this.props.getQuizzesByLessonID(
      this.props.match.params.lessonID,
      this.props.user
    );
  }
  componentDidMount() {
    if (this.props.lesson.primaryVideoPath.length > 0) {
      this.setUpPlayer();
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

  setUpPlayer = () => {
    const options = {
      id: parseInt(this.props.lesson.primaryVideoPath, 10),
      width: this.pElem.offsetWidth, // > 723 ? this.pElem.offsetWidth : 723,
      loop: false
    };

    this.player = new Player('lessonPlayer', options);
    // this.player = new Player("lessonPlayer");
    this.player
      .ready()
      .then(() => {
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
            userID: this.props.user.id,
            isComplete: false
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
            userID: this.props.user.id,
            isComplete: false
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
      })
      .catch((error: any) => {
        console.error(error);
        toastr.error(
          'Error',
          'Video failed to load. Please try again or contact support.',
          constants.toastrError
        );
      });
  };

  /*
  * start a quiz
  */
  startQuiz = (gfQuiz: GFQuizItem, skipTimedCheck: boolean = false) => {
    // set the current active quiz item
    // mixpanel.track("Practice Exercise started", {
    //   quiz: gfQuiz.id,
    //   name: gfQuiz.name
    // });

    if (gfQuiz.isTimed && !skipTimedCheck) {
      this.showTimedQuizMessage(gfQuiz);
      return;
    }

    const path = `/training/${this.props.match.params.courseID}/${
      this.props.match.params.lessonID
    }/${gfQuiz.id}`;
    this.props.history.push(path);
  };

  render() {
    return (
      <div className="main-content content-without-sidebar lesson animated fadeIn row">
        <Col xs={12}>
          <Row className="lesson-description">
            <Col
              md={12}
              sm={12}
              xs={12}
              dangerouslySetInnerHTML={{
                __html: this.props.lesson.description
              }}
            />
          </Row>
          <Row className="lesson-list">
            <Col md={12} sm={12} xs={12} className="firstVideo text-center">
              <div
                id="lessonPlayer"
                className="vimeo-player"
                ref={ref => (this.pElem = ref)}
              />
            </Col>
          </Row>
          <ListGroup className="lesson-list">
            {this.props.lessonQuizzes.map((gfQuiz, index) => {
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
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Props) => {
  const lesson =
    state.training.lessons[ownProps.match.params.lessonID] || initialLesson;
  const lessonQuizzes =
    filter(state.training.quizzes, {
      lessonID: ownProps.match.params.lessonID
    }) || [];

  return {
    user: state.user,
    lessons: state.training.lessons,
    courses: state.training.courses,
    lesson,
    lessonQuizzes,
    progress: state.training.lessonProgress[state.training.lesson.id],
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  {
    saveLessonProgress,
    getQuizzesByLessonID
  }
)(Lesson);
