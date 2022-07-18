import {
  RESET_GAME,
  BET_ONE,
  BET_MAX,
  REDUCE_CREDIT,
  SCORE,
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
          message: "",
        };
      }
    }
    case SCORE: {
      return {
        ...state,
        winningResult: state.bet * action.payload,
        message: action.payload === 0 ? "try again!" : "you won!",
      };
    }
    case RESET_GAME: {
      return initialState;
    }

    default:
      return state;
  }
};

export default gameReducer;
