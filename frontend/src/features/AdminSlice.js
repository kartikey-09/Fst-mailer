import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import jwtDecode from 'jwt-decode'
import toast from 'react-hot-toast';
import { url } from '../api'

const initialState = {
    token: sessionStorage.getItem('token'),
    name: "",
    emailId: '',
    role: '',
    _id: '',
};

export const loginAdmin = createAsyncThunk(
    "admin/loginAdmin",
    async (user) => {
        try {
            const res = await axios.post(`${url}/api/users/login-user`, {
                emailId: user.email,
                password: user.password
            });
           
            if (res.data.success) {
                toast.success(res.data.message)
                sessionStorage.setItem('token', res.data.token);
            }
            else {
                toast.error("Login Failed, Invalid Credentials")
                return;
            }

            return res.data.token;
        } catch (error) {
            toast.error("Login Failed, Invalid Credentials")
        }
    }
)

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        loadAdmin(state, action) {
            const token = state.token

            if (token) {
                const user = jwtDecode(token);

                return {
                    ...state,
                    token,
                    name: user.name,
                    emailId: user.emailId,
                    _id: user._id,
                    role: user.role,
                };
            }
        },
        logoutAdmin(state, action) {
            sessionStorage.removeItem('token');

            return {
                ...state,
                token: "",
                name: "",
                emailId: '',
                role: '',
                _id: '',
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginAdmin.fulfilled, (state, action) => {
            if (action.payload) {
                const user = jwtDecode(action.payload);
                return {
                    ...state,
                    token: action.payload,
                    name: user.name,
                    emailId: user.emailId,
                    _id: user._id,
                    role: user.role,
                }
            }
            else {
                return state
            }
        });
    }
});

export const { loadAdmin, logoutAdmin } = adminSlice.actions
export default adminSlice.reducer
