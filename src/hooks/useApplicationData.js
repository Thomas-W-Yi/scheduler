import { useEffect, useReducer } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';
  const DELETE_INTERVIEW = 'DELETE_INTERVIEW';

  function getDays(id, condition, state) {
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
        const appointment = {
          ...state.appointments[action.value.id],
          interview: { ...action.value.interview },
        };
        console.log(action.value.id, state);
        const days = getDays(action.value.id, true, state);
        return {
          ...state,
          appointments: {
            ...state.appointments,
            [action.value.id]: appointment,
          },
          days,
        };
      }
      case DELETE_INTERVIEW: {
        console.log(action.value.id, state);
        const days = getDays(action.value, false, state);
        return {
          ...state,
          days,
          appointments: {
            ...state.appointments,
            [action.value]: {
              ...state.appointments[action.value],
              interview: null,
            },
          },
        };
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

    const ws = new WebSocket('ws://localhost:8001');
    ws.onopen = () => {
      ws.send('ping');
      console.log('connected');
    };

    ws.onmessage = function (event) {
      const message = JSON.parse(event.data);
      console.log(message, state);
      if (!message.interview && message.type === SET_INTERVIEW) {
        dispatch({ type: DELETE_INTERVIEW, value: message.id });
      }
      if (message.interview && message.type === SET_INTERVIEW) {
        dispatch({
          type: SET_INTERVIEW,
          value: { interview: message.interview, id: message.id },
        });
      }
    };
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {
      interview,
    });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`);
  }

  return { state, setDay, bookInterview, cancelInterview };
}
