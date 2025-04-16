import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import ticketReducer from './slices/ticketSlice.ts';
import userReducer from './slices/userSlice.ts';

export const index = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;