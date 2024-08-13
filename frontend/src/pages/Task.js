import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { database, doc, deleteDoc } from '../config/firebaseconfig';
import { onSnapshot, collection } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

export default function Task({ navigation }) {

  const [task, setTask] = useState([])

  useEffect(() => {
    const taskCollection = collection(database, 'Tasks')
    const listen = onSnapshot(taskCollection, (query) => {
      const list = []
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id })
      })
      setTask(list)
    })
    return () => listen()
  }, [])

  function deleteTask(id) {
    const taskdocRef = doc(database, 'Tasks', id)
    deleteDoc(taskdocRef)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Tasks</Text>
      <FlatList
        data={task} renderItem={({ item }) => {
          return (
            <View style={styles.taskc}>
              <Text style={styles.text2} onPress={() => {
                navigation.navigate('Details', {
                  id: item.id,
                  description: item.description
                })
              }}>
                {item.description}
              </Text>
              <Pressable style={styles.button1} onPress={() => {
                deleteTask(item.id)
              }}>
                <AntDesign name="delete" size={24} color="white" />
              </Pressable>
            </View>
          )
        }}
      />

      <Pressable style={styles.button} onPress={() => navigation.navigate('NewTask')} >
        <Text style={styles.buttonText}>New Task</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d90429",
    borderRadius: 6,
    width: 256,
    height: 32,
    position: "absolute",
    bottom: 50,
  },
  button1: {
    backgroundColor: "#d90429",
    borderRadius: 50,
    width: 32,
    height: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#edf2f4",
  },
  text1: {
    color: "#ef233c",
    fontWeight: "bold",
    fontSize: 24,
  },
  text2: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: -4,
    flexBasis: 100,
  },
  taskc: {
    flexDirection: "row",
    marginBottom: 8,
  }
})