import { User } from "@prisma/client"
import dayjs from "dayjs"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {z} from "zod"
import {prisma} from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {
    //autenticação
    app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const auth = request.headers.authorization || "";
            const token = auth.split(" ")[1];

            await app.jwt.verify(token, async (err, decoded) => {
            if (err) throw new Error(`message: ${err}`);
                request.user = decoded;
            });
        } catch (err) {
            reply.send(err)
        }
    })

    //create habit
    app.post("/habits",{
        //@ts-ignore
        onRequest: [app.authenticate]
      }, async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number()).min(0).max(6),
        })

        const {title, weekDays} = createHabitBody.parse(request.body)

        const today = dayjs().startOf("day").toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                //@ts-ignore
                user_id: request.user.id,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })
    })

    //list day habits
    app.get("/day",{
        //@ts-ignore
        onRequest: [app.authenticate]
      }, async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const {date} = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf("day")
        const today = parsedDate.toDate()
        const weekDay = dayjs(parsedDate).get("day")

        const possibleHabits = await prisma.habit.findMany({
            where: {
                //@ts-ignore
                user_id: request.user.id,
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: today,
            },
            include: {
                dayHabits: true,
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            for(var habit of possibleHabits) {
                if(habit.id == dayHabit.habit_id) {
                   return dayHabit.habit_id
                }
            }
        }) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    //toggle completed habit
    app.patch("/habits/:id/toggle",{
        //@ts-ignore
        onRequest: [app.authenticate]
      }, async(request, reply) => {
        const toggleHabitsParams = z.object({
            id: z.string().uuid()
        })

        const {id} = toggleHabitsParams.parse(request.params)

        const today = dayjs().startOf("day").toDate()

        //validar se o habit pertence a esse usuário
        const habit = await prisma.habit.findUnique({
            where: {
                id,
            }
        })

        //@ts-ignore
        if(!habit || habit.user_id !== request.user.id) {
            return reply.status(400).send({message: "Seu hábito não existe!"})
        }

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if(!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if(dayHabit) {
            //desmarcar como completo
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })

        } else {
            //marcar como completo
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
        
    })
    
    //resumo dos habits days
    app.get("/summary",{
        //@ts-ignore
        onRequest: [app.authenticate]
      }, async (request) => {
        //@ts-ignore
        const userID: string = request.user.id

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    JOIN habits H
                        ON H.id = DH.habit_id AND H.user_id = ${userID}
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id  = HWD.habit_id AND H.user_id = ${userID}
                    WHERE 
                        HWD.week_day = cast(strftime("%w", D.date / 1000.0, "unixepoch") as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D
        `

        return summary;
    })

    //login
    app.post("/signin", async(request, response) => {
        const createUserBody = z.object({
            email: z.string(),
            username: z.string(),
            picture: z.string()
        })

        const {email, username, picture} = createUserBody.parse(request.body)

        let user:User | null;
        let token: string;

        user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user || user.email !== email) {
            const today = dayjs().startOf("day").toDate()

            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    picture,
                    created_at: today
                }
            })
        } else if(user.picture !== picture || user.username !== username) {
            user = await prisma.user.update({
                where: {
                    email
                },
                data: {
                    picture,
                    username
                }
            })
        }

        token = app.jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username
        })

        return response.status(200).send({token})
    })
}