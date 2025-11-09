import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 10000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

// const persister = createSyncStoragePersister({
//   storage: window.localStorage,
//   key: "codeflow-cache",
// });

createRoot(document.getElementById("root")).render(
  <QueryClientProvider
    client={queryClient}
    // persistOptions={{ persister }}
  >
    <App />
  </QueryClientProvider>
);
