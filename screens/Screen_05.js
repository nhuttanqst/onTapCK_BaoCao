import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import Validation from "../validation/UpdateValidation";

export default function Screen_05({ route }) {
  const { email } = route.params;
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (email) {
          const response = await axios.get(
            `http://localhost:8081/user/${email}`
          );
          if (response.data !== "User not found") {
            setUserName(response.data.name);
          } else {
            console.error("User not found for email:", email);
          }
        } else {
          console.error("No email provided");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };
    fetchUserName();
  }, [email]);

  const handleUpdateProfile = async () => {
    const validationErrors = Validation({ name, password, rePassword });
    setErrors(validationErrors);

    if (
      validationErrors.name === "" &&
      validationErrors.password === "" &&
      validationErrors.rePassword === ""
    ) {
      try {
        const response = await axios.post("http://localhost:8081/update", {
          name,
          email,
          password,
        });
        if (response.status === 200) {
          setModalMessage(response.data.message);
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
            navigation.navigate("Screen_04", { email });
          }, 2000);
        } else {
          setModalMessage(response.data.message);
          setModalVisible(true);
        }
      } catch (error) {
        setModalMessage("Network error. Please try again.");
        setModalVisible(true);
      }
    } else {
      setModalMessage("Please fix the validation errors.");
      setModalVisible(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post("http://localhost:8081/delete", {
        email,
      });
      if (response.status === 200) {
        setModalMessage("Account deleted successfully.");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate("Screen_01");
        }, 2000);
      } else {
        setModalMessage("Failed to delete account.");
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage("Network error. Please try again.");
      setModalVisible(true);
    }
  };

  const confirmDeleteAccount = () => {
    setConfirmDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteModalVisible(false);
    handleDeleteAccount();
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModalVisible(false);
  };

  return (
    <View style={styles.groupContainer}>
      <ScrollView style={{ height: 400, width: "100%" }}>
        <AntDesign
          style={{ padding: 20, paddingBottom: 0 }}
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <View>
          <View style={styles.container}>
            <Text style={styles.title}>Update Profile</Text>
            <Image
              source={require("../assets/Data/avatar.png")}
              style={styles.image}
            />
            <Text style={styles.textName}>{userName}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.textField}>Name</Text>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              {errors.name && (
                <Text style={{ color: "red" }}>{errors.name}</Text>
              )}
              <Text style={styles.textField}>Password</Text>
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              {errors.password && (
                <Text style={{ color: "red" }}>{errors.password}</Text>
              )}
              <Text style={styles.textField}>Re password</Text>
              <TextInput
                placeholder="Re Password"
                secureTextEntry
                value={rePassword}
                onChangeText={setRePassword}
                style={styles.input}
              />
              {errors.rePassword && (
                <Text style={{ color: "red" }}>{errors.rePassword}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <Text style={{ marginVertical: 5 }}>or</Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalWrapper}>
                  <Text style={styles.modalText}>{modalMessage}</Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={confirmDeleteModalVisible}
              onRequestClose={handleCancelDelete}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalWrapper}>
                  <Text style={styles.modalText}>
                    Are you sure you want to delete your account?
                  </Text>
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleConfirmDelete}
                    >
                      <Text style={styles.modalButtonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButtonCancel}
                      onPress={handleCancelDelete}
                    >
                      <Text style={styles.modalButtonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  textName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  textField: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#00bdd6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalWrapper: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#00bdd6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
  },
  modalButtonCancel: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
