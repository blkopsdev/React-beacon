/*
* Training Breadcumb Container 
*/

import { connect } from 'react-redux';
import { IinitialState } from '../../models';
import { TrainingBreadcrumb } from './TrainingBreadcrumb';
import { RouteComponentProps } from 'react-router';
import {
  initialLesson,
  initialQuiz,
  initialCourse
} from '../../reducers/initialState';

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Iprops extends RouteComponentProps<RouterParams> {}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const quiz =
    state.training.quizzes[ownProps.match.params.quizID] || initialQuiz;
  const lesson =
    state.training.lessons[ownProps.match.params.lessonID] || initialLesson;
  const selectedCourse =
    state.training.courses[ownProps.match.params.courseID] || initialCourse;

  return {
    quiz,
    lesson,
    selectedCourse,
    loading: state.ajaxCallsInProgress > 0
  };
};

export const TrainingBreadcrumbContainer = connect(
  mapStateToProps,
  {}
)(TrainingBreadcrumb);
