import { Edit, Trash2 } from "lucide-react";
import { Event } from "./Calendar";

interface EventListProps {
  events: Event[];
  filterKeyword: string;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: Event) => void;
}

export default function EventList({
  events,
  filterKeyword,
  onDeleteEvent,
  onEditEvent
}: EventListProps) {
  const filteredEvents = events.filter(
    // fitlering events if keywords present in title or the description
    (event) =>
      event.title.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      (event.description &&
        event.description.toLowerCase().includes(filterKeyword.toLowerCase()))
  );

  return filteredEvents.length === 0 ? (
    <div className="flex flex-col gap-4 items-center text-lg text-muted-foreground">
      <img src="/events.png" alt="no events image" />
      <p>
        {events.length === 0
          ? "No events scheduled for this day."
          : "No events match your filter."}
      </p>
    </div>
  ) : (
    <ul className="space-y-2">
      {filteredEvents.map((event) => (
        <li
          key={event.id}
          className={`p-2 rounded-xl flex justify-between items-center ${event.color} bg-opacity-20`}
        >
          <div className="w-full">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {event.startTime} - {event.endTime}
            </p>

            <p className="text-sm text-muted-foreground max-w-52 truncate">
              {event.description || ".."}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Edit
              role="button"
              aria-label="Edit event"
              onClick={() => onEditEvent(event)}
              className="h-4 w-4 text-emerald-600"
            />
            <Trash2
              role="button"
              aria-label="Delete event"
              onClick={() => onDeleteEvent(event.id)}
              className="h-4 w-4 text-red-600"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
