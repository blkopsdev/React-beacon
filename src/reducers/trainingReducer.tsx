import * as types from '../actions/actionTypes';
import initialState, { initialLesson, initialQuiz } from './initialState';
import { keyBy } from 'lodash';
import {
  GFLesson,
  GFLessons,
  ItrainingReducer,
  GFQuizItem,
  GFCourse,
  LessonProgress
} from 'src/models';
import cartReducer, { getQuantity } from './cartReducer';
import { modalToggleWithName } from './commonReducers';

function courseReducer(state: GFCourse[] = [], action: any): GFCourse[] {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      return action.courses;
    case types.USER_LOGOUT_SUCCESS:
      return [];

    default:
      return state;
  }
}

function lessonReducer(state: GFLesson = initialLesson, action: any): GFLesson {
  switch (action.type) {
    case types.LOAD_LESSON:
      return action.lesson;
    case types.USER_LOGOUT_SUCCESS:
      return initialLesson;

    default:
      return state;
  }
}

function lessonsReducer(
  state: GFLessons | any = {},
  action: any
): GFLessons | any {
  switch (action.type) {
    case types.LOAD_LESSONS_SUCCESS:
      return Object.assign(
        {},
        state,
        keyBy(action.lessons, (lesson: GFLesson) => lesson.id)
      );
    case types.USER_LOGOUT_SUCCESS:
      return {};

    default:
      return state;
  }
}

function quizzesReducer(
  state: { [key: string]: GFQuizItem } = {},
  action: any
): { [key: string]: GFQuizItem } {
  switch (action.type) {
    case types.LOAD_QUIZZES_SUCCESS:
      return Object.assign(
        {},
        state,
        keyBy(action.quizzes, (quiz: GFQuizItem) => quiz.id)
      );
    case types.LOAD_QUIZZES_BY_LESSON_SUCCESS:
      return Object.assign(
        {},
        state,
        keyBy(action.quizzes, (quiz: GFQuizItem) => quiz.id)
      );
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}
function quizReducer(state: GFQuizItem = initialQuiz, action: any): GFQuizItem {
  switch (action.type) {
    case types.LOAD_QUIZ:
      return action.quiz;
    case types.USER_LOGOUT_SUCCESS:
      return initialQuiz;

    default:
      return state;
  }
}

function lessonProgressReducer(
  state: { [key: string]: LessonProgress } = {},
  action: any
): { [key: string]: LessonProgress } {
  switch (action.type) {
    case types.GET_ALL_LESSON_PROGRESS_SUCCESS:
      return Object.assign(
        {},
        state,
        keyBy(action.progress, (prog: any) => prog.lessonID)
      );
    case types.SAVE_LESSON_PROGRESS_SUCCESS:
      return state;
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

export default function trainingReducer(
  state: ItrainingReducer = initialState.training,
  action: any
) {
  return {
    courses: courseReducer(state.courses, action),
    lessons: lessonsReducer(state.lessons, action),
    lesson: lessonReducer(state.lesson, action),
    quizzes: quizzesReducer(state.quizzes, action),
    quiz: quizReducer(state.quiz, action),
    lessonProgress: lessonProgressReducer(state.lessonProgress, action),
    cart: cartReducer(state.cart, action),
    showShoppingCartModal: modalToggleWithName(
      state.showShoppingCartModal,
      action,
      'SHOPPING_CART'
    )
  };
}

// getters for shopping cart

export const getTotal = (state: ItrainingReducer) =>
  state.cart.addedIDs.reduce(
    (total, id) => total + getQuantity(state.cart, id),
    0
  );
