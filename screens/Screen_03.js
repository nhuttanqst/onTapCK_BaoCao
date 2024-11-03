import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CheckBox from "expo-checkbox";
import axios from "axios";
import validation from "../validation/SignupValidation";

const Screen_03 = ({ navigation }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [checked, setChecked] = useState(false);
  const [type, setType] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = () => {
    setErrors(validation(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (
      isSubmitting &&
      errors.name === "" &&
      errors.email === "" &&
      errors.password === ""
    ) {
      axios
        .post("http://localhost:8081/signup", values)
        .then((response) => {
          if (response.data.status === "Success") {
            setModalMessage("Registration successful!");
          } else {
            setModalMessage(response.data.message);
          }
          setModalVisible(true);
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.data && err.response.data.message) {
            setModalMessage(err.response.data.message);
          } else {
            setModalMessage("An error occurred during registration.");
          }
          setModalVisible(true);
        })
        .finally(() => setIsSubmitting(false));
    } else {
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, values]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={{ padding: 10 }}>
            <TouchableOpacity>
              <FontAwesome6
                onPress={() => navigation.goBack()}
                name="arrow-left-long"
                size={24}
                color="#6c7474"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <Image
              style={{ width: 220, height: 220, marginTop: -40 }}
              source={require("../assets/Data/iconLogin.png")}
            />
            <Text style={styles.text1}>Nice to see you!</Text>
            <Text style={styles.text2}>Create your account</Text>
          </View>
          <View>
            <View style={styles.groupInput}>
              <Image
                style={styles.imageInput}
                source={require("../assets/Data/codicon_account.png")}
              />
              <TextInput
                value={values.name}
                onChangeText={(value) => {
                  setValues({ ...values, name: value });
                  console.log(values);
                }}
                style={styles.textInput}
                placeholder="Enter your name"
              />
              {errors.name && (
                <Text style={{ color: "red", marginTop: 5 }}>
                  {errors.name}
                </Text>
              )}
            </View>
            <View style={styles.groupInput}>
              <Image
                style={[styles.imageInput, { width: 20, height: 15, top: 14 }]}
                source={require("../assets/Data/Vector.png")}
              />
              <TextInput
                value={values.email}
                onChangeText={(value) => {
                  setValues({ ...values, email: value });
                  console.log(values);
                }}
                style={styles.textInput}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <Text style={{ color: "red", marginTop: 5 }}>
                  {errors.email}
                </Text>
              )}
            </View>
            <View style={styles.groupInput}>
              <Image
                style={styles.imageInput}
                source={require("../assets/Data/lock.png")}
              />
              <TextInput
                value={values.password}
                onChangeText={(value) =>
                  setValues({ ...values, password: value })
                }
                style={styles.textInput}
                secureTextEntry={type}
                placeholder="Enter your password"
              />
              {errors.password && (
                <Text style={{ color: "red", marginTop: 5 }}>
                  {errors.password}
                </Text>
              )}
              <TouchableOpacity
                style={styles.imageEye}
                onPress={() => setType((prev) => !prev)}
              >
                <Image source={require("../assets/Data/eye.png")} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.groupCheckBox}>
            <CheckBox
              value={checked}
              onValueChange={() => setChecked((prev) => !prev)}
            />
            <Text style={{ fontSize: 15, marginLeft: 10 }}>
              I agree with{" "}
              <Text style={{ color: "#62afec", fontWeight: "400" }}>
                Terms & Conditions
              </Text>
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <View>
                <Text onPress={() => handleSubmit()} style={styles.continue}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          if (modalMessage === "Registration successful!") {
            navigation.navigate("Screen_01");
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
                if (modalMessage === "Registration successful!") {
                  navigation.navigate("Screen_01");
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Screen_03;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  text1: {
    fontSize: 35,
    fontWeight: "600",
    color: "#30353a",
    marginTop: -25,
  },
  text2: {
    fontSize: 16,
    fontWeight: "300",
    marginTop: 4,
    color: "#6c7474",
  },
  groupInput: {
    position: "relative",
    marginBottom: 20,
  },
  imageInput: {
    position: "absolute",
    top: 12,
    left: 14,
    width: 20,
    height: 20,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#9095a0",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 55,
  },
  imageEye: {
    position: "absolute",
    top: 9,
    right: 8,
    width: 30,
    height: 30,
  },
  groupCheckBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#0b75a9",
    padding: 15,
    borderRadius: 15,
  },
  continue: {
    color: "#fff",
    textAlign: "center",
    width: "100%",
    fontSize: 18,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
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
    backgroundColor: "#28c4dc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
