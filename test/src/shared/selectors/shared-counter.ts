import { SharedState } from "shared/slices";

export const selectSharedCount = (state: SharedState) => state.sharedCounter.count;
