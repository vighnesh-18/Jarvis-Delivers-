import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Auth Context
const AuthContext = createContext();
const CartContext = createContext();
const AddressContext = createContext();

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'RESTORE_AUTH':
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        user: action.payload.user,
        token: action.payload.token
      };
    default:
      return state;
  }
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};

// Address Reducer
const addressReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADDRESSES':
      return {
        ...state,
        addresses: action.payload
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload]
      };
    case 'SELECT_ADDRESS':
      return {
        ...state,
        selectedAddress: action.payload
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(addr =>
          addr._id === action.payload._id ? action.payload : addr
        )
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(addr => addr._id !== action.payload)
      };
    default:
      return state;
  }
};

// Combined Provider Component
export const AppProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [cartState, cartDispatch] = useReducer(cartReducer, {
    items: []
  });

  const [addressState, addressDispatch] = useReducer(addressReducer, {
    addresses: [],
    selectedAddress: null
  });

  // Restore cart state from localStorage on app start
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('jarvis-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        // Restore cart items
        cartData.items.forEach(item => {
          cartDispatch({
            type: 'ADD_TO_CART',
            payload: item
          });
        });
      }
    } catch (error) {
      console.error('Error restoring cart:', error);
    }
  }, []);

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('jarvis-cart', JSON.stringify(cartState));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartState]);
  // Auth helper functions
  const login = (userData) => {
    authDispatch({
      type: 'LOGIN',
      payload: userData
    });
  };

  const logout = () => {
    authDispatch({
      type: 'LOGOUT'
    });
  };

  // Restore auth state from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      authDispatch({
        type: 'RESTORE_AUTH',
        payload: { token, user: JSON.parse(user) }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, authDispatch, login, logout }}>
      <CartContext.Provider value={{ cartState, cartDispatch }}>
        <AddressContext.Provider value={{ addressState, addressDispatch }}>
          {children}
        </AddressContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

// Custom hooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within an AppProvider');
  }
  return context;
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AppProvider');
  }
  return context;
};
