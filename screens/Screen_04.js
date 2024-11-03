import { useEffect, useState, useCallback } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";

const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Screen_04 = ({ route }) => {
  const { email } = route.params;
  const [userName, setUserName] = useState("");
  const [followers, setFollowers] = useState(
    getRandomNumberInRange(1000, 10000)
  );
  const [posts, setPosts] = useState(getRandomNumberInRange(100, 1000));
  const [reviews, setReviews] = useState(getRandomNumberInRange(1000, 5000));
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
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
    }, [email])
  );

  useEffect(() => {
    setFollowers(getRandomNumberInRange(1000, 10000));
    setPosts(getRandomNumberInRange(100, 1000));
    setReviews(getRandomNumberInRange(1000, 5000));
  }, []);

  return (
    <View style={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Screen_02", { email })}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 120, height: 120 }}
          source={require("../assets/Data/avatar.png")}
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "700",
            marginTop: 8,
          }}
        >
          {userName}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Screen_05", { email })}
        >
          <Text
            style={{
              marginTop: 10,
              fontSize: 20,
              fontWeight: "500",
              color: "#333",
            }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 25,
        }}
      >
        <View
          style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{followers}</Text>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>Followers</Text>
        </View>
        <View style={{ width: 1, height: 45, backgroundColor: "#ddd" }} />
        <View
          style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{posts}</Text>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>Post</Text>
        </View>
        <View style={{ width: 1, height: 45, backgroundColor: "#ddd" }} />
        <View
          style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{reviews}</Text>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>Reviews</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>My photos</Text>
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/Data/profile1.jpg")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/Data/profile2.jpg")}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>About me</Text>
          <Text style={styles.description}>
            Hey, I'm {userName}. I’m a Frontend Developer from Vietnam. I have a
            passion for web development and love to create new things. I have
            been working in the industry for over 5 years and have worked with
            many clients to create beautiful websites. I am always looking for
            new opportunities to learn and grow as a developer. I am currently
            working as a freelancer and am always looking for new projects to
            work on. If you have a project you would like to discuss, feel free
            to contact me. I would love to hear from you!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 30,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    color: "#555",
  },
});

export default Screen_04;
