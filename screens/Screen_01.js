import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import validation from "../validation/LoginValidation";

export default function LoginScreen() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigation = useNavigation();

  const handleSubmit = () => {
    const validationErrors = validation(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  const toggleShowPassword = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (isSubmitting && !errors.email && !errors.password) {
      axios
        .post("http://localhost:8081/login", values)
        .then(async (res) => {
          if (res.data.status === "Success") {
            setModalMessage(`Login Success!`);
            setModalVisible(true);
            setPasswordVisible(false);
          } else {
            setModalMessage(res.data.status);
            setModalVisible(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setModalMessage("An error occurred during login.");
          setModalVisible(true);
        })
        .finally(() => setIsSubmitting(false));
    } else {
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, values, isPasswordVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/Data/icon.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Hello Again!</Text>
      <Text style={styles.subtitle}>Log into your account</Text>
      <View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={values.email}
            onChangeText={(value) => setValues({ ...values, email: value })}
          />
        </View>
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>
      <View style={{ marginTop: 10 }}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!isPasswordVisible}
            value={values.password}
            onChangeText={(value) => setValues({ ...values, password: value })}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit} style={styles.continueButton}>
        <Text style={styles.continueText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.signupButton}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Screen_03")}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Request Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          if (modalMessage.startsWith("Login Success")) {
            navigation.navigate("Screen_02", { email: values.email });
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (modalMessage.startsWith("Login Success")) {
                  navigation.navigate("Screen_02", { email: values.email });
                  setValues({ email: "", password: "" });
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    outlineWidth: 0,
  },
  eyeIcon: {
    marginLeft: 5,
  },
  forgotPassword: {
    color: "#0ad4fa",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#0ad4fa",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginLeft: 5,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#5958b2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  signupButton: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 16,
    marginRight: 8,
  },
});
