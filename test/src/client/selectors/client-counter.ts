import { RootState } from "client/producer";

export const selectClientCount = (state: RootState) => state.clientCounter.count;
