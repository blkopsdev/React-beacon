import * as React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RouteComponentProps } from 'react-router';
import { GFQuizAnswer } from '../../models';
import { calculateScore } from '../../actions/trainingQuizActions';

const getScoreString = (score: number) => {
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
  return { grade, message };
};

const QuizScore = ({ quizAnswers }: { quizAnswers: GFQuizAnswer[] }) => {
  const { score, numCorrect, tot } = calculateScore(quizAnswers);
  const { grade, message } = getScoreString(score);

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

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}
interface Iprops extends RouteComponentProps<RouterParams> {
  retakeQuiz: () => void;
  quizAnswers: GFQuizAnswer[];
}

export const QuizComplete = (props: Iprops) => {
  return (
    <div className="sub-header">
      <Row className="question">
        <Col md={12} sm={12} xs={12} className="text-center">
          <QuizScore quizAnswers={props.quizAnswers} />
        </Col>
      </Row>
      <Row className="complete-buttons">
        <Col md={12} sm={12} xs={12} className="text-center">
          <Button bsStyle="primary" onClick={props.retakeQuiz} className="">
            Retake Exercise
          </Button>
          <LinkContainer
            to={`/training/${props.match.params.courseID}/${
              props.match.params.lessonID
            }`}
          >
            <Button bsStyle="primary" style={{ marginLeft: 10 }}>
              Return to Lesson
            </Button>
          </LinkContainer>
          <LinkContainer to={`/training`}>
            <Button bsStyle="primary" style={{ marginLeft: 10 }}>
              Training Home
            </Button>
          </LinkContainer>
        </Col>
      </Row>
    </div>
  );
};
