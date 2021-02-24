import React from 'react';
import classnames from 'classnames';
import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const formatSpots = (spots) => {
    return spots === 0
      ? 'no spots remaining'
      : spots === 1
      ? `${spots} spot remaining`
      : `${spots} spots remaining`;
  };
  const dayClass = classnames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0,
  });
  return (
    <li onClick={props.setDay} className={dayClass} data-testid='day'>
      <h2 className='text--regular'>{props.name}</h2>
      <h3 className='text--light'>{formatSpots(props.spots)}</h3>
    </li>
  );
}
