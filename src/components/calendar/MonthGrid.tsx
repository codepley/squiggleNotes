

// Reusable utilities
export const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

interface Props {
    currentDate: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    tasksByDate: Record<string, number>; // maps "YYYY-MM-DD" -> task count
}

export default function MonthGrid({ currentDate, selectedDate, onSelectDate, tasksByDate }: Props) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderCells = () => {
        const cells = [];

        // paddings for previous month
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-24 sm:h-28 bg-gray-50/50 rounded-xl" />);
        }

        // actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

            const taskCount = tasksByDate[dateStr] || 0;

            cells.push(
                <div
                    key={`day-${day}`}
                    onClick={() => onSelectDate(new Date(year, month, day))}
                    className={`h-24 sm:h-28 border border-gray-100 rounded-xl p-2 cursor-pointer transition-all flex flex-col items-start ${isSelected
                        ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500 shadow-sm'
                        : 'bg-white hover:border-indigo-300 hover:shadow-md'
                        }`}
                >
                    <div className="flex w-full items-center justify-between">
                        <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : isSelected ? 'text-indigo-900' : 'text-gray-700'
                            }`}>
                            {day}
                        </span>

                        {taskCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-purple-500" title={`${taskCount} tasks`} />
                        )}
                    </div>

                    <div className="mt-auto w-full flex flex-col gap-1">
                        {taskCount > 0 && (
                            <div className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded overflow-hidden text-ellipsis whitespace-nowrap">
                                {taskCount} task{taskCount > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return cells;
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-7 gap-2 mb-2">
                {WEEKS.map(w => (
                    <div key={w} className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2">
                        {w}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {renderCells()}
            </div>
        </div>
    );
}
