import * as React from 'react';
import { Breadcrumb } from 'react-bootstrap';

import { RouteComponentProps } from 'react-router';
import { GFQuizItem, GFCourse, GFLesson } from 'src/models';
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
          <Breadcrumb.Item>
            <span>Training</span>
          </Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`/training/${match.params.courseID}`}>
          <Breadcrumb.Item>
            <span>{selectedCourse.name}</span>
          </Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer
          to={`/training/${match.params.courseID}/${match.params.lessonID}`}
        >
          <Breadcrumb.Item>
            <span>{lesson.name}</span>
          </Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active={true}>{quiz.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  if (!!match.params.lessonID) {
    return (
      <Breadcrumb>
        <LinkContainer to={'/training'}>
          <Breadcrumb.Item>
            <span>Training</span>
          </Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`/training/${match.params.courseID}`}>
          <Breadcrumb.Item>
            <span>{selectedCourse.name}</span>
          </Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active={true}>{lesson.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  if (!!match.params.courseID) {
    return (
      <Breadcrumb>
        <LinkContainer to={'/training'}>
          <Breadcrumb.Item>
            <span>Training</span>
          </Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active={true}>{selectedCourse.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  return null;
};
