import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to load user from AsyncStorage
const loadUserFromStorage = async () => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user info", error);
    return null;
  }
};

const initialState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutAction: (state) => {
      state.user = null;
      state.loading = false;
      AsyncStorage.removeItem("userInfo");
    },
    setFirstLogin: (state, action) => {
      state.user.firstLogin = action.payload;
      try {
        AsyncStorage.setItem("firstLogin", action.payload.toString());
      } catch (error) {
        console.error("Error updating firstLogin in storage:", error);
      }
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    updateProfileAction: (state, action) => {
      state.user = { ...state.user, student: { ...state.user.student, ...action.payload } };
      AsyncStorage.setItem("userInfo", JSON.stringify(state.user));
    },
    
  },
});

export const { loginAction, logoutAction, setUser, setLoading, setFirstLogin, updateProfileAction} =
  authSlice.actions;

export default authSlice.reducer;

// Thunk to load user from AsyncStorage when the app starts
export const loadUser = () => async (dispatch) => {
  const user = await loadUserFromStorage();
  if (user) {
    dispatch(setUser(user));
  } else {
    dispatch(setLoading(false));
  }
};