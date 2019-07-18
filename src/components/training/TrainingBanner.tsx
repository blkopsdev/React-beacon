import * as React from 'react';
import { Breadcrumb } from 'react-bootstrap';

import { RouteComponentProps } from 'react-router';
import { GFQuizItem, GFCourse, GFLesson } from 'src/models';

interface RouterParams {
  courseID: string;
  lessonID: string;
  quizID: string;
}

interface Iprops extends RouteComponentProps<RouterParams> {
  quiz: GFQuizItem;
  selectedCourse: GFCourse;
  lesson: GFLesson;
}

export const TrainingBreadcrumb = ({
  quiz,
  selectedCourse,
  lesson,
  history,
  match
}: Iprops) => {
  if (!!match.params.quizID) {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <span
            onClick={() => {
              history.push('/training');
            }}
          >
            Training
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span
            onClick={() => {
              history.replace(`/training/${match.params.courseID}`);
            }}
          >
            {selectedCourse.name}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span
            onClick={() => {
              history.replace(
                `/training/${match.params.courseID}/${match.params.lessonID}`
              );
            }}
          >
            {lesson.name}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>{quiz.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  if (!!match.params.lessonID) {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <span
            onClick={() => {
              history.push('/training');
            }}
          >
            Training
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span
            onClick={() => {
              history.goBack();
            }}
          >
            {selectedCourse.name}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>{lesson.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  if (!!match.params.courseID) {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <span
            onClick={() => {
              history.goBack();
            }}
          >
            Training
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>{selectedCourse.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  return '';
};
