import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity,Platform } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";

const Home  = () => {
    const video = React.useRef(null);
    const router = useRouter();

  return (
    <View style={styles.container}>
       <Text>Home</Text> 
       <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "https://videos.pexels.com/video-files/5377700/5377700-sd_540_960_25fps.mp4",
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        
      /> 

     <View style={styles.overlay}>
        <Text style={styles.mainText}>Attendify</Text>
        <Text style={styles.subText}>VNIT</Text>
        <Text style={styles.tagline}>Attendance Management System</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
      },
      video: {
        ...StyleSheet.absoluteFillObject,
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      mainText: {
        color: "white",
        fontSize: 68,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      },
      subText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
      },
      tagline: {
        color: "white",
        fontSize: 18,
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
      },
      buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
      },
      button: {
        //backgroundColor: "#6200ea",
        backgroundColor:"#003172",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 3, // Adds a shadow effect on Android
      },
      buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
      },
})