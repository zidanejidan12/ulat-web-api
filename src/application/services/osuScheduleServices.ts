import { saveSchedule, getSchedules, getScheduleById } from '../../infrastructure/repositories/osuScheduleRepositories';
import { getTeamById } from '../../infrastructure/repositories/osuTeamRepositories';
import { Schedule, ISchedule } from '../../domain/models/osuSchedule';
import { BadRequestError } from '../errors/BadRequestError';

export const createSchedule = async (team1Id: string, team2Id: string, date: string) => {
  const team1 = await getTeamById(team1Id);
  const team2 = await getTeamById(team2Id);

  if (!team1) {
    throw new BadRequestError(`Team with ID ${team1Id} does not exist.`);
  }
  if (!team2) {
    throw new BadRequestError(`Team with ID ${team2Id} does not exist.`);
  }

  const schedule = new Schedule({
    team1Id: team1._id,
    team1Name: team1.name,
    team2Id: team2._id,
    team2Name: team2.name,
    date,
  });

  return await saveSchedule(schedule);
};

export const fetchSchedules = async () => {
  return await getSchedules();
};

export const fetchScheduleById = async (id: number) => {
  return await getScheduleById(id);
};