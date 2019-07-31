import * as React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

import { RouteComponentProps } from 'react-router';
import { GFQuizItem, GFCourse, GFLesson } from '../../models';

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
        <BreadcrumbItem>
          <span
            onClick={() => {
              history.push('/training');
            }}
          >
            Training
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span
            onClick={() => {
              history.replace(`/training/${match.params.courseID}`);
            }}
          >
            {selectedCourse.name}
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span
            onClick={() => {
              history.replace(
                `/training/${match.params.courseID}/${match.params.lessonID}`
              );
            }}
          >
            {lesson.name}
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem active={true}>{quiz.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  if (!!match.params.lessonID) {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <span
            onClick={() => {
              history.push('/training');
            }}
          >
            Training
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span
            onClick={() => {
              history.goBack();
            }}
          >
            {selectedCourse.name}
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem active={true}>{lesson.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  if (!!match.params.courseID) {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <span
            onClick={() => {
              history.goBack();
            }}
          >
            Training
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem active={true}>{selectedCourse.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  return '';
};
