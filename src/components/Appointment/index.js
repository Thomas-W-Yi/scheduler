import React, { useEffect } from 'react';
import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Error from 'components/Appointment/Error';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      transition(SHOW);
    }
    if (mode === SHOW && props.interview === null) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition('SAVING');
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition('SHOW');
      })
      .catch((err) => {
        transition('ERROR_SAVE', true);
      });
    // book &&
    //   book.catch((err) => {
    //     transition('ERROR_SAVE', true);
    //   });
  }
  function onDelete() {
    transition('CONFIRM');
  }
  function onConfirm() {
    transition('DELETING', true);
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        transition('ERROR_DELETE', true);
      });
  }

  function onEdit() {
    transition('EDIT');
  }

  return (
    <article className='appointment' data-testid='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition('CREATE')} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
      {mode === SAVING && <Status message={SAVING} />}
      {mode === DELETING && <Status message={DELETING} />}
      {mode === CONFIRM && (
        <Confirm
          message='Delete the appointment?'
          onCancel={() => back()}
          onConfirm={() => onConfirm()}
        />
      )}
      {mode === EDIT && (
        <Form
          onCancel={() => back()}
          onSave={save}
          name={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message='Could not save appointment.' onClose={() => back()} />
      )}
      {mode === ERROR_DELETE && (
        <Error message='Could not delete appointment.' onClose={() => back()} />
      )}
    </article>
  );
}
