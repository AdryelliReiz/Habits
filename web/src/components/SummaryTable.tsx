import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning.ts"
import { HabitDay } from "./HabitDay"

const weekDays = ["D", "S", "T","Q", "Q", "S", "S"]

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
    
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, index) => (
                    <div 
                        key={`${weekDay}-${index}`} 
                        className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                    >
                        {weekDay}
                    </div>
                ))}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summaryDates.map((date) => (
                    <HabitDay key={date.toString()} />
                ))}
                {amountOfDaysToFill > 0 && Array.from({length: amountOfDaysToFill}).map((_, i) => (
                     <div 
                        key={i} 
                        className="bg-zinc-900 w-10 h-10 rounded-lg border-zinc-800 opacity-40 cursor-not-allowed"
                    />
                ))}
            </div>
        </div>
    )
}