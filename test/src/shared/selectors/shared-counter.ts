import { SharedState } from "shared/producer";

export const selectSharedCount = (state: SharedState) => state.sharedCounter.count;
