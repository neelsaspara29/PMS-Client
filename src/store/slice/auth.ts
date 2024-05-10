import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


type TAuth = {
    isLoggedIn: boolean;
    token: string | null;
    user: any
}

const initialState: TAuth = {
    isLoggedIn: localStorage.getItem("token") ? true : false,
    token: localStorage.getItem("token") || null,
    user: JSON.parse(String(localStorage.getItem("user"))) || null
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
        setUser:(state, action: PayloadAction<{user: any}> ) => {
            const {user} = action.payload
            state.user = user
            localStorage.setItem("user", JSON.stringify(user));

        },
        setLogout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user")
            state.token = null;
            state.isLoggedIn = false;

        }
    }
})

export const { setAuth, setLogout, setUser } = authSlice.actions


export default authSlice.reducer

