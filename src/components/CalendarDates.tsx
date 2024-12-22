import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventStore } from "./Calendar";
import { cn } from "@/lib/utils";

interface CalendarDaysProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: EventStore;
  setIsAddEventOpen: (open: boolean) => void;
}

const CalendarDays: React.FC<CalendarDaysProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  events,
  setIsAddEventOpen,
}) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(
      <div key={`${i}-empty`} className="h-12" aria-hidden="true"></div>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dateString = date.toLocaleDateString();
    const isToday = isSameDay(date, today);
    const isSunday = date.getDay() === 0;
    const isSelected = isSameDay(date, selectedDate);
    const dayEvents = events[dateString] || [];

    days.push(
      <div
        key={day}
        role="button"
        tabIndex={0}
        aria-label={`Day ${day} ${date.toLocaleDateString()} have ${
          dayEvents.length
        } events`}
        className={cn(
          "md:h-24 h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer group relative border border-zinc-300 shadow-sm",
          isSunday && "text-red-500 font-bold",
          isToday && "bg-blue-600 text-white font-bold",
          isSelected && "ring-1 ring-primary",
          "hover:bg-blue-200 hover:text-black"
        )}
        onClick={() => setSelectedDate(date)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setSelectedDate(date);
        }}
      >
        <span className="md:absolute left-2 bottom-2">{day}</span>

        {/* showing only 3 dots event to prevent overflow */}
        {dayEvents.length > 0 && (
          <div
            className="flex space-x-1 md:absolute bottom-4 right-4"
            aria-label="Event indicators"
          >
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`w-2 h-2 rounded-full ${event.color}`}
                aria-label={`Events`}
              ></div>
            ))}
          </div>
        )}
        <Button
          size="icon"
          variant="ghost"
          aria-label="Add event"
          className="md:group-hover:flex hidden absolute top-1 right-1 h-6 w-6 bg-white"
          onClick={() => {
            setSelectedDate(date);
            setIsAddEventOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return <>{days}</>;
};

export default CalendarDays;
