import { RootState } from "server/producer";

export const selectSharedCount = (state: RootState) => state.serverCounter.count;
