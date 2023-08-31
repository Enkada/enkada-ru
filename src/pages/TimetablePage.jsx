import axios from 'axios';
import React, { useEffect, useState } from 'react'


const TimetableWeek = (props) => {
    const [timetable, setTimetable] = useState(null);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get(`https://ruz.spbstu.ru/api/v1/ruz/scheduler/38798?date=${props.date}`);
                setTimetable(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTimetable();
    }, []);

    if (!timetable) {
        return;
    }

    const getWeekTable = () => {
        let weekDays = [];

        let dayDate = new Date(timetable.week.date_start);

        for (let index = 1; index <= 7; index++) {
            const day = timetable.days.find(x => x.weekday == index)

            // if (!day) 
            //     continue;

            weekDays.push(
                <div className={`timetable__day ${day ? "has-lessons" : "no-lessons"}`}>
                    {dayDate.toLocaleDateString("ru-RU", { day: "numeric" })}
                    {!!day && <div className='timetable__day__lessons'>
                        {day.lessons.filter((lesson, index, self) => self.findIndex(l => l.time_start === lesson.time_start) === index).map((lesson, index) =>
                            <div className="lesson"data-subject={lesson.subject}></div>
                        )}
                    </div>}
                </div>
            );

            dayDate.setDate(dayDate.getDate() + 1);
        }

        return weekDays;
    }

    return (
        <div className="timetable__week">
            {getWeekTable()}
        </div>
    )
}

export const TimetablePage = (props) => {

    const dayNames = [
        "Mon",
        "Tue",
        "Wen",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    const getWeekList = () => {
        let weeks = [];

        let date = new Date();

        for (let index = 0; index <= 4; index++) {
            weeks.push(<TimetableWeek date={date.toISOString().split('T')[0]} />)

            date.setDate(date.getDate() + 7);
        }

        return weeks;
    }

    return (
        <div className='timetable'>
            <div className="timetable__day-name-list">
                {dayNames.map((day, index) =>
                    <div className="timetable__day-name">{day}</div>
                )}
            </div>
            <div className="timetable__week-list">
                {getWeekList()}
            </div>
        </div>
    )
}
