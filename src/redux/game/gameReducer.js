import {
  CHECK_RESULT,
  RESET_GAME,
  BET_ONE,
  BET_MAX,
  REDUCE_CREDIT,
} from "./gameTypes";

const initialState = {
  bet: "",
  winningResult: 0,
  credit: 20,
  message: "",
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case BET_ONE: {
      return {
        ...state,
        bet: 1,
      };
    }
    case BET_MAX: {
      return {
        ...state,
        bet: 3,
      };
    }
    case REDUCE_CREDIT: {
      if (state.credit - state.bet < 0) {
        return {
          ...state,
          message: "you don`t have enought credit",
        };
      } else {
        return {
          ...state,
          credit: state.credit - state.bet,
        };
      }
    }
    case CHECK_RESULT: {
      return state;
    }
    case RESET_GAME: {
      return initialState;
    }

    default:
      return state;
  }
};

export default gameReducer;
