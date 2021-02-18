import React from 'react';
import classnames from 'classnames';
import 'components/InterviewerListItem.scss';

export default function InterviewerListItem(props) {
  const liClass = classnames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });
  return (
    <li className={liClass} onClick={props.setInterviewer} key={props.id}>
      <img
        className={`interviewers__item-image`}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
