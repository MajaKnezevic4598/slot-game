import {
  CHECK_RESULT,
  RESET_GAME,
  BET_ONE,
  BET_MAX,
  REDUCE_CREDIT,
} from "./gameTypes";

export const check = (res) => {
  return {
    type: CHECK_RESULT,
    paylod: res,
  };
};

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
