"use client";
import { useState, createContext, useContext } from "react";
import { css } from "@emotion/css";
import GridLoader from "react-spinners/GridLoader";

export const Preloader = createContext();

const override = css`
  position: fixed;
  z-index: 10001;
`;

export function PreloaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Preloader.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <>
          <div className="pre-loader">
            <GridLoader
              cssOverride={override}
              size={20}
              color={"#fff"}
              loading={isLoading}
            />
          </div>
        </>
      )}
    </Preloader.Provider>
  );
}

export function usePreLoader() {
  return useContext(Preloader);
}
