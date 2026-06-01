import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        isAuthChecked:false,
    },
    reducers:{
        //actions
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setAuthChecked:(state,action)=>{
            state.isAuthChecked = action.payload;
        }
    }
})
export const {setLoading, setUser, setAuthChecked} = authSlice.actions;
export default authSlice.reducer;