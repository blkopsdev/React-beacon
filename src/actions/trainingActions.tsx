import * as types from './actionTypes';
import courseAPI from '../trainingAPI/courseAPI';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import constants from '../constants/constants';
import { Iuser, GFLesson, GFLessons, ThunkResult } from 'src/models';
import axios from 'axios';
import { map } from 'lodash';

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
export function saveLessonProgress(progress: any) {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
    return axios
      .post(`${API.POST.training.savelessonprogress}`, progress)
      .then(data => {
        console.log('SAVE PROGRESS', data.data);
        dispatch({
          type: types.SAVE_LESSON_PROGRESS_SUCCESS,
          progress: data.data
        });
      })
      .catch((error: any) => {
        dispatch({ type: types.SAVE_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'save lesson progress');
        throw error;
      });
  };
}

export const trainingCheckout = ({
  message
}: {
  message: string;
}): ThunkResult<void> => {
  return (dispatch, getState) => {
    const QuoteItems = map(
      getState().training.cart.productsByID,
      (product, key) => {
        return { productID: key, quantity: product.quantity };
      }
    );
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_SHOPPING_CART });
    return axios
      .post(API.POST.inventory.quote, { QuoteItems, message })
      .then(data => {
        dispatch({
          type: types.CHECKOUT_SUCCESS
        });
        // toastr.success("Success", "requested quote", constants.toastrSuccess);
      })
      .catch((error: any) => {
        dispatch({ type: types.CHECKOUT_FAILED });
        constants.handleError(error, 'requesting quote');
        throw error;
      });
  };
};
