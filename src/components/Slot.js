import "./Slot.scss";
import IMAGES from "../assets/images";
import music from "../assets/audio/slot3.wav";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { betOne } from "../redux/game/gameAction";
import { betMax } from "../redux/game/gameAction";
import { resetGame } from "../redux/game/gameAction";
import { reduceCredit } from "../redux/game/gameAction";
import { gameScore } from "../redux/game/gameAction";

import { useRef, useEffect, useState, useCallback } from "react";

function Slot() {
  //number of symbols = 2*12
  const NUMBER_OF_SYMBOLS = 24;
  const initialState = {
    numberOfSymbols: NUMBER_OF_SYMBOLS,
    reelsTopPosition: "",
    symbolHeight: "",
    delta: "",
  };

  const imageArray = [
    { src: IMAGES.seven, value: 100 },
    { src: IMAGES.clover, value: 80 },
    { src: IMAGES.star, value: 70 },
    { src: IMAGES.cherry, value: 60 },
    { src: IMAGES.strawberry, value: 50 },
    { src: IMAGES.watermelon, value: 40 },
    { src: IMAGES.plum, value: 30 },
    { src: IMAGES.banana, value: 25 },
    { src: IMAGES.orange, value: 20 },
    { src: IMAGES.apple, value: 15 },
    { src: IMAGES.lemon, value: 10 },
    { src: IMAGES.tomato, value: 5 },
  ];

  //fisher-yates shuffle algorithm
  function initShuffleArray(arr) {
    for (let i = 0; i < arr.length - 2; i++) {
      const j = Math.floor(Math.random() * (arr.length - i) + i);
      let current = arr[i];
      let random = arr[j];
      arr[j] = current;
      arr[i] = random;
    }
    return [...arr, ...arr];
  }

  const conteinerRef = useRef(null);
  const reelOneRef = useRef(null);

  const reelOneImages = useRef([]);
  const reelTwoImages = useRef([]);
  const reelThreeImages = useRef([]);

  const [gameState, setGameState] = useState(initialState);
  const [reel1, setReel1] = useState([]);
  const [reel2, setReel2] = useState([]);
  const [reel3, setReel3] = useState([]);
  const [started, setStarted] = useState(false);

  //visible vertical part of the array
  const [visibleVertical1, setVisibleVertical1] = useState([]);
  const [visibleVertical2, setVisibleVertical2] = useState([]);
  const [visibleVertical3, setVisibleVertical3] = useState([]);

  //horizontal rows
  const [horizontal1, setHorizontal1] = useState([]);
  const [horizontal2, setHorizontal2] = useState([]);
  const [horizontal3, setHorizontal3] = useState([]);

  const [audio] = useState(new Audio(music));
  const [playing, setPlaying] = useState(false);

  const [finishedReel1, setFinishedReel1] = useState([]);
  const [finishedReel2, setFinishedReel2] = useState([]);
  const [finishedReel3, setFinishedReel3] = useState([]);

  //position of the slot conteiner
  const [top, setTop] = useState();
  const [bottom, setBottom] = useState();

  const bet = useSelector((state) => state.bet);
  const credit = useSelector((state) => state.credit);
  const message = useSelector((state) => state.message);
  const winningResult = useSelector((state) => state.winningResult);

  const dispatch = useDispatch();

  //setting reels on first render
  useEffect(() => {
    setReel1(initShuffleArray([...imageArray]));
    setReel2(initShuffleArray([...imageArray]));
    setReel3(initShuffleArray([...imageArray]));
  }, []);

  //setting reels every time we start the game
  useEffect(() => {
    if (started) {
      setReel1(initShuffleArray([...imageArray]));
      setReel2(initShuffleArray([...imageArray]));
      setReel3(initShuffleArray([...imageArray]));
    }
  }, [started]);

  useEffect(() => {
    const childRefSet = () => {
      const symbolHeight = reelOneRef.current.children[0].offsetHeight;
      const reelsTopPosition = (gameState.numberOfSymbols - 3) * symbolHeight;
      const delta = symbolHeight;
      setGameState((prev) => {
        return { ...prev, symbolHeight, reelsTopPosition, delta };
      });
    };
    setTimeout(childRefSet, 2000);
  }, [reelOneRef]);

  //audio
  useEffect(() => {
    if (playing) {
      audio.play();
    }
    if (!playing) {
      if (audio.currentTime > 0) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [playing, audio]);

  //reset postion to initial position
  const resetPos = () => {
    setGameState((state) => {
      return {
        ...state,
        reelsTopPosition: (state.numberOfSymbols - 3) * state.symbolHeight,
      };
    });
  };

  const animate = useCallback(() => {
    const resetPosition =
      (gameState.numberOfSymbols / 2 - 3) * gameState.symbolHeight;

    setGameState((state) => {
      return {
        ...state,
        reelsTopPosition: state.reelsTopPosition - state.delta,
      };
    });
    if (gameState.reelsTopPosition <= resetPosition) {
      resetPos();
    }
  }, [
    gameState.reelsTopPosition,
    gameState.symbolHeight,
    gameState.numberOfSymbols,
  ]);

  useEffect(() => {
    let timerId;
    if (started) {
      timerId = requestAnimationFrame(animate);
      setPlaying(true);
      setFinishedReel1(reelOneImages);
      setFinishedReel2(reelTwoImages);
      setFinishedReel3(reelThreeImages);
      setTop(conteinerRef.current.getBoundingClientRect().top);
      setBottom(conteinerRef.current.getBoundingClientRect().bottom);
    }

    return () => {
      cancelAnimationFrame(timerId);
    };
  }, [started, gameState.reelsTopPosition, animate]);

  useEffect(() => {
    let setTimeID;
    if (started) {
      setTimeID = setTimeout(() => {
        setStarted(false);
        setPlaying(false);
      }, 3000);
    }

    return () => {
      clearTimeout(setTimeID);
    };
  }, [started]);

  let position = () => {
    let first = [];
    let second = [];
    let third = [];

    finishedReel1.current.forEach((item, index) => {
      if (
        item.getBoundingClientRect().top >= top &&
        item.getBoundingClientRect().bottom <= bottom
      ) {
        first.push(item.id);
      }
      setVisibleVertical1(first);
    });
    finishedReel2.current.forEach((item, index) => {
      if (
        item.getBoundingClientRect().top >= top &&
        item.getBoundingClientRect().bottom <= bottom
      ) {
        second.push(item.id);
      }
      setVisibleVertical2(second);
    });
    finishedReel3.current.forEach((item, index) => {
      if (
        item.getBoundingClientRect().top >= top &&
        item.getBoundingClientRect().bottom <= bottom
      ) {
        third.push(item.id);
      }
      setVisibleVertical3(third);
    });
  };

  useEffect(() => {
    let id;
    if (top && bottom && started === false) {
      id = setTimeout(() => {
        position();
      }, 500);
    }
    return () => {
      clearTimeout(id);
    };
  }, [top, bottom, finishedReel1, finishedReel2, finishedReel3, started]);

  useEffect(() => {
    if (
      visibleVertical1.length !== 0 &&
      visibleVertical2.length !== 0 &&
      visibleVertical3.length !== 0
    ) {
      function makeRows(n1, n2, n3) {
        let res = [];
        let mixedArr = [n1, n2, n3];

        for (let i = 0; i < mixedArr.length; i++) {
          res.push(mixedArr.map((arr) => arr[i]));
        }

        let row1 = res.slice(0, 1);
        let row2 = res.slice(1, 2);
        let row3 = res.slice(2, 3);

        setHorizontal1([...row1[0]]);
        setHorizontal2([...row2[0]]);
        setHorizontal3([...row3[0]]);
      }

      makeRows(visibleVertical1, visibleVertical2, visibleVertical3);
    }
  }, [visibleVertical1, visibleVertical2, visibleVertical3]);

  useEffect(() => {
    if (
      horizontal1.length !== 0 &&
      horizontal2.length !== 0 &&
      horizontal3 !== 0
    ) {
      let score = 0;
      const findMatchSymobls = (arr) => {
        if (arr[0] === arr[1] && arr[1] === arr[2]) {
          let result = +arr[0] + +arr[1] + +arr[2];

          score = score + result;
        } else if (arr[0] === arr[1]) {
          let result = +arr[0] + +arr[1];

          score = score + result;
        } else if (arr[1] === arr[2]) {
          let result = +arr[1] + +arr[2];

          score = score + result;
        }

        dispatch(gameScore(score));
      };

      findMatchSymobls(horizontal1);
      findMatchSymobls(horizontal2);
      findMatchSymobls(horizontal3);
    }
  }, [horizontal1, horizontal2, horizontal3, dispatch]);

  const disableButton = () => {
    if (bet === "" || started) {
      return true;
    }

    if (credit - bet === -1 || credit - bet === -3 || credit - bet < 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="slot-conteiner">
      <section className="slot-conteiner__interface" ref={conteinerRef}>
        <div className="column first">
          <div
            className="reel one"
            ref={reelOneRef}
            style={
              gameState.reelsTopPosition !== ""
                ? {
                    top: `-${gameState.reelsTopPosition}px`,
                  }
                : null
            }
          >
            {reel1.map((item, index) => {
              return (
                <div key={uuidv4()}>
                  <img
                    src={item.src}
                    alt=""
                    ref={(element) => (reelOneImages.current[index] = element)}
                    id={item.value}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="column second">
          <div
            className="reel two"
            style={
              gameState.reelsTopPosition !== ""
                ? {
                    top: `-${gameState.reelsTopPosition}px`,
                  }
                : null
            }
          >
            {" "}
            {reel2.map((item, index) => {
              return (
                <div key={uuidv4()}>
                  <img
                    src={item.src}
                    alt=""
                    ref={(element) => (reelTwoImages.current[index] = element)}
                    id={item.value}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="column third">
          <div
            className="reel three"
            style={
              gameState.reelsTopPosition !== ""
                ? {
                    top: `-${gameState.reelsTopPosition}px`,
                  }
                : null
            }
          >
            {reel3.map((item, index) => {
              return (
                <div key={uuidv4()}>
                  <img
                    src={item.src}
                    alt=""
                    ref={(element) =>
                      (reelThreeImages.current[index] = element)
                    }
                    id={item.value}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="game-controlls">
        <div className="betWiner-conteiner">
          <div className="credit-bet-cont">
            <div className="credit-cont">
              <div>{credit}</div>
              <p>CREDIT</p>
            </div>
            <div className="bet-cont">
              <div>{bet}</div>
              <p>BET</p>
            </div>
          </div>
          <div className="winner-paid-cont">
            <div>{winningResult}</div>
            <p>WINNER PAID</p>
          </div>
        </div>
        <div className="btn-cont">
          <div
            className="reset"
            onClick={() => {
              dispatch(resetGame());
            }}
          >
            reset
          </div>
          <div className="bet-one-bet-max">
            <div
              className="bet-one"
              onClick={() => {
                dispatch(betOne());
              }}
            >
              BET ONE
            </div>
            <div className="bet-max" onClick={() => dispatch(betMax())}>
              BET MAX
            </div>
          </div>
          <button
            className="spin-btn"
            onClick={() => {
              setStarted(!started);

              dispatch(reduceCredit());
            }}
            disabled={disableButton()}
          >
            Spin
          </button>
        </div>
      </section>
      <section className="game-message">
        <div>{message}</div>
        <div>
          {credit - bet === -1 || credit - bet < 0
            ? "Last turn, reset and make your bet!"
            : null}
        </div>
      </section>
    </div>
  );
}

export default Slot;
