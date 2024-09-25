import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

// criar um codigo que crie o fim da manutencao com uma data de 5 dias apos a criacao do inicio da manutencao
// definir status no comeco 
// deixar o id do tecnico como nulo
// custo da peca quem ira dizer e o tecnico 
// id do operador e o mesmo que o do login e a maquina mesma coisa

const WarningScreen = () => {
    const [form, setForm] = useState({
        id_maquina: '',
        motivo: '',
        inicio_da_manutencao: '',
        custo_de_peca: '',
        id_tecnico: '',
        id_operador: '',
        status: ''
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        // Lógica para submissão do formulário
        console.log(form);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Aviso de Manutenção</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="ID Máquina"
                    value={form.id_maquina}
                    onChangeText={(value) => handleChange('id_maquina', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Motivo"
                    value={form.motivo}
                    onChangeText={(value) => handleChange('motivo', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Início da Manutenção"
                    value={form.inicio_da_manutencao}
                    onChangeText={(value) => handleChange('inicio_da_manutencao', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Custo de Peça"
                    value={form.custo_de_peca}
                    onChangeText={(value) => handleChange('custo_de_peca', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ID Técnico"
                    value={form.id_tecnico}
                    onChangeText={(value) => handleChange('id_tecnico', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ID Operador"
                    value={form.id_operador}
                    onChangeText={(value) => handleChange('id_operador', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Status"
                    value={form.status}
                    onChangeText={(value) => handleChange('status', value)}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Enviar Aviso</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEC601',
    },
    topBar: {
        backgroundColor: 'transparent',
        paddingVertical: 50,
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    formContainer: {
        flex: 1,
        backgroundColor: 'gray',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    }
});

export default WarningScreen;
