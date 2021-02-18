export function getAppointmentsForDay(state, day) {
  const dayO = state.days.filter((dayObj) => dayObj.name === day)[0];
  if (!dayO) {
    return [];
  }
  const appArr = dayO.appointments;
  return appArr.map((id) => state.appointments[id]);
}
export function getInterviewersForDay(state, day) {
  const dayO = state.days.filter((dayObj) => dayObj.name === day)[0];
  if (!dayO) {
    return [];
  }
  const appArr = dayO.interviewers;
  return appArr.map((id) => state.interviewers[id]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerObj = state.interviewers[interview.interviewer];
  return { ...interview, interviewer: interviewerObj };
}
