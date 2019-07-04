import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { constants } from 'src/constants/constants';
import {
  Iuser,
  GFLesson,
  LessonProgress,
  ThunkResult,
  IshoppingCartProduct,
  GFCourse
} from 'src/models';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { find, sortBy } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { authContext } from './userActions';
import { adalFetch } from 'src/components/auth/Auth-Utils';

export function loadCourses(user: Iuser): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());

    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.trainingCurriculum.allCourses;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((response: AxiosResponse<any>) => {
        if (response.status !== 200) {
          throw response;
        }
        // temporary hack to support On-Site and Webinar courses
        const courses = response.data.map((course: GFCourse) => {
          const foundOnSite = course.name.search('On-Site');
          const foundWebinar = course.name.search('Webinar');

          if (foundOnSite >= 0 || foundWebinar >= 0) {
            return { ...course, onSite: true };
          } else {
            return { ...course, onSite: false };
          }
        });
        dispatch({ type: types.LOAD_COURSES_SUCCESS, courses });
        return courses;
      })
      .catch((error: AxiosError) => {
        console.error('error loading courses', error);
        dispatch({ type: types.LOAD_COURSES_FAILED, error });
        const message = 'load courses';
        constants.handleError({ response: error }, message);
      });
  };
}

export function getLessonSuccess(lesson: GFLesson) {
  return { type: types.LOAD_LESSON, lesson };
}

export function setLesson(lesson: GFLesson): ThunkResult<void> {
  return dispatch => {
    dispatch(getLessonSuccess(lesson));
  };
}

export function getLessonsByCourseID(
  courseID: string,
  user: Iuser
): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = `${
      API.GET.trainingCurriculum.lessonByCourseID
    }?courseID=${courseID}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((response: AxiosResponse<any>) => {
        if (response.status !== 200) {
          throw response;
        }
        const lessons = sortBy(response.data, (el: GFLesson) => {
          return el.courseLessons[0].order;
        });
        dispatch({ type: types.LOAD_LESSONS_SUCCESS, lessons });
        return lessons;
      })
      .catch((error: AxiosError) => {
        dispatch({ type: types.LOAD_LESSONS_FAILED, error });
        constants.handleError({ response: error }, 'load lessons');
        console.error('Error getting a course by ID', error);
      });
  };
}

export function getAllLessons(user: Iuser): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.trainingCurriculum.allLessons;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((response: AxiosResponse<any>) => {
        if (response.status !== 200) {
          throw response;
        }
        dispatch({ type: types.LOAD_LESSONS_SUCCESS, lessons: response.data });
        return response.data;
      })
      .catch((error: AxiosError) => {
        dispatch({ type: types.LOAD_LESSONS_FAILED, error });
        constants.handleError({ response: error }, 'load lessons');
        console.error('Error getting all lessons', error);
      });
  };
}

// Get all lesson progress
export function getAllLessonProgress(): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.training.getalllessonprogress;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.GET_ALL_LESSON_PROGRESS_SUCCESS,
          progress: data.data
        });
      })
      .catch((error: any) => {
        console.error('Error getting lesson progress', error);
        dispatch({ type: types.GET_ALL_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'get all lesson progress');
      });
  };
}

// Get lesson progress
export function getProgressByLesson(lessonId: string): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = `${API.GET.training.getprogressbylesson}/${lessonId}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.GET_LESSON_PROGRESS_SUCCESS,
          progress: data
        });
      })
      .catch((error: any) => {
        console.error('Error getting lesson progress', error);
        dispatch({ type: types.GET_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'get lesson progress');
      });
  };
}

// Save lesson progress
export function saveLessonProgress(
  progress: LessonProgress
): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: progress
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.training.savelessonprogress;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.SAVE_LESSON_PROGRESS_SUCCESS,
          progress: { id: data.data, ...progress }
        });
      })
      .catch((error: any) => {
        console.error('Error saving lesson progress', error);
        dispatch({ type: types.SAVE_LESSON_PROGRESS_FAILED });
        constants.handleError(error, 'save lesson progress');
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
        'Please remove all lessons before adding a course.  You cannot purchase courses and lessons at the same time.',
        constants.toastrWarning
      );
      return;
    }
    if (foundCourse) {
      toastr.warning(
        'Warning',
        'Course already added to cart.',
        constants.toastrWarning
      );
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
      toastr.warning(
        'Warning',
        'Lesson already added to cart.',
        constants.toastrWarning
      );
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
    dispatch({ type: types.CLOSE_ALL_MODALS });
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: {
        PurchasedTraining: products,
        UTATransactionNumber: parseInt(transactionNumber, 10)
      }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.training.trainingCheckout;
    return adalFetch(authContext, resource, axios, url, axiosOptions).then(
      (data: AxiosResponse<any>) => {
        dispatch({
          type: types.CHECKOUT_TRAINING_SUCCESS
        });
        getPurchasedTrainingHelper(dispatch, getState);
      },
      (error: any) => {
        dispatch({ type: types.CHECKOUT_TRAINING_FAILED });
        constants.handleError(error, 'purchasing training');
      }
    );
  };
};

export const getPurchasedTraining = (): ThunkResult<void> => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    getPurchasedTrainingHelper(dispatch, getState);
  };
};

const getPurchasedTrainingHelper = (dispatch: any, getState: any) => {
  const axiosOptions: AxiosRequestConfig = {
    method: 'get'
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = API.GET.training.getPurchasedTraining;
  return adalFetch(authContext, resource, axios, url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      dispatch({
        type: types.GET_PURCHASED_TRAINING_SUCCESS,
        products: data.data
      });
      // toastr.success("Success", "requested quote", constants.toastrSuccess);
    })
    .catch((error: any) => {
      console.error('Error getting purchased training', error);
      dispatch({ type: types.GET_PURCHASED_TRAINING_FAILED });
      constants.handleError(error, 'get purchased training');
    });
};

// Save quiz start
export function startQuiz(quizID: string): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { quizID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.training.startQuiz;
    return adalFetch(authContext, resource, axios, url, axiosOptions).then(
      (data: AxiosResponse<any>) => {
        dispatch({
          type: types.START_QUIZ_SUCCESS,
          startTime: data.data.startTime
        });
      },
      (error: any) => {
        console.error('Error starting timed quiz', error);
        dispatch({ type: types.START_QUIZ_FAILED });
        constants.handleError(error, 'start quiz');
        throw error;
      }
    );
  };
}

/*
* Get Quiz Results
*/
export function getQuizResults(): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.training.getQuizResults;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.GET_QUIZ_RESULTS_SUCCESS,
          results: data.data
        });
      })
      .catch((error: any) => {
        console.error('Error getting quiz result', error);
        dispatch({ type: types.GET_QUIZ_RESULTS_FAILED });
        constants.handleError(error, 'get quiz results');
      });
  };
}
