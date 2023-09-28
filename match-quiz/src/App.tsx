// import "./styles.css";
import "./style.css";
import { capitalQuiz, cinemaQuiz, superHeroQuiz } from "./Data";
import { useState } from "react";
import Category from "./components/Category";
import First from "./components/First";
import Second from "./components/Second";

export default function App() {
  const hash = {
    "Capitals Quiz": capitalQuiz,
    "Cinema Quiz": cinemaQuiz,
    "Superhero Quiz": superHeroQuiz,
  };

  const [category, setCategory] = useState(cinemaQuiz);

  const [isActive, setIsActive] = useState(false);
  const [answer, setAnswer] = useState<string | undefined>("");
  const [first, setFirst] = useState(
    category
      .map((firstMatch) => firstMatch.first)
      .sort(() => Math.random() - 0.5)
  );
  const [second, setSecond] = useState(
    category
      .map((secondMatch) => secondMatch.second)
      .sort(() => Math.random() - 0.5)
  );
  const [score, setScore] = useState(0);

  const congratulations = (target: HTMLElement, type: string) => {
    setScore((prevScore) => prevScore + 2);
    if (type === "first") {
      setFirst(first.filter((firstMatch) => firstMatch !== target.innerText));
      const primes: HTMLElement[] = Array.from(
        document.querySelectorAll(".seconds")
      );
      const a = primes.find(
        (prime) => prime.style.backgroundColor === "orange"
      ) as HTMLElement;
      setSecond(second.filter((cap) => cap !== a.innerText));
    } else {
      setSecond(
        second.filter((categoryMember) => categoryMember !== target.innerText)
      );
      const secs: HTMLElement[] = Array.from(
        document.querySelectorAll(".firsts")
      );
      const b = secs.find(
        (sec) => sec.style.backgroundColor === "orange"
      ) as HTMLElement;
      setFirst(
        first.filter((categoryMember) => categoryMember !== b.innerText)
      );
    }
  };

  const checker = (place: string, type: string) => {
    const item = category.find(
      (element) => element[type as keyof typeof element] === place
    );
    if (item) {
      setAnswer(type === "first" ? item.second : item.first);
    }
  };

  const showWrong = (target: HTMLElement, type: string) => {
    setScore((prevScore) => prevScore - 1);
    target.style.backgroundColor = "red";
    if (type === "first") {
      const secs: HTMLElement[] = Array.from(
        document.querySelectorAll(".seconds")
      );
      const a = secs.find(
        (sec) => sec.style.backgroundColor === "orange"
      ) as HTMLElement;
      a.style.backgroundColor = "red";
    } else {
      const primes: HTMLElement[] = Array.from(
        document.querySelectorAll(".firsts")
      );
      const b = primes.find(
        (secs) => secs.style.backgroundColor === "orange"
      ) as HTMLElement;
      b.style.backgroundColor = "red";
    }
  };

  const clearColours = (state: string) => {
    const primes: HTMLElement[] = Array.from(
      document.querySelectorAll(".firsts")
    );
    const secs: HTMLElement[] = Array.from(
      document.querySelectorAll(".seconds")
    );
    if (state === "category") {
      primes.forEach((prime) => {
        prime.style.backgroundColor = "thistle";
      });
      secs.forEach((sec) => {
        sec.style.backgroundColor = "lightblue";
      });
    }
    if (state === "inactive") {
      primes.forEach((prime) => {
        if (prime.style.backgroundColor === "red")
          prime.style.backgroundColor = "thistle";
      });
      secs.forEach((sec) => {
        if (sec.style.backgroundColor === "red")
          sec.style.backgroundColor = "lightblue";
      });
    } else {
      primes.forEach((prime) => {
        if (prime.style.backgroundColor === "orange")
          prime.style.backgroundColor = "thistle";
      });
      secs.forEach((sec) => {
        if (sec.style.backgroundColor === "orange")
          sec.style.backgroundColor = "lightblue";
      });
    }
  };

  const firstClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isActive) {
      if (!first.includes(answer as string)) return;
      if (target.innerText === answer) {
        congratulations(target, "first");
        clearColours("active");
        setIsActive(false);
        setAnswer("");
      } else {
        showWrong(target, "first");
        setIsActive(false);
        setAnswer("");
      }
      return;
    } else {
      clearColours("inactive");
      target.style.background = "orange";
      setIsActive(true);
    }
    checker(target.innerText, "first");
  };

  const secondClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isActive) {
      if (!second.includes(answer as string)) return;
      if (target.innerText === answer) {
        congratulations(target, "second");
        clearColours("active");
        setAnswer("");
        setIsActive(false);
      } else {
        showWrong(target, "second");
        setIsActive(false);
        setAnswer("");
      }
      return;
    } else {
      clearColours("inactive");
      target.style.background = "orange";
      setIsActive(true);
    }
    checker(target.innerText, "second");
  };

  const changeCategory = (selectedCategory: string) => {
    const selected = hash[selectedCategory as keyof typeof hash];
    setCategory(selected);
    setFirst(
      selected
        .map((secondMatch) => secondMatch.first)
        .sort(() => Math.random() - 0.5)
    );
    setSecond(
      selected
        .map((secondMatch) => secondMatch.second)
        .sort(() => Math.random() - 0.5)
    );
    setScore(0);
    clearColours("category");
  };

  return (
    <div className="app">
      <Category changeCategory={changeCategory} />
      {first.length != 0 ? (
        <div className="container">
          <span className="score ">Score: {score}</span>
          <div className="matches">
            <First first={first} firstClick={firstClick} />
            <Second second={second} secondClick={secondClick} />
          </div>
        </div>
      ) : (
        <div className="result">
          <h2>Your score is {score}</h2>
          <h2>You completed in time: </h2>
        </div>
      )}
    </div>
  );
}