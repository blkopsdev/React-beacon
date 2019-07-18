import * as React from 'react';
import {
  initialQuiz,
  initialLesson,
  intialQuizAnswer
} from '../../reducers/initialState';

import { connect } from 'react-redux';
import {
  GFQuizItem,
  GFLesson,
  GFCourse,
  Iuser,
  IinitialState,
  GFQuizAnswer
} from '../../models';
import { getLessonsByCourseID } from '../../actions/trainingActions';
import Question from './Question';

import { Row, Col, Alert } from 'react-bootstrap';
import { forEach } from 'lodash';

import { RouteComponentProps } from 'react-router';
import * as moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { constants } from 'src/constants/constants';
import {
  resetAnswers,
  saveQuizResult,
  getQuizzesByLessonID,
  addAnswer,
  setInProgressQuizID,
  startQuiz
} from 'src/actions/trainingQuizActions';
import { QuizButton } from './QuizButton';
import { QuizComplete } from './QuizComplete';

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
  quizzes: { [key: string]: GFQuizItem };
  getLessonsByCourseID: typeof getLessonsByCourseID;
  getQuizzesByLessonID: typeof getQuizzesByLessonID;
  saveQuizResult: any;
  loading: boolean;
  startQuiz: (id: string) => Promise<void>;
  resetAnswers: typeof resetAnswers;
  quizAnswers: GFQuizAnswer[];
  addAnswer: typeof addAnswer;
  quizComplete: boolean;
  setInProgressQuizID: typeof setInProgressQuizID;
  inProgressQuizID: string;
  startTime: string;
}

interface Iprops extends RouteComponentProps<RouterParams> {
  // Add your regular properties here
}

interface State {
  questionIndex: number;
  selectedAnswer: GFQuizAnswer;
  showCorrectAnswer: boolean;
  textAnswer: string;
  timeLeft: number;
  timeoutWarningShown: boolean;
}

class Quiz extends React.Component<Iprops & IdispatchProps, State> {
  quizLoading: boolean;
  quizLoadingTimeout: any;
  quizTimer: any;

  constructor(props: Iprops & IdispatchProps) {
    super(props);
    this.state = {
      questionIndex: 0,
      selectedAnswer: intialQuizAnswer,
      textAnswer: '',
      timeLeft: 0,
      timeoutWarningShown: false,
      showCorrectAnswer: false
    };

    this.quizLoading = false;
  }

  /*
  * When the component mounts we want to check for a quizID, if there is not one then we can not load a quiz, 
  * so send them back to the courses page
  * we need the lesson in order to show the breadcrumbs
  * then get the quiz
  */
  componentWillMount() {
    if (!this.props.match.params.quizID || !this.props.match.params.lessonID) {
      console.error('missing quizid or lessonid');
      this.props.history.replace(`/training`);
      return;
    }

    this.checkQuiz();
    this.checkLesson();

    // if we have answers and it is the same quizID, then reload
    // otherwise set the new quizID
    if (
      this.props.quizAnswers.length &&
      this.props.inProgressQuizID === this.props.match.params.quizID
    ) {
      this.reloadExistingQuiz();
    } else {
      this.props.resetAnswers();
      this.props.setInProgressQuizID(this.props.match.params.quizID);
    }
    /*
    * Handle Timed Quizzes
    */
    if (this.props.quiz.isTimed) {
      this.handleTimedQuiz();
    }
  }
  componentDidUpdate(prevProps: IdispatchProps) {
    if (this.props.quizAnswers !== prevProps.quizAnswers) {
      this.handleNewAnswer();
    }
  }
  componentWillUnmount() {
    clearInterval(this.quizTimer);
    this.props.resetAnswers(); // if the user intentionally navigates away, we reset the answers
    clearTimeout(this.quizLoadingTimeout);
  }

