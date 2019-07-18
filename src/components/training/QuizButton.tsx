/*
* QuizButton - decide which button to show and handle the disabled state.  
* Check - show if we are showing correctAnswers and the question is unanswered
*/

import * as React from 'react';
import { Button } from 'react-bootstrap';

interface Iprops {
  showCorrectAnswer: boolean;
  showCorrectAnswersEnabled: boolean;
  isLastQuestion: boolean;
  answer: string;
  loading: boolean;
}

export const QuizButton = (props: Iprops) => {
  const {
    isLastQuestion,
    showCorrectAnswer,
    answer,
    showCorrectAnswersEnabled
  } = props;

  if (!showCorrectAnswer && showCorrectAnswersEnabled) {
    return (
      <Button bsStyle="primary" type="submit" disabled={answer.length === 0}>
        Check
      </Button>
    );
  } else if (
    (showCorrectAnswer || !showCorrectAnswersEnabled) &&
    !isLastQuestion
  ) {
    return (
      <Button
        bsStyle="primary"
        className="next-button"
        type="submit"
        disabled={!showCorrectAnswersEnabled && answer.length === 0}
      >
        Next
      </Button>
    );
  } else if (
    (showCorrectAnswer || !showCorrectAnswersEnabled) &&
    isLastQuestion
  ) {
    return (
      <Button
        bsStyle="primary"
        type="submit"
        disabled={
          props.loading ||
          (showCorrectAnswersEnabled === false && answer.length === 0)
        }
      >
        Finish Exercise
      </Button>
    );
  } else {
    return null;
  }
};
