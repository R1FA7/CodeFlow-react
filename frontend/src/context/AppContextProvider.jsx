import { AppContext } from "./AppContext";

export const AppContextProvider = (props) => {
  return <AppContext.Provider>{props.children}</AppContext.Provider>;
};
