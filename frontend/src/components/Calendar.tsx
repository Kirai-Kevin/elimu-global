import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'class' | 'assignment' | 'announcement';
}

function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulating API call to fetch events
    const fetchEvents = async () => {
      // In a real application, this would be an API call
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Math Class',
          start: new Date(2023, 5, 15, 10, 0),
          end: new Date(2023, 5, 15, 11, 0),
          type: 'class',
        },
        {
          id: 2,
          title: 'Essay Due',
          start: new Date(2023, 5, 20, 23, 59),
          end: new Date(2023, 5, 20, 23, 59),
          type: 'assignment',
        },
        {
          id: 3,
          title: 'School Holiday',
          start: new Date(2023, 5, 25),
          end: new Date(2023, 5, 25),
          type: 'announcement',
        },
      ];
      setEvents(mockEvents);
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event: Event) => {
    let style: React.CSSProperties = {
      backgroundColor: '#3182ce',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block',
    };

    switch (event.type) {
      case 'class':
        style.backgroundColor = '#3182ce';
        break;
      case 'assignment':
        style.backgroundColor = '#e53e3e';
        break;
      case 'announcement':
        style.backgroundColor = '#38a169';
        break;
    }

    return {
      style: style,
    };
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Calendar</h2>
      <div className="h-[600px]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}

export default Calendar;

