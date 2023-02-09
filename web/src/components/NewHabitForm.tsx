import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FormEvent, useContext, useState } from "react";
import { api } from "../lib/axios";
import { AuthenticateTokenContext } from "../contexts/AuthenticateTokenContext";

const availableWeekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quart-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]

export function NewHabitForm() {
    const [title, setTitle] = useState("");
    const [weekDays, setWeekDays] = useState<Number[]>([])

    const {token} = useContext(AuthenticateTokenContext)

    function handleToggleWeekDay(weekDay: Number) {
        if(weekDays.includes(weekDay)) {
            const weekDaysWithRemoveOne = weekDays.filter(day => day !== weekDay)

            setWeekDays(weekDaysWithRemoveOne)
        } else {
            const weekDayswithAddOne = [...weekDays, weekDay]

            setWeekDays(weekDayswithAddOne)
        }
    }

    async function createNewHabit(event: FormEvent) {
        event.preventDefault()

        try {
            if(!title || weekDays.length === 0) {
                return
            }
            
            if(!token) {
                return
            }
    
            await api.post("/habits", {
                title,
                weekDays
                
            }, 
            {
                headers: {
                    "Authorization": `Basic ${token}`
                }
            }
            )
    
            setTitle("")
            setWeekDays([])
    
            alert("Hábito criado com sucesso!")
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <form onSubmit={createNewHabit}  className="w-full flex flex-col mt-6" >
            <label htmlFor="title" className="font-semibold leading-tight" >
                Qual seu comprometimento?
            </label>

            <input 
                type="text"
                id="title"
                placeholder="ex.: Exercícios, dormir bem, etc..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900" 
                autoFocus
                value={title}
                onChange={event => setTitle(event.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4" >
                Qual a recorrência?
            </label>

            <div className="mt-3 flex flex-col gap-2">
                {availableWeekDays.map((weekDay, i) => (
                    <Checkbox.Root 
                        key={`${weekDay}-${i}`}
                        className="flex items-center gap-3 group focus:outline-none" 
                        checked={weekDays.includes(i)}
                        onCheckedChange={() => handleToggleWeekDay(i)}
                    >
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white" />
                            </Checkbox.Indicator>
                        </div>

                        <span className="text-white leading-tight" >
                            {weekDay}
                        </span>
                    </Checkbox.Root>
                ))}
            </div>

            <button 
                type="submit" 
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
                <Check size={20} height="bold" />
                Confirmar
            </button>
        </form>
    )
}