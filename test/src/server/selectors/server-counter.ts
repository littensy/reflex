import { RootState } from "server/producer";

export const selectServerCount = (state: RootState) => state.serverCounter.count;
