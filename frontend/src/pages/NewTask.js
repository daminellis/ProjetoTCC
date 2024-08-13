import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import React, { useState } from "react"
import { database, collection, addDoc } from '../config/firebaseconfig';


export default function NewTask({ navigation }) {
  const [newTask, setNewTask] = useState(null)

  function addTask() {
    const taskdocRef = collection(database, 'Tasks')
    addDoc(taskdocRef, {
      description: newTask,
      status: true,
    })
    navigation.navigate('Task')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>New Task</Text>
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.text2}>Description: </Text>
        <TextInput placeholder='Description' style={styles.input} value={newTask} onChangeText={setNewTask} />
      </View>
      <Pressable style={styles.button} onPress={() => { addTask() }}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#edf2f4",
  },
  text2: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: -4,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  text1: {
    color: "#ef233c",
    fontWeight: "bold",
    fontSize: 24,
  },
  button: {
    backgroundColor: "#d90429",
    borderRadius: 6,
    width: 256,
    height: 32,
    position: "absolute",
    bottom: 50,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
})