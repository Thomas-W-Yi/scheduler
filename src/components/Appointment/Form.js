import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const handleName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setName(value);
  };
  const handleInterviewer = (value) => {
    setInterviewer(value);
  };
  const reset = () => {
    setName('');
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    props.onCancel();
  };
  return (
    <main className='appointment__card appointment__card--create'>
      <section className='appointment__card-left'>
        <form autoComplete='off' onSubmit={(e) => e.preventDefault()}>
          <input
            className='appointment__create-input text--semi-bold'
            name='name'
            type='text'
            value={name}
            placeholder='Enter Student Name'
            onChange={handleName}
            /*
          This must be a controlled component
        */
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          setInterviewer={handleInterviewer}
        />
      </section>
      <section className='appointment__card-right'>
        <section className='appointment__actions'>
          <Button onClick={cancel} danger>
            Cancel
          </Button>
          <Button onClick={() => props.onSave(name, interviewer)} confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
