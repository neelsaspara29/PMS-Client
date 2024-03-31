import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


type TAuth = {
    isLoggedIn: boolean;
    token: string | null
}

const initialState: TAuth = {
    isLoggedIn: localStorage.getItem("token") ? true : false,
    token: localStorage.getItem("token") || null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string }>) => {
            const { token } = action.payload
            state.token = token
            state.isLoggedIn = true
            localStorage.setItem("token", token);
        },
        setLogout: (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.isLoggedIn = false;

        }
    }
})

export const { setAuth, setLogout } = authSlice.actions


export default authSlice.reducer

