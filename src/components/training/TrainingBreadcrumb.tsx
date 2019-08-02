import * as React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

import { RouteComponentProps } from 'react-router';
import { GFQuizItem, GFCourse, GFLesson } from '../../models';
import { LinkContainer } from 'react-router-bootstrap';

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
        <LinkContainer to={'/training'}>
          <BreadcrumbItem>
            <span>Training</span>
          </BreadcrumbItem>
        </LinkContainer>
        <LinkContainer to={`/training/${match.params.courseID}`}>
          <BreadcrumbItem>
            <span>{selectedCourse.name}</span>
          </BreadcrumbItem>
        </LinkContainer>
        <LinkContainer
          to={`/training/${match.params.courseID}/${match.params.lessonID}`}
        >
          <BreadcrumbItem>
            <span>{lesson.name}</span>
          </BreadcrumbItem>
        </LinkContainer>
        <BreadcrumbItem active={true}>{quiz.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  if (!!match.params.lessonID) {
    return (
      <Breadcrumb>
        <LinkContainer to={'/training'}>
          <BreadcrumbItem>
            <span>Training</span>
          </BreadcrumbItem>
        </LinkContainer>
        <LinkContainer to={`/training/${match.params.courseID}`}>
          <BreadcrumbItem>
            <span>{selectedCourse.name}</span>
          </BreadcrumbItem>
        </LinkContainer>
        <BreadcrumbItem active={true}>{lesson.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  if (!!match.params.courseID) {
    return (
      <Breadcrumb>
        <LinkContainer to={'/training'}>
          <BreadcrumbItem>
            <span>Training</span>
          </BreadcrumbItem>
        </LinkContainer>
        <BreadcrumbItem active={true}>{selectedCourse.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  return null;
};
