import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ticketReducer from "./slices/ticketSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/loginSuccess', 'auth/refreshTokenSuccess'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;