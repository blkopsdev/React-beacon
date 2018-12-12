import * as types from './actionTypes';
import courseAPI from '../trainingAPI/courseAPI';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import constants from '../constants/constants';
import {
  Iuser,
  GFLesson,
  GFLessons,
  LessonProgress,
  ThunkResult,
  IshoppingCartProduct
} from 'src/models';
import axios from 'axios';
import { find } from 'lodash';
import { toastr } from 'react-redux-toastr';

export function loadCourses(user: Iuser) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return courseAPI
      .getAll(user)
      .then((courses: any) => {
        dispatch({ type: types.LOAD_COURSES_SUCCESS, courses });
        return courses;
      })
      .catch((error: any) => {
        dispatch({ type: types.LOAD_COURSES_FAILED, error });
        const message = 'load courses';
        constants.handleError(error, message);
        throw error;
      });
  };
}

export function getLessonSuccess(lesson: GFLesson) {
  return { type: types.LOAD_LESSON, lesson };
}

export function setLesson(lesson: GFLesson) {
  return (dispatch: any) => {
    dispatch(getLessonSuccess(lesson));
  };
}

export function getLessonsByCourseID(courseID: string, user: Iuser) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return courseAPI
      .getLessonsByCourseID(courseID, user)
      .then((lessons: GFLesson[]) => {
        dispatch({ type: types.LOAD_LESSONS_SUCCESS, lessons });
        return lessons;
      })
      .catch((error: any) => {
        dispatch({ type: types.LOAD_LESSONS_FAILED, error });
        constants.handleError(error, 'load lessons');
        console.error(error);
        throw error;
      });
  };
}

export function getAllLessons(user: Iuser) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return courseAPI
      .getAllLessons(user)
      .then((lessons: GFLessons) => {
        dispatch({ type: types.LOAD_LESSONS_SUCCESS, lessons });
        return lessons;
      })
      .catch((error: any) => {
        dispatch({ type: types.LOAD_LESSONS_FAILED, error });
        constants.handleError(error, 'load lessons');
        console.error(error);
        throw error;
      });
  };
}

/*
* Complete list of quizzes without the questions
*/
export function getAllQuizzes(user: Iuser) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return courseAPI
      .getAllQuizzes(user)
      .then(quizzes => {
        dispatch({ type: types.LOAD_QUIZZES_SUCCESS, quizzes });
        return quizzes;
      })
      .catch(error => {
        console.error('Error when trying to get all quizzes', error);
        dispatch({ type: types.LOAD_QUIZZES_FAILED, error });
        constants.handleError(error, 'loading all quizzes');
        throw error;
      });
  };
}

// Get all lesson progress
export function getAllLessonProgress() {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(`${API.GET.training.getalllessonprogress}`)
      .then(data => {
        console.log('PROGRESS', data.data);
        dispatch({
          type: types.GET_ALL_LESSON_PROGRESS_SUCCESS,
          progress: data.data
        });
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_ALL_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'get all lesson progress');
        throw error;
      });
  };
}

// Get lesson progress
export function getProgressByLesson(lessonId: string) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(`${API.GET.training.getprogressbylesson}/${lessonId}`)
      .then(data => {
        dispatch({
          type: types.GET_LESSON_PROGRESS_SUCCESS,
          progress: data
        });
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'get lesson progress');
        throw error;
      });
  };
}

// Save lesson progress
export function saveLessonProgress(progress: LessonProgress) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return axios
      .post(`${API.POST.training.savelessonprogress}`, progress)
      .then(data => {
        console.log('SAVE PROGRESS', data.data);
        dispatch({
          type: types.SAVE_LESSON_PROGRESS_SUCCESS,
          progress: { id: data.data, ...progress }
        });
      })
      .catch((error: any) => {
        dispatch({ type: types.SAVE_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'save lesson progress');
        throw error;
      });
  };
}

/*
* check to see if we already added this course
* check to see if there are already any lessons in the cart
*/
export const addCourseToCart = (
  product: IshoppingCartProduct,
  cartName: string
): ThunkResult<void> => {
  return (dispatch, getState) => {
    const { lessons, cart } = getState().training;
    let foundLesson = false;
    cart.addedIDs.forEach(value => {
      foundLesson = !!find(lessons, { id: value });
    });
    const foundCourse = cart.productsByID[product.id];
    if (foundLesson) {
      toastr.warning(
        'Warning',
        'Please remove all lessons before adding a course.  You cannot purchase courses and lessons at the same time.'
      );
      return;
    }
    if (foundCourse) {
      console.log('course already added');
      return;
    }
    dispatch({
      type: `ADD_TO_CART_TRAINING`,
      product
    });
  };
};

/*
* check to see if we already added this course
* check to see if there are already any lessons in the cart
*/
export const addLessonToCart = (
  product: IshoppingCartProduct,
  cartName: string
): ThunkResult<void> => {
  return (dispatch, getState) => {
    const { courses, cart } = getState().training;
    let foundCourse = false;
    cart.addedIDs.forEach(value => {
      foundCourse = !!find(courses, { id: value });
    });

    const foundLesson = cart.productsByID[product.id];
    if (foundCourse) {
      toastr.warning(
        'Warning',
        'Please remove all courses before adding a lesson.  You cannot purchase courses and lessons at the same time.'
      );
      return;
    }
    if (foundLesson) {
      console.log('lesson already added');
      return;
    }
    dispatch({
      type: `ADD_TO_CART_TRAINING`,
      product
    });
  };
};

export const trainingCheckout = (
  transactionNumber: string
): ThunkResult<void> => {
  return (dispatch, getState) => {
    const products = getState().training.cart.addedIDs;
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_SHOPPING_CART_TRAINING });
    return axios
      .post(API.POST.training.trainingCheckout, {
        PurchasedTraining: products,
        UTATransactionNumber: parseInt(transactionNumber, 10)
      })
      .then(data => {
        dispatch({
          type: types.CHECKOUT_TRAINING_SUCCESS
        });
        getPurchasedTrainingHelper(dispatch, getState);
      })
      .catch((error: any) => {
        dispatch({ type: types.CHECKOUT_TRAINING_FAILED });
        constants.handleError(error, 'purchasing training');
        throw error;
      });
  };
};

export const getPurchasedTraining = (): ThunkResult<void> => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    getPurchasedTrainingHelper(dispatch, getState);
  };
};

const getPurchasedTrainingHelper = (dispatch: any, getState: any) => {
  return axios
    .get(API.GET.training.getPurchasedTraining)
    .then(data => {
      dispatch({
        type: types.GET_PURCHASED_TRAINING_SUCCESS,
        products: data.data
      });
      // toastr.success("Success", "requested quote", constants.toastrSuccess);
    })
    .catch((error: any) => {
      dispatch({ type: types.GET_PURCHASED_TRAINING_FAILED });
      constants.handleError(error, 'get purchased training');
      throw error;
    });
};
