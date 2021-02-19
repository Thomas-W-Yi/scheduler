import { useEffect, useReducer } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value,
        };
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value };
      case SET_INTERVIEW: {
        return { ...state, ...action.value };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => {
    dispatch({ type: SET_DAY, value: day });
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((res) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: res[0].data,
          appointments: res[1].data,
          interviewers: res[2].data,
        },
      });
    });
  }, []);

  function getDays(id, condition) {
    let num;
    const dayObj = state.days.filter((day, index) => {
      day.appointments.includes(id) && (num = index);
      return day.appointments.includes(id);
    })[0];
    condition ? dayObj.spots-- : dayObj.spots++;
    const days = [...state.days];
    days[num] = dayObj;
    return days;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = getDays(id, true);

    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
      });
  }

  function cancelInterview(id) {
    const days = getDays(id, false);
    return axios.delete(`/api/appointments/${id}`).then((res) => {
      dispatch({ type: SET_INTERVIEW, value: { days } });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
