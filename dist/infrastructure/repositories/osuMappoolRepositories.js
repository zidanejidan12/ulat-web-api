var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// infrastructure/repositories/osuMappoolRepositories.ts
import { Mappool } from '../../domain/models/osuMappool.js';
export const saveMappool = (mappool) => __awaiter(void 0, void 0, void 0, function* () {
    const newMappool = new Mappool(mappool);
    return yield newMappool.save();
});
export const getCachedMappool = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Mappool.findOne({ name });
});
export const getMappoolByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Mappool.findOne({ name });
});
