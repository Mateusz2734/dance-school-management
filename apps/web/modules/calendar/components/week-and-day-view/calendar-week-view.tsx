
import { startOfWeek, addDays, format, parseISO, isSameDay } from "date-fns";
import { motion } from "framer-motion";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import {
    fadeIn,
    staggerContainer,
    transition,
} from "@/modules/calendar/animations";

import { ScrollArea } from "@repo/ui/scroll-area";
import { AddEditEventDialog } from "@/modules/calendar/components/dialogs/add-edit-event-dialog";
import { CalendarTimeline } from "@/modules/calendar/components/week-and-day-view/calendar-time-line";
import { groupEvents } from "@/modules/calendar/helpers";
import type { IEvent } from "@/modules/calendar/interfaces";
import { RenderGroupedEvents } from "@/modules/calendar/components/week-and-day-view/render-grouped-events";

interface IProps {
    singleDayEvents: IEvent[];
    multiDayEvents: IEvent[];
}

export function CalendarWeekView({ singleDayEvents }: IProps) {
    const { selectedDate } = useCalendar();

    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={transition}
        >
            <motion.div
                className="flex flex-col items-center justify-center border-b py-4 text-sm text-t-quaternary sm:hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
            >
                <p>Weekly view is not available on smaller devices.</p>
                <p>Please switch to daily or monthly view.</p>
            </motion.div>

            <motion.div
                className="hidden flex-col sm:flex"
                variants={staggerContainer}
            >
                <div>
                    {/* Week header */}
                    <motion.div
                        className="relative z-20 flex border-b"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={transition}
                    >
                        <div className="w-18"></div>
                        <div className="grid flex-1 grid-cols-7 divide-x border-l">
                            {weekDays.map((day, index) => (
                                <motion.span
                                    key={index}
                                    className="py-2 text-center text-xs font-medium text-t-quaternary"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, ...transition }}
                                >
                                    {format(day, "EE")}{" "}
                                    <span className="ml-1 font-semibold text-t-secondary">
                                        {format(day, "d")}
                                    </span>
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <ScrollArea className="h-[736px]" type="always">
                    <div className="flex">
                        {/* Hours column */}
                        <motion.div className="relative w-18" variants={staggerContainer}>
                            {hours.map((hour, index) => (
                                <motion.div
                                    key={hour}
                                    className="relative"
                                    style={{ height: "96px" }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02, ...transition }}
                                >
                                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                                        {index !== 0 && (
                                            <span className="text-xs text-t-quaternary">
                                                {format(new Date().setHours(hour, 0, 0, 0), "HH:00")}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Week grid */}
                        <motion.div
                            className="relative flex-1 border-l"
                            variants={staggerContainer}
                        >
                            <div className="grid grid-cols-7 divide-x">
                                {weekDays.map((day, dayIndex) => {
                                    const dayEvents = singleDayEvents.filter(
                                        (event) =>
                                            isSameDay(parseISO(event.startDate), day) ||
                                            isSameDay(parseISO(event.endDate), day)
                                    );
                                    const groupedEvents = groupEvents(dayEvents);

                                    return (
                                        <motion.div
                                            key={dayIndex}
                                            className="relative"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: dayIndex * 0.1, ...transition }}
                                        >
                                            {hours.map((hour, index) => (
                                                <motion.div
                                                    key={hour}
                                                    className="relative"
                                                    style={{ height: "96px" }}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.01, ...transition }}
                                                >
                                                    {index !== 0 && (
                                                        <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                                                    )}

                                                    <AddEditEventDialog
                                                        startDate={day}
                                                        startTime={{ hour, minute: 0 }}
                                                    >
                                                        <div className="absolute inset-x-0 top-0 h-[48px] cursor-pointer transition-colors hover:bg-bg-primary-hover" />
                                                    </AddEditEventDialog>

                                                    <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary"></div>

                                                    <AddEditEventDialog
                                                        startDate={day}
                                                        startTime={{ hour, minute: 30 }}
                                                    >
                                                        <div className="absolute inset-x-0 top-[48px] h-[48px] cursor-pointer transition-colors hover:bg-bg-primary-hover" />
                                                    </AddEditEventDialog>
                                                </motion.div>
                                            ))}

                                            <RenderGroupedEvents
                                                groupedEvents={groupedEvents}
                                                day={day}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <CalendarTimeline />
                        </motion.div>
                    </div>
                </ScrollArea>
            </motion.div>
        </motion.div>
    );
}