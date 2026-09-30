import { db, TimeLog, NewTimeLog } from '../db/database.js';

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<TimeLog> {
  const newLog: NewTimeLog = {
    ticket_id: ticketId,
    user_id: userId,
    hours,
  };

  return await db
    .insertInto('time_logs')
    .values(newLog)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  const result = await db
    .selectFrom('time_logs')
    .select((eb) => eb.fn.sum<number>('hours').as('total'))
    .where('ticket_id', '=', ticketId)
    .executeTakeFirst();

  return Number(result?.total ?? 0);
}
