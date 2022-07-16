import "./Slot.scss";
import IMAGES from "../assets/images";
import music from "../assets/audio/slot3.wav";
import { v4 as uuidv4 } from "uuid";

import { useRef, useEffect, useState, useCallback } from "react";

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

  //ovde moramo da imamo dva puta isti raspored u nizu zbog animacije

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

  //ovde pravimo niz od simbola koji su vidljivi
  const [visibleVertical1, setVisibleVertical1] = useState([]);
  const [visibleVertical2, setVisibleVertical2] = useState([]);
  const [visibleVertical3, setVisibleVertical3] = useState([]);

  const [audio] = useState(new Audio(music));
  const [playing, setPlaying] = useState(false);

  const [finishedReel1, setFinishedReel1] = useState([]);
  const [finishedReel2, setFinishedReel2] = useState([]);
  const [finishedReel3, setFinishedReel3] = useState([]);

  //position of conteiner
  const [top, setTop] = useState();
  const [bottom, setBottom] = useState();

  useEffect(() => {
    setReel1(initShuffleArray([...imageArray]));
    setReel2(initShuffleArray([...imageArray]));
    setReel3(initShuffleArray([...imageArray]));
  }, []);

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
  }, [playing]);

  // const innerSybmolsAfterAnimation = () => {
  //   const firstCol = [];
  //   if (reelOneRef !== null) {
  //     console.log(reelOneRef);
  //     console.log("ovo je posle kada se zavrsi vrtenje");
  //   }
  // };

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
    if (started) {
      let timerId;
      timerId = requestAnimationFrame(animate);
      setPlaying(true);
      setTimeout(() => {
        setStarted(false);
        setPlaying(false);
        setFinishedReel1(reelOneImages);
        setFinishedReel2(reelTwoImages);
        setFinishedReel3(reelThreeImages);
        setTop(conteinerRef.current.getBoundingClientRect().top);
        setBottom(conteinerRef.current.getBoundingClientRect().bottom);
      }, 3000);

      return () => {
        cancelAnimationFrame(timerId);
      };
    }
  }, [started, gameState.reelsTopPosition]);

  useEffect(() => {
    console.log(finishedReel1);
    console.log(finishedReel2);
    console.log(finishedReel3);
  }, [finishedReel1, finishedReel2, finishedReel3]);

  useEffect(() => {
    if (top) {
      console.log(top);
      console.log(bottom);
      console.log(typeof finishedReel1);
      finishedReel1.current.forEach((item, index) => {
        console.log(item.getBoundingClientRect().top);
        if (
          item.getBoundingClientRect().top >= top &&
          item.getBoundingClientRect().top <= bottom
        ) {
          setVisibleVertical1((prev) => {
            return [...prev, item];
          });
        }
      });
      finishedReel2.current.forEach((item, index) => {
        console.log(item.getBoundingClientRect().top);
        if (
          item.getBoundingClientRect().top >= top &&
          item.getBoundingClientRect().top <= bottom
        ) {
          setVisibleVertical2((prev) => {
            return [...prev, item];
          });
        }
      });
      finishedReel3.current.forEach((item, index) => {
        console.log(item.getBoundingClientRect().top);
        if (
          item.getBoundingClientRect().top >= top &&
          item.getBoundingClientRect().top <= bottom
        ) {
          setVisibleVertical3((prev) => {
            return [...prev, item];
          });
        }
      });
    }
  }, [top, bottom]);

  useEffect(() => {
    console.log(visibleVertical1);
    console.log(visibleVertical2);
    console.log(visibleVertical3);
  }, [visibleVertical1, visibleVertical2, visibleVertical3]);

  //moramo da pretrazujemo divove i da pravimo niz izmedju topa i bottoma

  // useEffect(() => {
  //   console.log(gameState.reelsTopPosition);
  //   console.log("sada sam drugacija od praznog stringa");
  // }, [gameState.reelsTopPosition]);

  // useEffect(() => {
  //   console.log(reelOneRef);
  // }, [reelOneRef]);

  useEffect(() => {
    const childRefSet = () => {
      if (reelOneImages.length !== 0) {
        const symbolHeight = reelOneImages.current[0].offsetHeight;
        const reelsTopPosition = (gameState.numberOfSymbols - 3) * symbolHeight;
        const delta = symbolHeight;
        //stavili smo da nam delta bude symbolHeight kako bi animacija uvek poravnavala simbole
        setGameState((prev) => {
          return { ...prev, symbolHeight, reelsTopPosition, delta };
        });
      }
    };
    setTimeout(childRefSet, 300);
  }, [reelOneImages]);

  const divsPosition = () => {
    if (reelOneImages.current.length !== 0) {
      for (let i = 0; i < reelOneImages.current.length; i++) {
        let topPosition = reelOneImages.current[i].getBoundingClientRect().top;
        console.log(i);
        console.log(topPosition);
      }
    }
  };

  // useEffect(() => {
  //   setTimeout(divsPosition, 4000);
  // }, [reelOneImages]);

  // useEffect(() => {
  //   console.log(gameState);
  // }, [gameState]);

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
                <div
                  key={uuidv4()}
                  ref={(element) => (reelOneImages.current[index] = element)}
                  id={item.value}
                >
                  <img src={item.src} alt="" />
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
                <div
                  key={uuidv4()}
                  ref={(element) => (reelTwoImages.current[index] = element)}
                  id={item.value}
                >
                  <img src={item.src} alt="" />
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
                <div
                  key={uuidv4()}
                  ref={(element) => (reelThreeImages.current[index] = element)}
                  id={item.value}
                >
                  <img src={item.src} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <button
        onClick={() => {
          setStarted(!started);
        }}
      >
        Spin
      </button>
    </div>
  );
}

export default Slot;
