// src/context/EventBusContext.jsx
import React, { createContext, useContext, useRef } from "react";

const EventBusContext = createContext(null);

export function EventBusProvider({ children }) {
  const subsRef = useRef({}); // { eventName: [fn, ...] }

  const subscribe = (event, fn) => {
    subsRef.current[event] = subsRef.current[event] || [];
    subsRef.current[event].push(fn);
    return () => {
      subsRef.current[event] = subsRef.current[event].filter(f => f !== fn);
    };
  };

  const publish = (event, payload) => {
    const handlers = subsRef.current[event] || [];
    handlers.forEach(h => {
      try { h(payload); } catch (e) { /* ignore handler errors */ }
    });
  };

  return (
    <EventBusContext.Provider value={{ subscribe, publish }}>
      {children}
    </EventBusContext.Provider>
  );
}

export const useEventBus = () => useContext(EventBusContext);
