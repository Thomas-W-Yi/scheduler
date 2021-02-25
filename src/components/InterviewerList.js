import React from 'react';
import InterviewerListItem from 'components/InterviewerListItem';
import PropTypes from 'prop-types';
import 'components/InterviewerList.scss';

function InterviewerList(props) {
  return (
    <section className='interviewers'>
      <h4 className='interviewers__header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>
        {Array.isArray(props.interviewers) &&
          props.interviewers.map((interviewer) => {
            return (
              <InterviewerListItem
                key={interviewer.id}
                name={interviewer && interviewer.name}
                avatar={interviewer && interviewer.avatar}
                setInterviewer={() => props.setInterviewer(interviewer)}
                selected={
                  props.value &&
                  interviewer.id &&
                  props.value.id === interviewer.id
                }
              />
            );
          })}
      </ul>
    </section>
  );
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired,
};

export default InterviewerList;
