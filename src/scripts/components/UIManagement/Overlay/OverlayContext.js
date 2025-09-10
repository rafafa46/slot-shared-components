import React, { createContext, useContext, useReducer, useCallback } from 'react';

const OverlayContext = createContext();

const initialState = {
  isVisible: false,
  type: null,
  props: {},
  hasPointerEvents: false
};

const overlayReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_OVERLAY':
      return {
        ...state,
        isVisible: true,
        type: action.payload.type,
        props: action.payload.props,
        hasPointerEvents: true
      };
    case 'HIDE_OVERLAY':
      return {
        ...state,
        isVisible: false,
        type: null,
        props: {},
        hasPointerEvents: false
      };
    case 'SET_POINTER_EVENTS':
      return {
        ...state,
        hasPointerEvents: action.payload
      };
    default:
      return state;
  }
};

export const OverlayProvider = ({ children }) => {
  const [state, dispatch] = useReducer(overlayReducer, initialState);

  const showOverlay = useCallback((type, props = {}) => {
    dispatch({ type: 'SHOW_OVERLAY', payload: { type, props } });
  }, []);

  const hideOverlay = useCallback(() => {
    dispatch({ type: 'HIDE_OVERLAY' });
  }, []);

  const setPointerEvents = useCallback((value) => {
    dispatch({ type: 'SET_POINTER_EVENTS', payload: value });
  }, []);

  return (
    <OverlayContext.Provider 
      value={{ 
        ...state, 
        showOverlay, 
        hideOverlay,
        setPointerEvents
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};