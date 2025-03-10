import axios from "axios";
import { API_URL } from "@env";

console.log("Ngrok URL:", API_URL);
const URL=API_URL;

//const URL="https://c105-2409-40c2-10f-c2f5-2cfd-d33e-5a1c-e76a.ngrok-free.app";
//console.log(URL);

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
          'ngrok-skip-browser-warning': 'true',
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
          'ngrok-skip-browser-warning': 'true', 
        },
      }
    );
    return response.data;
  } catch(error){
   
      console.error("API Error in getStudentCourses:", error);
      return { courses: [] }; // Return a fallback structure
    
  }
  };
  

export const getCourseDetails = async (courseId) => {
    try {
      const response = await axios.get(`${URL}/api/students/course/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error in getCourseDetails:", error);
      return null;
    }
  };
  


export const getAttendanceWindowStatus = async (courseId, studentId) => {
    try {
      const response = await axios.get(`${URL}/api/attendance/course/${courseId}/window-status?studentId=${studentId}`, {
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true',
        },
      });

       // Check the response to determine the appropriate return
    // if (response.data.isAttendanceMarked) {
    //   return { message: "You have already marked attendance for today." }; // Return a specific message
    // }

      return response.data; // Response will have `isWindowOpen`
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No attendance record found for today.");
        return { isWindowOpen: false ,isAttendanceMarked: false, message: "Attendance record not found for today." }; // Default to closed if no record is found
      }
      console.error("API Error in getAttendanceWindowStatus:", error);
      
      return { isWindowOpen: false }; // Default to closed in case of error
    }
  };
  


  export const markAttendance = async (courseId, studentId) => {
    try {
      const response = await axios.post(
        `${URL}/api/attendance/course/${courseId}/student-mark-attendance`,
        { studentId }, // Pass the studentId in the request body
        {
          headers: {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      return response.data; // Return success response
    } catch (error) {
      console.error("API Error in markAttendance:", error);
      throw error; // Handle the error in the component
    }
  };
  



  export const updateProfile = async (studentId, updatedData) => {
    try {
      const response = await axios.put(
        `${URL}/api/students/student/${studentId}/update-profile`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error in updateProfile:", error);
      throw error;
    }
  };
  


// Change Password (new function)
export const changePassword = async (studentId, currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(
      `${URL}/api/studentauth/change-password/${studentId}`,
      { currentPassword, newPassword, confirmPassword},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response.data); // Optional: log the response for debugging
    return response.data; // Return the response data from the backend
  } catch (error) {
    console.error("API Error in changePassword:", error); // Optional: log the error for debugging
    throw error; // Rethrow the error to handle it in the component
  }
};