  /* 
    if the quiz with questions has not been loaded, then retrieve it. 
    (this will happen when handling a direct link)
    We do not have an endpoint to get the quiz by ID, so in order to get the quiz by ID 
    we have to use the endpoint that gets all the quizzes for the lesson.
    */
  checkQuiz = () => {
    if (!this.props.quiz.questions.length) {
      this.props.getQuizzesByLessonID(
        this.props.match.params.lessonID,
        this.props.user
      );
    }
  };
  checkLesson = () => {
    if (!this.props.lesson.id.length) {
      console.log('did not find lesson in Redux, loading lessons from API');
      this.props.getLessonsByCourseID(
        this.props.match.params.courseID,
        this.props.user
      );
    }
  };

  shouldShowCorrectAnswers = () => {
    if (this.props.quiz.isTimed) {
      return false;
    } else {
      return true;
    }
  };

  /*
  * User answered a question.  if show correct answers is Not enabled, then go to the next question
  if last question, then finish it
  */
  handleNewAnswer = () => {
    if (!this.shouldShowCorrectAnswers()) {
      if (this.props.quiz.questions.length === this.props.quizAnswers.length) {
        this.finishQuiz();
      } else {
        this.nextQuestion();
      }
    }
  };

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
      .utc(this.props.startTime)
      .add(constants.timedQuizHours, 'h')
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
    const howManyAnswered = this.props.quizAnswers.length;
    if (howManyAnswered >= this.props.quiz.questions.length) {
      const lastAnswer = this.props.quizAnswers[howManyAnswered - 1];
      this.setState({
        questionIndex: howManyAnswered - 1,
        textAnswer: lastAnswer.answer,
        selectedAnswer: lastAnswer,
        showCorrectAnswer: true
      });
    } else {
      this.setState({
        questionIndex: howManyAnswered
      });
    }
  };

  handleChange = (selectedAnswer: GFQuizAnswer) => {
    this.setState({ selectedAnswer });
  };

  retakeQuiz = () => {
    this.props.resetAnswers();

    // mixpanel.track('Retake Practice Exercise was clicked', {
    //   quizID: this.props.quiz.id,
    //   quizName: this.props.quiz.name
    // });
    this.setState({
      questionIndex: 0,
      selectedAnswer: intialQuizAnswer,
      showCorrectAnswer: false
    });
  };

  nextQuestion() {
    // prevent double tap
    if (this.isQuizLoading()) {
      return;
    }
    const newIndex = this.props.quizAnswers.length;
    this.setState({
      questionIndex: newIndex,
      selectedAnswer: intialQuizAnswer,
      showCorrectAnswer: false,
      textAnswer: ''
    });

    forEach(
      document.getElementsByName('optionsRadios'),
      (el: HTMLFormElement) => {
        el.checked = false;
      }
    );
  }

  isQuizLoading = () => {
    if (this.quizLoading) {
      return true;
    }
    this.quizLoading = true;
    this.quizLoadingTimeout = setTimeout(() => {
      this.quizLoading = false;
    }, 200);
    return false;
  };

  /*
  * The button on the question is a form submit in order to capture keyboard return key on the fill in the blank type questions
  * prevent double click
  * if we are taking a quiz that has showing correct answers enabled, then show the correct anser after each question
  * otherwise show the next question.
  */

  handleSubmit = (e: any) => {
    e.preventDefault();

    if (this.shouldShowCorrectAnswers()) {
      if (this.state.showCorrectAnswer) {
        if (
          this.props.quiz.questions.length === this.props.quizAnswers.length
        ) {
          this.finishQuiz();
        } else {
          this.nextQuestion();
        }
      } else {
        this.saveQuizAnswer();
        this.showCorrectAnswer();
      }
    } else {
      if (this.props.quiz.questions.length === this.props.quizAnswers.length) {
        // this happens if the previous finishQuiz failed for some reason
        this.finishQuiz();
      } else {
        this.saveQuizAnswer();
      }
    }
  };

  showCorrectAnswer = () => {
    if (this.isQuizLoading()) {
      return;
    }
    this.setState({ showCorrectAnswer: true });
  };

  saveQuizAnswer = () => {
    const answer: GFQuizAnswer = {
      questionID: this.props.quiz.questions[this.props.quizAnswers.length].id,
      answer: this.state.selectedAnswer.answer,
      isCorrect: this.state.selectedAnswer.isCorrect
    };
    this.props.addAnswer(answer);
  };

  finishQuiz = () => {
    // prevent double tap
    if (this.isQuizLoading()) {
      return;
    }

    this.props
      .saveQuizResult(this.props.quiz.id, this.props.quiz.name)
      .then(() => {
        this.setState({
          selectedAnswer: intialQuizAnswer,
          showCorrectAnswer: false,
          textAnswer: '',
          questionIndex: 0
        });
      });
  };

  render() {
    const { questionIndex } = this.state;
    let questions;
    let totQ;
    let curQ;
    if (this.props.quiz && this.props.quiz.id) {
      questions = this.props.quiz.questions;
      totQ = this.props.quiz.questions.length;
      curQ = questions[questionIndex];
    }
    const isLastQuestion =
      this.state.questionIndex + 1 === this.props.quiz.questions.length;

    return (
      <div>
        <div className="main-content content-without-sidebar quiz animated fadeIn">
          {/*
            * Display the Quiz Question and buttons
            */}
          {!this.props.quizComplete &&
            typeof curQ !== 'undefined' && (
              <div className="sub-header">
                <form id="quizForm" onSubmit={this.handleSubmit}>
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
                      showCorrectAnswer={this.state.showCorrectAnswer}
                      selectedAnswer={this.state.selectedAnswer}
                      textAnswer={this.state.textAnswer}
                      handleChange={this.handleChange}
                    />
                  </Row>
                  <Row className="button-row">
                    <Col md={5} sm={5} className="quiz-buttons">
                      <QuizButton
                        showCorrectAnswer={this.state.showCorrectAnswer}
                        isLastQuestion={isLastQuestion}
                        answer={this.state.selectedAnswer.answer}
                        loading={this.props.loading}
                        showCorrectAnswersEnabled={!this.props.quiz.isTimed}
                      />
                    </Col>
                    <Col md={7} sm={7}>
                      <div className="pull-right page-number">
                        {questionIndex + 1} of {totQ}
                      </div>
                    </Col>
                  </Row>
                </form>
              </div>
            )}
          {/*
            * Display the Completed Quiz Score
            */}
          {this.props.quizComplete && (
            <QuizComplete {...this.props} retakeQuiz={this.retakeQuiz} />
          )}
        </div>
        {/*
       * Display right or wrong
      */}
        {this.state.showCorrectAnswer &&
          !this.props.quizComplete && (
            <div className="animated slideInUp owl-image">
              {/* style={bubble} */}
              {this.state.selectedAnswer.isCorrect && (
                <p className="right bubble-text">
                  {(curQ && curQ.correctText) || 'correct'}
                </p>
              )}
              {!this.state.selectedAnswer.isCorrect && (
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
  const quiz =
    state.training.quizzes[ownProps.match.params.quizID] || initialQuiz;
  const lesson =
    state.training.lessons[ownProps.match.params.lessonID] || initialLesson;
  return {
    user: state.user,
    courses: state.training.courses,
    quiz,
    lesson,
    quizzes: state.training.quizzes,
    quizAnswers: state.training.quizAnswers,
    loading: state.ajaxCallsInProgress > 0,
    quizComplete: state.training.quizView.quizComplete,
    inProgressQuizID: state.training.quizView.inProgressQuizID,
    startTime: state.training.quizView.startTime
  };
};

export default connect(
  mapStateToProps,
  {
    getLessonsByCourseID,
    getQuizzesByLessonID,
    resetAnswers,
    saveQuizResult,
    startQuiz,
    addAnswer,
    setInProgressQuizID
  }
)(Quiz);
