import "./Slot.scss";
import IMAGES from "../assets/images";

import { useRef, useEffect, useState } from "react";

function Slot() {
  //imacemo 2 puta 12 symbola tj 24
  const NUMBER_OF_SYMBOLS = 24;
  const initialState = {
    numberOfSymbols: NUMBER_OF_SYMBOLS,
    reelsTopPosition: "",
    symbolHeight: "",
    delta: "",
  };

  const imageArray = [
    IMAGES.apple,
    IMAGES.seven,
    IMAGES.strawberry,
    IMAGES.plum,
    IMAGES.lemon,
    IMAGES.watermelon,
    IMAGES.clover,
    IMAGES.orange,
    IMAGES.star,
    IMAGES.tomato,
    IMAGES.banana,
    IMAGES.cherry,
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

  //ovde moramo da imamo dva puta isti raspored u nizu zbog animacije

  const conteinerRef = useRef(null);
  const reelOneRef = useRef(null);
  const childRef = useRef(null);

  const [gameState, setGameState] = useState(initialState);
  const [reel1, setReel1] = useState([]);
  const [reel2, setReel2] = useState([]);
  const [reel3, setReel3] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setReel1(initShuffleArray([...imageArray]));
    setReel2(initShuffleArray([...imageArray]));
    setReel3(initShuffleArray([...imageArray]));
  }, []);

  const animate = () => {
    const resetPosition =
      (gameState.numberOfSymbols / 2 - 3) * gameState.symbolHeight;
    console.log(resetPosition);
    console.log("ja sam resetovana pozicija");
    setGameState((state) => {
      return {
        ...state,
        reelsTopPosition: state.reelsTopPosition - state.delta,
      };
    });
    console.log(gameState.reelsTopPosition);
    if (gameState.reelsTopPosition <= resetPosition) {
      resetPos();
      console.log("resetovanooooooo");
      console.log(gameState.reelsTopPosition);
    }
  };

  useEffect(() => {
    if (started) {
      let timerId;

      timerId = requestAnimationFrame(animate);
      setTimeout(() => {
        setStarted(false);
      }, 2000);
      return () => cancelAnimationFrame(timerId);
    }
  }, [started, gameState.reelsTopPosition]);

  useEffect(() => {
    console.log(gameState.reelsTopPosition);
    console.log("sada sam drugacija od praznog stringa");
  }, [gameState.reelsTopPosition]);

  useEffect(() => {
    console.log(reelOneRef);
  }, [reelOneRef]);

  useEffect(() => {
    const childRefSet = () => {
      if (childRef.current !== null) {
        console.log(childRef.current.offsetHeight);
        const symbolHeight = childRef.current.offsetHeight;
        const reelsTopPosition = (gameState.numberOfSymbols - 3) * symbolHeight;
        const delta = symbolHeight;
        //stavili smo da nam delta bude symbolHeight kako bi animacija uvek poravnavala simbole
        setGameState((prev) => {
          return { ...prev, symbolHeight, reelsTopPosition, delta };
        });
      }
    };
    setTimeout(childRefSet, 300);
  }, [childRef]);

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  const resetPos = () => {
    setGameState((state) => {
      return {
        ...state,
        reelsTopPosition: (state.numberOfSymbols - 3) * state.symbolHeight,
      };
    });
  };

  return (
    <div className="slot-conteiner">
      <h3>Hello from slot!</h3>
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
                <div key={index} ref={childRef}>
                  <img src={item} alt="" />
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
                <div key={index}>
                  <img src={item} alt="" />
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
                <div key={index}>
                  <img src={item} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <button
        onClick={() => {
          setStarted(true);
        }}
      >
        Spin
      </button>
    </div>
  );
}

export default Slot;
