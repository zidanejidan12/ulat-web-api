// services/osuMappoolServices.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getBeatmapData } from '../../infrastructure/osuApi.js';
import { saveMappool, getCachedMappool, getMappoolByName } from '../../infrastructure/repositories/osuMappoolRepositories.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { Mappool } from '../../domain/models/osuMappool.js';
export const fetchBeatmapData = (beatmapId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield getBeatmapData(beatmapId);
    return data;
});
export const createMappool = (name, beatmapIds) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || !Array.isArray(beatmapIds) || beatmapIds.length === 0) {
        console.error('Invalid mappool data: Missing name or beatmapIds');
        throw new BadRequestError('Invalid mappool data. A mappool must have a name and at least one beatmap.');
    }
    // Check for duplicate mappool name
    const existingMappool = yield getMappoolByName(name);
    if (existingMappool) {
        console.error(`Mappool with name "${name}" already exists`);
        throw new BadRequestError(`Mappool with name "${name}" already exists`);
    }
    console.log('Fetching beatmap data for IDs:', beatmapIds);
    const beatmaps = yield Promise.all(beatmapIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`Fetching data for beatmap ID ${id}`);
            const beatmap = yield fetchBeatmapData(id);
            console.log(`Fetched beatmap data for ID ${id}:`, beatmap);
            // Validate the returned beatmap data
            if (!beatmap || !beatmap.beatmapId) {
                console.error(`Invalid beatmap data for ID ${id}:`, beatmap);
                throw new BadRequestError(`Invalid beatmap data for ID ${id}`);
            }
            return beatmap;
        }
        catch (error) {
            console.error(`Error fetching beatmap data for ID ${id}:`, error);
            throw error;
        }
    })));
    const newMappool = new Mappool({
        name,
        beatmaps,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    console.log('Creating new mappool:', newMappool);
    return yield saveMappool(newMappool);
});
export const getMappool = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const mappool = yield getCachedMappool(name);
    if (!mappool) {
        throw new BadRequestError('Mappool not found');
    }
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (mappool.updatedAt < oneWeekAgo) {
        console.log(`Refreshing beatmap data for mappool "${name}"`);
        const updatedBeatmaps = yield Promise.all(mappool.beatmaps.map((beatmap) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updatedBeatmap = yield fetchBeatmapData(beatmap.beatmapId.toString());
                console.log(`Fetched updated beatmap data for ID ${beatmap.beatmapId}:`, updatedBeatmap);
                return updatedBeatmap;
            }
            catch (error) {
                console.error(`Error fetching updated beatmap data for ID ${beatmap.beatmapId}:`, error);
                return beatmap;
            }
        })));
        mappool.beatmaps = updatedBeatmaps;
        mappool.updatedAt = new Date();
        yield mappool.save();
    }
    return mappool;
});
