import * as React from 'react';
// import UserAPI from "../../api/userAPI";
// import StudentAPI from "../../api/studentAPI";
// import constants from "../../constants";
import initialState from '../../reducers/initialState';

import { connect } from 'react-redux';
import {
  GFQuizItem,
  GFLesson,
  GFCourse,
  Iuser,
  IinitialState
} from '../../models';
import {
  getLessonsByCourseID,
  setLesson,
  // getQuizzesByLessonID,
  setQuiz,
  saveQuizResults,
  startQuiz
} from '../../actions/trainingActions';
// import Badge from '../course/Badge'
import Question from './Question';

import { Button, Row, Col, Alert } from 'react-bootstrap';
// import { toastr } from "react-redux-toastr";
import { forEach, isEmpty } from 'lodash';
// const mixpanel = require("mixpanel-browser");

// const txtBubble = require('../../images/Azure.png');

import { RouteComponentProps } from 'react-router';
import * as moment from 'moment';
import { toastr } from 'react-redux-toastr';
import constants from 'src/constants/constants';
import { LinkContainer } from 'react-router-bootstrap';

const TimeLeftBanner = ({ timeLeft }: { timeLeft?: number }) => {
  if (!timeLeft) {
    return null;
  }

  return (
    <Col xs={3} className="pull-right" style={{ height: '0' }}>
      <Alert bsStyle="warning">
        <strong>{timeLeft}</strong> minutes remaining
      </Alert>
    </Col>
  );
};

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface IdispatchProps {
  // Add your dispatcher properties here
  user: Iuser;
  quiz: GFQuizItem;
  courses: GFCourse[];
  lesson: GFLesson;
  lessons: GFLesson[];
  quizzes: GFQuizItem[];
  getLessonsByCourseID: typeof getLessonsByCourseID;
  // getQuizzesByLessonID: typeof getQuizzesByLessonID;
  setLesson: typeof setLesson;
  setQuiz: typeof setQuiz;
  saveQuizResults: typeof saveQuizResults;
  loading: boolean;
  startQuiz: (id: string) => Promise<void>;
}

interface Iprops extends RouteComponentProps<RouterParams> {
  // Add your regular properties here
}

interface State {
  questionIndex: number;
  selectedAnswer: any;
  checkingAnswer: boolean;
  quizComplete: boolean;
  textAnswer: string;
  currentQuiz: GFQuizItem;
  timeLeft: number;
  timeoutWarningShown: boolean;
}

