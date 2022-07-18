import {
  RESET_GAME,
  BET_ONE,
  BET_MAX,
  REDUCE_CREDIT,
  SCORE,
} from "./gameTypes";

export const resetGame = () => {
  return {
    type: RESET_GAME,
  };
};

export const betOne = () => {
  return {
    type: BET_ONE,
  };
};

export const betMax = () => {
  return {
    type: BET_MAX,
  };
};

export const reduceCredit = () => {
  return {
    type: REDUCE_CREDIT,
  };
};

export const gameScore = (res) => {
  return {
    type: SCORE,
    payload: res,
  };
};
