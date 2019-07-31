/*
* Training Banner Container 
*/

import { connect } from 'react-redux';
import { IinitialState } from '../../models';
import { RouteComponentProps } from 'react-router';
import {
  initialLesson,
  initialQuiz,
  initialCourse
} from '../../reducers/initialState';
import Banner from '../common/Banner';

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Iprops extends RouteComponentProps<RouterParams> {
  img: any;
  color: string;
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const quiz =
    state.training.quizzes[ownProps.match.params.quizID] || initialQuiz;
  const lesson =
    state.training.lessons[ownProps.match.params.lessonID] || initialLesson;
  const selectedCourse =
    state.training.courses[ownProps.match.params.courseID] || initialCourse;
  const title = (): string => {
    if (quiz.name.length) {
      return quiz.name;
    }
    if (lesson.name.length) {
      return lesson.name;
    }
    if (selectedCourse.name.length) {
      return selectedCourse.name;
    }
    return 'Training';
  };
  return {
    title: title()
  };
};

export const TrainingBannerContainer = connect(
  mapStateToProps,
  {}
)(Banner);
