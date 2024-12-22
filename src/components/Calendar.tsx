import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import EventList from "./EventList";
import AddEventDialog from "./AddEventModal";
import CalendarDays from "./CalendarDates";

export interface Event {
  id: string;
  title: string;
  description?: string;
  color: string;
  startTime: string;
  endTime: string;
}

export interface EventStore {
  [date: string]: Event[];
}

export default function Calendar() {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [events, setEvents] = useState<EventStore>({});
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(events).length) // doing this check because if not then on every refresh it will set to {}
      localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<Event, "id">) => {
    if (!selectedDate) return;

    const dateString = selectedDate.toLocaleDateString();
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents((prev) => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), newEvent],
    }));
    setIsDialogOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const deleteEvent = (eventId: string) => {
    if (!selectedDate) return;

    const dateString = selectedDate.toLocaleDateString();
    setEvents((prev) => ({
      ...prev,
      [dateString]: prev[dateString].filter((event) => event.id !== eventId),
    }));
  };

  const editEvent = (updatedEvent: Event) => {
    if (!selectedDate) return;

    const dateString = selectedDate.toLocaleDateString();
    setEvents((prev) => ({
      ...prev,
      [dateString]: prev[dateString].map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ),
    }));
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="flex md:flex-row flex-col gap-4 w-full">
      <div className="md:w-2/3 w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="md:text-3xl text-xl font-bold" role="heading">
              {currentDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex md:gap-8 gap-2">
              <Button
                variant="outline"
                onClick={goToPreviousMonth}
                aria-label="Go to previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={goToNextMonth}
                aria-label="Go to next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-12">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-left md:text-xl text-sm font-semibold"
                aria-label={day}
              >
                {day}
              </div>
            ))}
            <CalendarDays
              currentDate={currentDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={events}
              setIsAddEventOpen={setIsDialogOpen}
            />
          </div>
        </div>
      </div>
      <div className="md:w-1/3 w-full flex-1 h-full">
        <Card className="w-full shadow-sm">
          <CardHeader className="space-y-6">
            <CardTitle className="flex gap-4 items-center">
              <Input
                icon={<Search className="w-4 h-4 text-gray-500" />}
                type="text"
                placeholder="Filter events..."
                className="w-full"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                aria-label="Filter events"
              />
              <Button
                className="md:hidden flex"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(selectedDate);
                  setIsDialogOpen(true);
                }}
                aria-label="Add new event"
              >
                Add Event
              </Button>
            </CardTitle>
            <CardDescription className="text-xl">
              Events for{" "}
              {selectedDate.toLocaleString("en-US", {
                dateStyle: "full",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className="max-h-[calc(100vh-14rem)] w-full"
              aria-label="List of events"
            >
              <EventList
                events={events[selectedDate.toLocaleDateString()] || []}
                filterKeyword={filterKeyword}
                onDeleteEvent={deleteEvent}
                onEditEvent={(event) => {
                  setEditingEvent(event);
                  setIsDialogOpen(true);
                }}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <AddEventDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingEvent(null);
        }}
        onAddEvent={addEvent}
        selectedDate={selectedDate}
        existingEvents={events[selectedDate.toLocaleDateString()] || []}
        editingEvent={editingEvent}
        onEditEvent={editEvent}
      />
    </div>
  );
}
