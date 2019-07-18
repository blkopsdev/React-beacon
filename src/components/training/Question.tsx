import * as React from 'react';

import { Col, FormGroup, FormControl } from 'react-bootstrap';
import { GFQuizQuestion, GFQuizAnswer } from 'src/models';

interface Props extends React.Props<Question> {
  curQ: GFQuizQuestion;
  showCorrectAnswer: boolean;
  selectedAnswer: GFQuizAnswer;
  textAnswer: string;
  handleChange: (answer: GFQuizAnswer) => void;
}

class Question extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  buildOption(
    index: number,
    textHighlight: string,
    option: { option: string; isAnswer: boolean },
    rightOrWrong: string
  ) {
    let radioCheckBox;
    if (
      this.props.selectedAnswer.answer === option.option &&
      rightOrWrong === 'fa fa-check right-or-wrong check-mark'
    ) {
      radioCheckBox = 'check-box-correct text-center';
    } else if (
      this.props.selectedAnswer.answer === option.option &&
      rightOrWrong === 'fa fa-times checkmark right-or-wrong times-mark'
    ) {
      radioCheckBox = 'check-box-wrong text-center';
    } else {
      radioCheckBox = 'check-box text-center';
    }
    return (
      <div key={index} className="radio">
        <div className={textHighlight}>
          <label className="customRadio">
            <input
              type="radio"
              name={'optionsRadios'}
              value={option.option}
              disabled={this.props.showCorrectAnswer}
              onClick={(e: any) => {
                this.props.handleChange({
                  answer: option.option,
                  isCorrect: option.isAnswer,
                  questionID: this.props.curQ.id
                });
              }}
            />
            <span className={radioCheckBox}>
              <i className="fa fa-check" aria-hidden="true" />
            </span>
            {option.option}
          </label>
          <div className={rightOrWrong} />
        </div>
      </div>
    );
  }

  render() {
    const quizClassName = 'text-question';
    const teacherViewing = 'options';
    const textInputPlaceholder = 'Your answer...';

    const curQ = this.props.curQ;
    return (
      <div>
        {curQ.type === 'blank' && (
          <div className={quizClassName}>
            <Col md={12}>
              <div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: curQ.text.replace('**blank**', '__________')
                  }}
                />
              </div>
            </Col>
            <Col md={6} xs={6} className={teacherViewing}>
              <FormGroup className="quiz-text-field">
                <FormControl
                  placeholder={textInputPlaceholder}
                  value={this.props.selectedAnswer.answer}
                  type="text"
                  onChange={(e: any) => {
                    const val = e.target.value;
                    this.props.handleChange({
                      answer: val,
                      questionID: this.props.curQ.id,
                      isCorrect:
                        curQ.correctAnswer.toLowerCase().trim() ===
                        val.toLowerCase().trim()
                    });
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              {this.props.showCorrectAnswer &&
                !this.props.selectedAnswer.isCorrect && (
                  <div className="fa fa-times checkmark right-or-wrong times-mark text-input" />
                )}
              {this.props.showCorrectAnswer &&
                this.props.selectedAnswer.isCorrect && (
                  <div className="fa fa-check right-or-wrong check-mark text-input" />
                )}
            </Col>
            <Col md={12}>
              {this.props.showCorrectAnswer &&
                !this.props.selectedAnswer.isCorrect && (
                  <div className="text-input-wrong-answer">
                    <p>Correct Answer: {curQ.correctAnswer}</p>
                  </div>
                )}
            </Col>
          </div>
        )}
        {curQ.type === 'choice' && (
          <div className={quizClassName}>
            <Col md={12}>
              <div className={quizClassName}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: curQ.text.replace('**blank**', '__________')
                  }}
                />
              </div>
            </Col>
            <Col md={12} xs={12} className={teacherViewing}>
              {curQ.options.map((option, index) => {
                let textHighlight = '';
                let rightOrWrong = '';
                if (this.props.showCorrectAnswer === true) {
                  if (
                    this.props.selectedAnswer.isCorrect !== true &&
                    this.props.selectedAnswer.answer === option.option
                  ) {
                    // answer was selected and is wrong
                    textHighlight = 'wrong-answer';
                    // If you change this string on line 115 and line 118, make sure to make appropriate
                    // change to line 25 and 27 in buildOption
                    rightOrWrong =
                      'fa fa-times checkmark right-or-wrong times-mark';
                  } else if (option.isAnswer === true) {
                    textHighlight = 'right-answer';
                    rightOrWrong = 'fa fa-check right-or-wrong check-mark';
                  }
                }
                // TODO, I think I need to pass in the answer if I have it
                // if(textHighlight === 'right-answer' || textHighlight === 'wrong-answer') {
                //   selectingForm = true;
                // }
                return this.buildOption(
                  index,
                  textHighlight,
                  option,
                  rightOrWrong
                );
              })}
            </Col>
          </div>
        )}
      </div>
    );
  }
}

export default Question;
