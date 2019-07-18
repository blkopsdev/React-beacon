import * as types from './actionTypes';
import { GFQuizItem, ThunkResult, Iuser, GFQuizAnswer } from 'src/models';
import { beginAjaxCall } from './ajaxStatusActions';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import API from 'src/constants/apiEndpoints';

import { msalFetch } from 'src/components/auth/Auth-Utils';
import { sortBy, forEach } from 'lodash';
import { constants } from 'src/constants/constants';

/*
* Quizzes with the questions for a particular lesson
*/
export function getQuizzesByLessonID(
  lessonID: string,
  user: Iuser
): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };

    const url = `${
      API.GET.trainingCurriculum.quizzesByLessonID
    }?lessonID=${lessonID}`;
    return msalFetch(url, axiosOptions)
      .then((response: AxiosResponse<any>) => {
        if (response.status !== 200) {
          throw response;
        }
        const parsedQuizzes = response.data.map((quiz: GFQuizItem) => {
          const parsedQuestions = quiz.questions.map((question: any) => {
            if (question.options) {
              const parsedOptions = question.options
                .split('*||*')
                .map((option: any) => {
                  return JSON.parse(option);
                });
              return { ...question, options: parsedOptions };
            } else {
              return question;
            }
          });
          return { ...quiz, questions: parsedQuestions };
        });

        const quizzes = sortBy(parsedQuizzes, (el: any) => {
          return el.order;
        });

        dispatch({ type: types.LOAD_QUIZZES_SUCCESS, quizzes });
        return quizzes;
      })
      .catch((error: AxiosError) => {
        console.error('Error when trying to get all quizzes', error);
        dispatch({ type: types.LOAD_QUIZZES_FAILED, error });
        constants.handleError({ response: error }, 'loading all quizzes');
      });
  };
}

/*
* Complete list of quizzes without the questions
*/
export function getAllQuizzes(user: Iuser): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };

    const url = API.GET.trainingCurriculum.allQuizzes;
    return msalFetch(url, axiosOptions)
      .then((response: AxiosResponse<any>) => {
        if (response.status !== 200) {
          throw response;
        }
        dispatch({ type: types.LOAD_QUIZZES_SUCCESS, quizzes: response.data });
        return response.data;
      })
      .catch((error: AxiosError) => {
        console.error('Error when trying to get all quizzes', error);
        dispatch({ type: types.LOAD_QUIZZES_FAILED, error });
        constants.handleError({ response: error }, 'loading all quizzes');
      });
  };
}

/*
      Save quiz results
    */
export function saveQuizResult(
  quizID: string,
  quizName: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { quizAnswers } = getState().training;
    const { score } = calculateScore(quizAnswers);

    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: {
        Answers: quizAnswers,
        quizID,
        Score: score
      }
    };

    const url = API.POST.training.savequiz;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.SAVE_QUIZ_ANSWERS_SUCCESS,
          progress: data.data
        });
      })
      .catch((error: any) => {
        console.error('Error saving quiz', error);
        dispatch({ type: types.SAVE_QUIZ_ANSWERS_FAILED });
        constants.handleError(error, 'save quiz');
        throw error; // throw here because we have a .then in the quiz component
      });
  };
}

// Save quiz start
export function startQuiz(quizID: string): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { quizID }
    };
    const url = API.POST.training.startQuiz;
    return msalFetch(url, axiosOptions).then(
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

export const addAnswer = (answer: GFQuizAnswer) => ({
  type: types.ADD_ANSWER,
  answer
});

export const resetAnswers = () => ({
  type: types.RESET_ANSWERS
});

export const setInProgressQuizID = (quizID: string) => ({
  type: types.SET_SELECTED_IN_PROGRESS_QUIZ,
  id: quizID
});

export const calculateScore = (quizAnswers: GFQuizAnswer[]) => {
  let numCorrect = 0;
  const tot = quizAnswers.length;
  forEach(quizAnswers, answer => {
    if (answer.isCorrect) {
      numCorrect++;
    }
  });
  return { score: Math.round((numCorrect / tot) * 100), numCorrect, tot };
};
