import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Event } from "./Calendar";

const colors = [
  { name: "Red", value: "bg-red-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Purple", value: "bg-purple-500" },
];

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Omit<Event, "id">) => void;
  onEditEvent: (event: Event) => void;
  selectedDate: Date | null;
  existingEvents: Array<{ startTime: string; endTime: string }>;
  editingEvent: Event | null;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onAddEvent,
  onEditEvent,
  selectedDate,
  existingEvents,
  editingEvent,
}: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0].value);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //if editing an event then preset the info
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || "");
      setColor(editingEvent.color);
      setStartTime(editingEvent.startTime);
      setEndTime(editingEvent.endTime);
    } else {
      // else work normally
      setTitle("");
      setDescription("");
      setColor(colors[0].value);
      setStartTime("09:00");
      setEndTime("10:00");
    }
  }, [editingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isOverlapping = existingEvents.some((event) => {
      if (editingEvent) return false; // do not checking while editing event
      return (
        (startTime >= event.startTime && startTime < event.endTime) ||
        (endTime > event.startTime && endTime <= event.endTime) ||
        (startTime <= event.startTime && endTime >= event.endTime)
      );
    });

    if (isOverlapping) {
      setError(
        "Event overlaps with an existing event. Please choose a different time."
      );
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    const eventData = { title, description, color, startTime, endTime };

    if (editingEvent) {
      onEditEvent({ ...eventData, id: editingEvent.id });
    } else {
      onAddEvent(eventData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px] rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>
            {editingEvent ? "Edit event " : "Add event "}
            for{" "}
            {selectedDate?.toLocaleString("en-US", {
              dateStyle: "medium",
            })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Add necessary details of the event
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="title" className="text-left">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 max-h-36"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="startTime" className="text-left">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="endTime" className="text-left">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-left">Color</Label>
              <RadioGroup
                value={color}
                onValueChange={setColor}
                className="flex col-span-3"
              >
                {colors.map((c) => (
                  <div key={c.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={c.value} id={c.value} />
                    <Label htmlFor={c.value}>
                      <div className={`w-4 h-4 rounded-full ${c.value}`}></div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-center mb-4 text-xs">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit">{editingEvent ? "Save changes" : "Add event"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
