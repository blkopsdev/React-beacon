import * as types from '../actions/actionTypes';
import initialState, { initialLesson, initialQuiz } from './initialState';
import { keyBy, mapValues, find, map, pickBy } from 'lodash';
import {
  GFLesson,
  GFLessons,
  ItrainingReducer,
  GFQuizItem,
  GFCourse,
  LessonProgress,
  GFQuizAnswer,
  GFQuizViewReducer
} from 'src/models';
import { cartReducerWithName, getQuantity } from './cartReducer';
import {
  modalToggleWithName,
  createSelectedIDWithName
} from './commonReducers';

function courseReducer(
  state: { [key: string]: GFCourse } = initialState.training.courses,
  action: any
): { [key: string]: GFCourse } {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      const courses = keyBy(action.courses, 'id');
      return { ...state, ...courses };
    case types.USER_LOGOUT_SUCCESS:
      return initialState.training.courses;
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
    case types.GET_QUIZ_RESULTS_SUCCESS:
      return mapValues(state, (lesson: GFLesson) => {
        const quizResult = find(action.results, { lessonID: lesson.id }) as any;
        if (quizResult && quizResult.score) {
          return {
            ...lesson,
            score: quizResult.score,
            quizName: quizResult.quizName
          };
        }
        return lesson;
      });
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
    /*
    * When loading all quizzes, the objects do not have instructions or questions.  If we already have them, do not erase them.
    */
    case types.LOAD_QUIZZES_SUCCESS:
      return keyBy(
        map(action.quizzes, quiz => {
          const existingQuiz = state[quiz.id];
          if (existingQuiz) {
            return {
              ...cleanQuizObject(quiz),
              questions: existingQuiz.questions,
              instructions: existingQuiz.instructions
            };
          } else {
            return cleanQuizObject(quiz);
          }
        }),
        'id'
      );

    case types.LOAD_QUIZZES_BY_LESSON_SUCCESS:
      return Object.assign(
        {},
        state,
        keyBy(map(action.quizzes, quiz => cleanQuizObject(quiz)), 'id')
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
      return Object.assign(
        {},
        state,
        keyBy([action.progress], (prog: any) => prog.lessonID)
      );
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

function purchasedTrainingReducer(state: string[] = [], action: any): string[] {
  switch (action.type) {
    case types.GET_PURCHASED_TRAINING_SUCCESS:
      return action.products;
    case types.USER_LOGOUT_SUCCESS:
      return [];

    default:
      return state;
  }
}

export function quizAnswersReducer(
  state: GFQuizAnswer[] = initialState.training.quizAnswers,
  action: any
) {
  switch (action.type) {
    case types.ADD_ANSWER:
      return [...state, action.answer];
    case types.RESET_ANSWERS:
      console.error('resetting answers');
      return initialState.training.quizAnswers;
    case types.USER_LOGOUT_SUCCESS:
      return initialState.training.quizAnswers;

    default:
      return state;
  }
}

const booleanReducer = (state: boolean = false, action: any): boolean => {
  switch (action.type) {
    case types.SAVE_QUIZ_ANSWERS_SUCCESS:
      return true;
    case types.RESET_ANSWERS:
      return false;
    case types.USER_LOGOUT_SUCCESS:
      return false;
    default:
      return state;
  }
};

const startTimeReducer = (
  state: string = initialState.training.quizView.startTime,
  action: any
): string => {
  switch (action.type) {
    case types.START_QUIZ_SUCCESS:
      return action.startTime;
    case types.USER_LOGOUT_SUCCESS:
      return initialState.training.quizView.startTime;
    default:
      return state;
  }
};

export function quizViewReducer(
  state: GFQuizViewReducer = initialState.training.quizView,
  action: any
) {
  return {
    quizComplete: booleanReducer(state.quizComplete, action),
    inProgressQuizID: createSelectedIDWithName(
      state.inProgressQuizID,
      action,
      'IN_PROGRESS_QUIZ'
    ),
    startTime: startTimeReducer(state.startTime, action)
  };
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
    cart: cartReducerWithName(state.cart, action, 'TRAINING'),
    purchasedTraining: purchasedTrainingReducer(
      state.purchasedTraining,
      action
    ),
    showShoppingCartModal: modalToggleWithName(
      state.showShoppingCartModal,
      action,
      'SHOPPING_CART_TRAINING'
    ),
    quizAnswers: quizAnswersReducer(state.quizAnswers, action),
    quizView: quizViewReducer(state.quizView, action)
  };
}

// getters for shopping cart

export const getTotal = (state: ItrainingReducer) =>
  state.cart.addedIDs.reduce(
    (total, id) => total + getQuantity(state.cart, id),
    0
  );
const cleanQuizObject = (quiz: GFQuizItem) => {
  return {
    ...initialQuiz,
    ...pickBy(quiz, (property, key) => property !== null)
  };
};
