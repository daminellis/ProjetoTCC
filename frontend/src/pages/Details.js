import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { database, collection, updateDoc, doc } from '../config/firebaseconfig';
import React, { useState } from "react"


export default function Details({ navigation, route }) {
  const [descriptionEdit, setDescriptionEdit] = useState(route.params.description)

  function editTask() {
    const taskdocRef = doc(database, 'Tasks', route.params.id)
    updateDoc(taskdocRef, {
      description: descriptionEdit
    })
    navigation.navigate('Task')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Details</Text>
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.text2}>Description: </Text>
        <TextInput placeholder='Description' style={styles.input} value={descriptionEdit} onChangeText={setDescriptionEdit} />
      </View>
      <Pressable style={styles.button} onPress={() => { editTask() }}>
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