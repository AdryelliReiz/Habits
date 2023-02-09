import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { AuthenticateTokenContext } from "../contexts/AuthenticateTokenContext";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning.ts"
import { HabitDay } from "./HabitDay"

const weekDays = ["D", "S", "T","Q", "Q", "S", "S"]

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = Array<{
    id: string
    date: string
    amount: number
    completed: number
}>

export function SummaryTable() {
    const [summary, setSummary] = useState<Summary>([])

    const {token} = useContext(AuthenticateTokenContext)

    useEffect(() => {
        if(token !== "") {
            console.log(token)
            api.get("/summary", {
                headers: {
                    "Authorization": `Basic ${token}`
                }
            }).then(response => {
                console.log(response.data)
                setSummary(response.data)
            })
        }
    }, [token])
    
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

            <div className="w-full overflow-x-scroll grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summaryDates.map((date) => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, "day")
                    })
                    return(
                        <HabitDay 
                            key={date.toString()}
                            date={date}
                            amount={dayInSummary?.amount} 
                            defaultCompleted={dayInSummary?.completed} 
                        />
                    )
                })}
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