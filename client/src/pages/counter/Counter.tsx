import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, incrementByAmount, incrementAsync, selectCount, set } from "./counterSlice";
import styles from "./Counter.module.css";
import logo from "../../logo.svg";
import { useQuery } from "react-query";
import { useMutation } from "react-query";

const getCounterApi = async (): Promise<number | null> => {
  const response = await fetch("/api/counter", {
    method: "GET",
  });
  if (response.status === 201) {
    return null;
  }
  return await response.json();
};

const setCounterApi = async (value: number): Promise<number> => {
  const response = await fetch("/api/counter", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  return await response.json();
};

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState("0");

  /**
   * Main query function to get data and save it to cache
   */
  const counter = useQuery("counter", () => getCounterApi());

  useEffect(() => {
    counter.data && dispatch(set(counter.data));
  }, [counter.data, dispatch]);

  /**
   * Main query function for adding / updating / deleting
   */
  const setCounter = useMutation((value: number) => setCounterApi(value));

  const changeCounter = async (changeByAmount: number) => {
    try {
      const response = await setCounter.mutateAsync(changeByAmount);
      dispatch(set(response));
    } catch (error) {
      console.log(error);
    }
  };

  // if(counter.isLoading) {
  //   return <div>LOADING</div>
  // }

  return (
    <div className={styles.content}>
      <img src={logo} className="App-logo" alt="logo" />
      <div className={styles.row}>
        <button className={styles.button} aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          -
        </button>
        <button className={styles.button} aria-label="Decrement value" onClick={() => changeCounter(-1)}>
          - and save
        </button>
        <span className={styles.value}>{count}</span>
        <button className={styles.button} aria-label="Increment value" onClick={() => dispatch(increment())}>
          +
        </button>
        <button className={styles.button} aria-label="Increment value" onClick={() => changeCounter(1)}>
          + and save
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button className={styles.button} onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}>
          Add Amount
        </button>
        <button className={styles.asyncButton} onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}>
          Add Async
        </button>
      </div>
    </div>
  );
}
