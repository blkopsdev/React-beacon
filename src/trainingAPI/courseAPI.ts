const root = process.env.REACT_APP_SERVER_DOMAIN_TRAINING;
import { sortBy, forEach } from "lodash";
import { Iuser } from "src/models";
import { getCachedToken } from "src/actions/userActions";

class CourseAPI {
  /*
    Get all courses for current user
  */
  static getAll(user: Iuser) {
    const URL = `${root}/course/getall`;
    const request = new Request(URL, {
      method: "GET",
      headers: this.getHeaders(user)
    });

    return fetch(request).then(response => {
      if (response.status !== 200) {
        throw response;
      }
      return response.json();
    });
  }

  /*
    Get lesson by ID
  */
  // static getLessonByID(lessonID: string, user: Iuser) {
  //   const  URL = `${root}/lesson/getlesson?lessonID=${lessonID}`;
  //   const  request = new Request(URL,
  //     { method: 'GET', headers: this.getHeaders(user) });

  //   return fetch(request)
  //     .then((response) => {
  //       if (response.status !== 200) {
  //         throw response;
  //       }
  //       return response.json();
  //     }).then((data) => {
  //       return data;
  //     });
  // }

  /*
    Get all lessons
  */
  static getAllLessons(user: Iuser) {
    const URL = `${root}/lesson/getall`;
    const request = new Request(URL, {
      method: "GET",
      headers: this.getHeaders(user)
    });

    return fetch(request).then(response => {
      if (response.status !== 200) {
        throw response;
      }
      return response.json();
    });
  }

  /*
    Get all lessons for course
  */
  static getLessonsByCourseID(courseID: string, user: Iuser) {
    const URL = `${root}/lesson/getbycourse?courseID=${courseID}`;
    const request = new Request(URL, {
      method: "GET",
      headers: this.getHeaders(user)
    });

    return fetch(request)
      .then(response => {
        if (response.status !== 200) {
          throw response;
        }
        return response.json();
      })
      .then((data: any) => {
        return sortBy(data, (el: any) => {
          return el.courseLessons[0].order;
        });
      });
  }

  /*
    Get all quizzes for lesson
  */
  static getQuizzesByLessonID(lessonID: string, user: Iuser) {
    const URL = `${root}/quiz/getall?lessonID=${lessonID}`;
    const request = new Request(URL, {
      method: "GET",
      headers: this.getHeaders(user)
    });

    return fetch(request)
      .then(response => {
        if (response.status !== 200) {
          throw response;
        }
        return response.json();
      })
      .then((data: any) => {
        forEach(data, quiz => {
          forEach(quiz.questions, q => {
            if (q.options) {
              q.options = q.options.split("*||*").map((option: any) => {
                return JSON.parse(option);
              });
            }
          });
        });
        return sortBy(data, (el: any) => {
          return el.order;
        });
      });
  }

  /*
    Get all quizzes
  */
  static getAllQuizzes(user: Iuser) {
    const URL = `${root}/quiz/getentirelist`;
    const request = new Request(URL, {
      method: "GET",
      headers: this.getHeaders(user)
    });

    return fetch(request)
      .then(response => {
        if (response.status !== 200) {
          throw response;
        }
        return response.json();
      })
      .then((data: any) => {
        return data;
      });
  }

  /*
    Convenience method to construct headers using a user object to obtain
    their apiKey
  */
  static getHeaders(user: Iuser) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Authorization", "Bearer " + getCachedToken());
    return headers;
  }
}

export default CourseAPI;