class Quiz extends React.Component<Iprops & IdispatchProps, State> {
  savingQuiz: boolean;
  quizLoading: boolean;
  goingToNextQuestion: boolean;
  quizTimer: any;

  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      questionIndex: 0,
      selectedAnswer: {},
      checkingAnswer: false,
      quizComplete: false,
      textAnswer: '',
      currentQuiz: initialState.training.quiz,
      timeLeft: 0,
      timeoutWarningShown: false
    };

    this.savingQuiz = false;
    this.quizLoading = false;
    this.goingToNextQuestion = false;
  }

  /*
  * When the component mounts we want to check for a quizID, if there is not one then we can not load a quiz, 
  * so send them back to the courses page
  * we need the lesson in order to show the breadcrumbs
  * then get the quiz
  */
  componentDidMount() {
    if (!this.props.match.params.quizID || !this.props.match.params.lessonID) {
      console.error('missing quizid or lessonid');
      this.props.history.replace(`/training`);
      return;
    }
    // Check to make sure we have already loaded courses, lessons and quizzes in redux
    if (
      isEmpty(this.props.courses) ||
      isEmpty(this.props.lessons) ||
      isEmpty(this.props.quizzes)
    ) {
      console.error('missing courses, lessons, or quizzes');
      this.props.history.replace(`/training`);
      return;
    }

    // Check to see if there is any quiz in redux
    // If there is a quiz we make sure it matches the quiz we are loading in the params otherwise
    // direct links will load whatever quiz is left in redux
    if (
      this.props.quiz.id === this.props.match.params.quizID &&
      this.props.quiz.questions.length
    ) {
      this.loadQuiz(); // set the quiz to state
    } else {
      this.getQuizByID();
    }
    // Check to see if there is any lesson in redux
    // If there is a lesson we make sure it matches the lesson we are loading in the params otherwise
    // direct links will load whatever lesson is left in redux
    // if (this.props.lesson.id !== this.props.match.params.lessonID) {
    //   this.setLesson(this.props.match.params.lessonID);
    // }
    if (
      this.props.quiz &&
      this.props.quiz.id.length &&
      this.props.quiz.questions.length
    ) {
      this.reloadExistingQuiz();
    }
    /*
    * Handle Timed Quizzes
    */
    if (this.props.quiz.isTimed) {
      this.handleTimedQuiz();
    }
  }
  componentDidUpdate(prevProps: Iprops & IdispatchProps) {
    if (prevProps.quiz !== this.props.quiz) {
      this.loadQuiz();
    }
    // if (prevProps.quizzes !== this.props.quizzes) {
    //   this.getQuizByID();
    // }
    // if (prevProps.lessons !== this.props.lessons) {
    //   this.setLesson(this.props.match.params.lessonID);
    // }
  }

  componentWillUnmount() {
    if (this.state.quizComplete) {
      const questions = this.props.quiz.questions.map(q => {
        return Object.assign({}, q, { userAnswer: {} });
      });
      const quiz = Object.assign({}, this.props.quiz, { questions });
      this.props.setQuiz(quiz);
    }
    clearInterval(this.quizTimer);
  }

  /*
  * If timed, call the API to a) notify that the Quiz has started. b) can we start
  */
  handleTimedQuiz = () => {
    this.props
      .startQuiz(this.props.quiz.id)
      .then(() => {
        this.calculateTimeLeft(); // call it once in order to show the time left immediately
        this.quizTimer = setInterval(this.calculateTimeLeft, 3000);
      })
      .catch(() => {
        this.props.history.push(
          `/training/${this.props.match.params.courseID}/${
            this.props.match.params.lessonID
          }`
        );
      });
  };
  calculateTimeLeft = () => {
    const timeLeft = moment
      .utc(this.props.quiz.startTime)
      .add(constants.timedQuizHours, 'm') // TODO set to minutes temporarily to help us test
      .diff(moment(), 'minutes');

    this.setState({ timeLeft });

    if (timeLeft <= 5 && !this.state.timeoutWarningShown) {
      toastr.warning(
        'Almost out of time, please submit test as soon as possible.',
        '',
        constants.toastrWarning
      );
      this.setState({ timeoutWarningShown: true });
    }

    if (timeLeft <= 0) {
      toastr.error(
        'Out Of Time',
        'You have run out of time and are no longer able to submit this quiz',
        { ...constants.toastrError, timeOut: 0 }
      );
      this.props.history.push(
        `/training/${this.props.match.params.courseID}/${
          this.props.match.params.lessonID
        }`
      );
    }
  };

  /*
  * There is a quiz in progress, so lets reload it
  */
  reloadExistingQuiz = () => {
    window.scrollTo(0, 0);
    let i = 0;

    // count how many questions have been answered
    forEach(this.props.quiz.questions, (q, index) => {
      if (!!q.userAnswer && !!q.userAnswer.option) {
        i++;
      }
    });
    if (i >= this.props.quiz.questions.length) {
      // the user refreshed the page after completing the last question.  We don't know if they saved to the API or not
      // so lets assume they did not and show the last question answered and not editable.  this way they can try to re-save

      const lastQuestion = this.props.quiz.questions[i - 1];
      this.setState({
        questionIndex: i - 1,
        textAnswer: lastQuestion.userAnswer.option,
        selectedAnswer: lastQuestion.userAnswer,
        checkingAnswer: true,
        currentQuiz: this.props.quiz
      });
    } else {
      this.setState({
        questionIndex: i,
        currentQuiz: this.props.quiz
      });
    }
  };
  loadQuiz = () => {
    this.setState({ currentQuiz: this.props.quiz });
  };

  /*
  * First try to find the quiz in the quizzes redux store, then try to get it from the API.
  * We do not have an endpoint to get the quiz by ID, so in order to get the quiz by ID 
  * we have to use the endpoint that gets all the quizzes for the lesson.
  * 
  */
  getQuizByID = () => {
    const quiz = this.props.quizzes[this.props.match.params.quizID];
    if (!!quiz && quiz.questions.length) {
      this.props.setQuiz(quiz);
    } else {
      // Check to make sure we have already loaded courses, lessons and quizzes in redux
      if (
        isEmpty(this.props.courses) ||
        isEmpty(this.props.lessons) ||
        isEmpty(this.props.quizzes)
      ) {
        this.props.history.push(`/training`);
        return;
      }
    }
  };
  setLesson = (lessonID: string) => {
    const newLesson = this.props.lessons[lessonID];
    if (newLesson) {
      this.props.setLesson(
        this.props.lessons[this.props.match.params.lessonID]
      );
    } else {
      console.log('did not find lesson in Redux, loading lessons from API');
      this.props.getLessonsByCourseID(
        this.props.match.params.courseID,
        this.props.user
      );
    }
  };

  // showBadge(badge: GFBadge) {
  // const toastrOptions = {
  //   ...constants.toastrSuccessBadge,
  //   component: <Badge badge={badge} />,
  //   className: 'toast-badge'
  // }
  // toastr.success('', '', toastrOptions)
  // }

  handleChange = (option: any) => {
    // this.setState({ [e.target.name]: e.target.value });
    // it was set to option.option.trim();
    if (option.name === 'textAnswer') {
      this.setState({ textAnswer: option.option, selectedAnswer: option });
    } else {
      this.setState({ selectedAnswer: option });
    }
  };

  backToLesson = () => {
    this.props.history.replace(
      `/training/${this.props.match.params.courseID}/${
        this.props.match.params.lessonID
      }`
    );
  };

  backToCourses = () => {
    this.props.history.replace(`/training/${this.props.match.params.courseID}`);
  };

  retakeQuiz = () => {
    const questions = this.props.quiz.questions.map(q => {
      return Object.assign({}, q, { userAnswer: {} });
    });
    const quiz = Object.assign({}, this.props.quiz, { questions });
    this.props.setQuiz(quiz);

    // mixpanel.track("Retake Practice Exercise was clicked", {
    //   quizID: this.props.quiz.id,
    //   quizName: this.props.quiz.name
    // });
    this.setState({
      questionIndex: 0,
      selectedAnswer: {},
      checkingAnswer: false,
      quizComplete: false
    });
  };

  nextQuestion = () => {
    // TODO test for the last question and show results
    if (this.goingToNextQuestion) {
      return;
    }
    if (this.props.quiz.questions.length === this.state.questionIndex + 1) {
      this.finishQuiz();
      return;
    }
    this.goingToNextQuestion = true;
    setTimeout(() => {
      const newIndex = this.state.questionIndex + 1;
      this.goingToNextQuestion = false;
      this.setState({
        questionIndex: newIndex,
        selectedAnswer: {},
        checkingAnswer: false,
        textAnswer: ''
      });
    }, 200);

    forEach(
      document.getElementsByName('optionsRadios'),
      (el: HTMLFormElement) => {
        el.checked = false;
      }
    );
  };
  /*
    I need to click check answer and it triggers a statement that lets me know if the answer is wrong.
  */
  checkAnswer = (e: any) => {
    e.preventDefault();

    setTimeout(() => {
      this.quizLoading = false;
    }, 200);
    if (this.quizLoading) {
      return;
    }
    this.quizLoading = true;

    if (this.state.checkingAnswer) {
      this.nextQuestion();
      return;
    }

    // if timed quiz then skip displaying checked answer
    if (this.props.quiz.isTimed) {
      this.saveQuizAnswer();
      this.nextQuestion();
      return;
    }

    // Not a timed quiz, so go ahead and set checkingAnswer to true and save the quiz answer
    this.setState({
      checkingAnswer: true
    });
    // save user selection to redux quiz state
    this.saveQuizAnswer();
  };

  saveQuizAnswer = () => {
    const curQ = this.props.quiz.questions[this.state.questionIndex];
    const questions = [
      ...this.props.quiz.questions.map(q => {
        if (q.id === curQ.id) {
          return Object.assign({}, curQ, {
            userAnswer: this.state.selectedAnswer
          });
        } else {
          return q;
        }
      })
    ];
    const quiz = Object.assign({}, this.props.quiz, { questions });
    this.props.setQuiz(quiz);
    return quiz;
  };

  finishQuiz = () => {
    // if student, save the results to the api here, bypassing
    // redux flow since we do not need to update the store.
    // prevent doubl submission
    if (this.savingQuiz) {
      console.info('already saving quiz, returning');
      return;
    }
    this.savingQuiz = true;
    setTimeout(() => {
      this.savingQuiz = false;
    }, 1000);

    // if this is a timed quiz, we need to save the answer
    let quiz = this.props.quiz;
    if (this.props.quiz.isTimed) {
      quiz = this.saveQuizAnswer();
    }

    this.props.saveQuizResults(quiz, this.props.user);
    this.setState({
      selectedAnswer: {},
      checkingAnswer: false,
      quizComplete: true,
      textAnswer: '',
      currentQuiz: quiz,
      questionIndex: 0
    });
    // mixpanel.track("Finished Practice Exercise", {
    //   quizID: this.props.quiz.id,
    //   quizName: this.props.quiz.name
    // });
  };

  printScore = () => {
    let numCorrect = 0;
    const tot = this.state.currentQuiz.questions.length;
    forEach(this.state.currentQuiz.questions, q => {
      if (q.userAnswer && q.userAnswer.isAnswer) {
        numCorrect++;
      }
    });
    const score = (numCorrect / tot) * 100;
    let grade;
    let message;
    if (score >= 80 && score <= 100) {
      message =
        'Nice job!  It looks like you have a solid understanding of the material.  Keep it up!';
      grade = 'a';
    } else if (score >= 60 && score <= 79) {
      message =
        'Hmmm.  You missed a few.  Review the lesson, and try the exercise again.';
      grade = 'b';
    } else if (score >= 0 && score <= 59) {
      message =
        "It looks like you're still learning the material - don't give up.  Review the lesson one more time, and then make sure to see your teacher for some help.";
      grade = 'c';
    }
    return (
      <div>
        <Row>
          <Col
            md={10}
            mdOffset={1}
            sm={10}
            smOffset={1}
            xs={10}
            xsOffset={1}
            className="text-center"
          >
            <p>{message}</p>
          </Col>
        </Row>
        <div className="quiz-score">
          <h1 className={'quiz-score-' + grade}>{score.toFixed(0) + '%'}</h1>
          <p>
            {numCorrect} / {tot} correct.
          </p>
        </div>
      </div>
    );
  };

  backToAllCourses = () => {
    this.props.history.replace(`/training`);
  };

  render() {
    let questions;
    let totQ = 0;
    let qi = 0;
    let curQ;
    if (this.props.quiz && this.props.quiz.id) {
      questions = this.props.quiz.questions;
      totQ = this.props.quiz.questions.length;
      qi = this.state.questionIndex;
      curQ = questions[qi];
    }
    // const bubble = {
    //   backgroundImage: `url(${txtBubble})`
    // };

    return (
      <div>
        <div className="main-content content-without-sidebar quiz animated fadeIn">
          {/*
            * Display the Quiz Question and buttons
            */}
          {!this.state.quizComplete &&
            typeof curQ !== 'undefined' && (
              <div className="sub-header">
                <form id="quizForm" onSubmit={this.checkAnswer}>
                  <Row>
                    <Col
                      xs={this.state.timeLeft ? 9 : 12}
                      className="quiz-text-container"
                    >
                      <div className="text-instructions">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: this.props.quiz.instructions.replace(
                              '**blank**',
                              '__________'
                            )
                          }}
                        />
                      </div>
                    </Col>
                    <TimeLeftBanner timeLeft={this.state.timeLeft} />
                  </Row>
                  <Row>
                    <Question
                      curQ={curQ}
                      checkingAnswer={this.state.checkingAnswer}
                      selectedAnswer={this.state.selectedAnswer}
                      textAnswer={this.state.textAnswer}
                      handleChange={this.handleChange}
                    />
                  </Row>
                  <Row className="button-row">
                    <Col md={5} sm={5} className="quiz-buttons">
                      {!this.state.checkingAnswer &&
                        !this.props.quiz.isTimed && (
                          <Button
                            bsStyle="primary"
                            type="submit"
                            disabled={
                              this.state.selectedAnswer.option === undefined
                            }
                          >
                            Check
                          </Button>
                        )}
                      {(this.state.checkingAnswer || this.props.quiz.isTimed) &&
                        qi + 1 < totQ && (
                          <Button
                            bsStyle="primary"
                            className="next-button"
                            type="submit"
                          >
                            Next
                          </Button>
                        )}
                      {(this.state.checkingAnswer || this.props.quiz.isTimed) &&
                        qi + 1 === totQ && (
                          <Button
                            bsStyle="primary"
                            type="button"
                            onClick={this.finishQuiz}
                            disabled={this.props.loading}
                          >
                            Finish Exercise
                          </Button>
                        )}
                    </Col>
                    <Col md={7} sm={7}>
                      <div className="pull-right page-number">
                        {qi + 1} of {totQ}
                      </div>
                    </Col>
                  </Row>
                </form>
              </div>
            )}
          {/*
            * Display the Completed Quiz Score
            */}
          {this.state.quizComplete && (
            <div className="sub-header">
              <Row className="question">
                <Col md={12} sm={12} xs={12} className="text-center">
                  {this.printScore()}
                </Col>
              </Row>
              <Row className="question">
                <Col md={12} sm={12} xs={12} className="text-center">
                  {!this.props.quiz.isTimed && (
                    <Button
                      bsStyle="primary"
                      onClick={this.retakeQuiz}
                      className=""
                    >
                      Retake Exercise
                    </Button>
                  )}

                  <Button
                    bsStyle="primary"
                    onClick={this.backToLesson}
                    style={{ marginLeft: 10 }}
                  >
                    Return to Lesson
                  </Button>
                  <LinkContainer to="/dashboard" style={{ marginLeft: 10 }}>
                    <Button bsStyle="primary">Return to dashboard</Button>
                  </LinkContainer>
                </Col>
              </Row>
            </div>
          )}
        </div>
        {/*
       * Display right or wrong
      */}
        {this.state.checkingAnswer && (
          <div className="animated slideInUp owl-image">
            {/* style={bubble} */}
            {this.state.selectedAnswer.isAnswer && (
              <p className="right bubble-text">
                {(curQ && curQ.correctText) || 'correct'}
              </p>
            )}
            {!this.state.selectedAnswer.isAnswer && (
              <p className="wrong bubble-text">
                {(curQ && curQ.wrongText) || 'wrong'}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    courses: state.training.courses,
    quiz: state.training.quiz,
    lessons: state.training.lessons,
    lesson: state.training.lesson,
    quizzes: state.training.quizzes,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  {
    getLessonsByCourseID,
    setLesson,
    setQuiz,
    saveQuizResults,
    startQuiz
  }
)(Quiz);
