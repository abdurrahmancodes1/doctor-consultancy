import React, { useState } from "react";
import { convertTo24Hour, startOfDay, toLocalYMD } from "../../../utils/helper";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { isPast } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

const CalendarStep = ({
  selectedDate,
  selectedSlot,
  setSelectedDate,
  setSelectedSlot,
  availableDates = [],
  availableSlots = [],
  bookedSlots,
  excludedWeekdays = [],
  onContinue,
}) => {
  const [showMoreSlots, setShowMoreSlots] = useState(false);

  const displaySlots = showMoreSlots
    ? availableSlots
    : availableSlots.slice(0, 10);
  console.log(bookedSlots);
  const isSlotBooked = (slot) => {
    if (!selectedDate) return false;
    const dateString = toLocalYMD(selectedDate);
    const slotDateTime = new Date(`${dateString}T${convertTo24Hour(slot)}`);

    return bookedSlots.some((booked) => {
      const bookedDateTime = new Date(booked);
      if (isNaN(bookedDateTime)) return false;
      return bookedDateTime.getTime() === slotDateTime.getTime();
    });
  };

  const isSlotInPast = (slot) => {
    if (!selectedDate) return false;
    const now = new Date();
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(new Date(selectedDate));

    if (selectedDay.getTime() !== today.getTime()) return false;

    const [time, modifier] = slot.split(" ");
    let [hour, minutes] = time.split(":");

    if (modifier === "PM" && hour !== "12") hour = String(+hour + 12);
    if (modifier === "AM" && hour === "12") hour = "00";

    const slotDateTime = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate(),
      +hour,
      +minutes,
      0
    );

    return slotDateTime.getTime() <= now.getTime() + 5 * 60 * 1000;
  };

  const isDateDisabled = (date) => {
    const today = startOfDay(new Date());
    const checkedDate = startOfDay(date);

    if (checkedDate < today) return true;
    const ymd = toLocalYMD(date);
    if (!availableDates.includes(ymd)) return true;

    return excludedWeekdays.includes(date.getDay());
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Select Date & Time
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Label className="text-base font-semibold mb-4 block">
              Choose Date
            </Label>
            <div className="border rounded-lg p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md"
                classNames={{
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 foucus:text-white",
                  day_today: "bg-blue-100 text-blue-900 font-bold",
                  day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
                }}
              />
            </div>
          </div>

          {/* Time slots */}
          <div>
            <Label className="text-base font-semibold mb-4 block">
              Available Time Slots
              {availableSlots.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({availableSlots.length} slots avaiable)
                </span>
              )}
            </Label>

            {selectedDate ? (
              availableSlots.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 mx-h-80 overflow-y-auto">
                    {displaySlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      const isBooked = isSlotBooked(slot);
                      const isPast = isSlotInPast(slot);
                      const isDisabled = isBooked || isPast;

                      return (
                        <Button
                          key={slot}
                          variant={isSelected ? "default" : "outline"}
                          disabled={isDisabled}
                          className={`p-3 justify-start ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                              : isSelected
                              ? "bg-blue-600 text-white shadow-lg"
                              : "hover:border-blue-200 hover:bg-blue-50"
                          }`}
                          onClick={() => !isDisabled && setSelectedSlot(slot)}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {slot}
                          {isPast && (
                            <span className="text-xs ml-2 opacity-75">
                              (Past)
                            </span>
                          )}
                          {isBooked && !isPast && (
                            <span className="text-xs ml-2 opacity-75">
                              (Booked)
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  {availableSlots.length > 10 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowMoreSlots(!showMoreSlots)}
                    >
                      {showMoreSlots
                        ? "Show Less"
                        : `+ ${availableSlots.length - 10} show more`}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">
                    No slots available
                  </h4>
                  <p className="text-sm">Please Select a different date</p>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">
                  Please Select a date to view available slots
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!selectedDate || !selectedSlot}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CalendarStep;
