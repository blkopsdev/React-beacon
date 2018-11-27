import * as types from './actionTypes';
import courseAPI from '../trainingAPI/courseAPI';
import { beginAjaxCall } from './ajaxStatusActions';
import constants from '../constants/constants';
import { Iuser, GFLesson, GFLessons } from 'src/models';

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
