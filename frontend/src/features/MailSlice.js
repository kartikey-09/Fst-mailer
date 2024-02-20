import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { url } from '../api';

const initialState = {
    data: [],
};


export const getMails = createAsyncThunk(
    "mails/getMails",
    async (token) => {
        try {
            const res = await axios.get(`${url}/api/mails`, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                }
            })
            if (res.data.success) {
                return res.data.data;
            }
        }
        catch (err) {
            if (err?.response?.data?.message) {
                toast.error(err?.response?.data?.message);
            }
        }
    }
)

const MailSlice = createSlice({
    name: 'mails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMails.fulfilled, (state, action) => {
            if (action.payload) {
                return {
                    ...state,
                    data: action.payload
                }
            }
            else {
                return state;
            }
        })
    }
})

export default MailSlice.reducer;