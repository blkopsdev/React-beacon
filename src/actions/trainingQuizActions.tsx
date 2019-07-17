import * as types from './actionTypes';
import { GFQuizItem, ThunkResult, Iuser } from 'src/models';
import { beginAjaxCall } from './ajaxStatusActions';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import API from 'src/constants/apiEndpoints';

import { msalFetch } from 'src/components/auth/Auth-Utils';
import { sortBy, forEach } from 'lodash';
import { constants } from 'src/constants/constants';

export function getQuizSuccess(quiz: GFQuizItem) {
  return { type: types.LOAD_QUIZ, quiz };
}

export function setQuiz(quiz: GFQuizItem): ThunkResult<void> {
  return dispatch => {
    dispatch(getQuizSuccess(quiz));
  };
}

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
export function saveQuizResult(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { quiz } = getState().training;

    // grind quiz results into the sausage that David's api is expecting
    const answers: any[] = [];
    let numCorrect: number = 0;
    forEach(quiz.questions, q => {
      if (q && q.userAnswer && q.userAnswer.isAnswer) {
        numCorrect++;
      }
      answers.push({
        QuestionID: q.id,
        Answer: q.userAnswer.option,
        IsCorrect: q.userAnswer.isAnswer
      });
    });
    const score = ((numCorrect / quiz.questions.length) * 100).toFixed(0);
    const body = {
      Answers: answers,
      QuizID: quiz.id,
      Score: score
    };
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: body
    };

    const url = API.POST.training.savequiz;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.SAVE_QUIZ_SUCCESS,
          progress: data.data
        });
      })
      .catch((error: any) => {
        console.error('Error saving quiz', error);
        dispatch({ type: types.SAVE_QUIZ_FAILED });
        constants.handleError(error, 'save quiz');
        throw error; // throw here because we have a .then in the quiz component
      });
  };
}
