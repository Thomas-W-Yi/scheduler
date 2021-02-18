import React from 'react';
import DayListItem from 'components/DayListItem';

export default function DayList(props) {
  return (
    <ul>
      {props.days.map((dayObj) => {
        return (
          <DayListItem
            name={dayObj.name}
            spots={dayObj.spots}
            selected={dayObj.name === props.day}
            setDay={() => props.setDay(dayObj.name)}
            key={dayObj.id}
          />
        );
      })}
    </ul>
  );
}
