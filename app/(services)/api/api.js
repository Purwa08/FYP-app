import axios from "axios";

const URL="https://990e-2409-40c2-2e-d2c9-11a5-9b80-b604-8f15.ngrok-free.app";

export const registerUser = async (user) => {
  console.log(user);
  const response = await axios.post(
    `${URL}/api/studentauth/signup`,
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};


export const loginUser = async (user) => {
  const response = await axios.post(
    `${URL}/api/studentauth/signin`,
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};


// Reset Password (new function)
export const resetPassword = async (studentId, newPassword) => {
  const response = await axios.post(
    `${URL}/api/studentauth/reset-password/${studentId}`,
    { newPassword },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("responser", response.data)
  return response.data;
};

export const getAttendanceSummary = async (studentId) => {
    try{
      const response = await axios.get(
      `${URL}/api/attendance/student/${studentId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }catch(error){

  }
};
  

export const getStudentCourses = async (studentId) => {
    try{
      const response = await axios.get(
      `${URL}/api/courses/student/${studentId}/courses`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch(error){
   
      console.error("API Error in getStudentCourses:", error);
      return { courses: [] }; // Return a fallback structure
    
  }
  };
  