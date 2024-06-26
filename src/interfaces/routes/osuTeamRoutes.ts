import { Router } from 'express';
import { postCreateTeam, getAllTeams, getTeamById, getTeamsByUsername, removeTeamById, removeMemberFromTeam, updateTeamMembersById} from '../controllers/osuTeamController';

const router = Router();

router.post('/teams', postCreateTeam);
router.get('/teams', getAllTeams);
router.get('/teams/:id', getTeamById);
router.delete('/teams/:id', removeTeamById);
router.delete('/teams/:teamId/members/:userId', removeMemberFromTeam);
router.put('/teams/:id/members', updateTeamMembersById);
router.get('/teams/username/:username', getTeamsByUsername);

export default router;
