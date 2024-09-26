import React, { useContext, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';

const WarningScreen = () => {
    const { id_operador } = useContext(useUser);
    const [descricao, setDescricao] = useState('');

    const handleSaveWarning = async () => {
        try {
            // Obter id_maquina com base no id_operador
            const response = await api.get(`/monitores/${id_operador}`);
            const id_maquina = response.data.id_maquina;

            // Salvar aviso
            await api.post(`/warning`, {
                id_operador,
                id_maquina,
                descricao,
                criado_em: new Date().toISOString() // Pega a data atual em formato ISO
            });

            alert('Aviso salvo com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar aviso.');
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Descrição do aviso"
                value={descricao}
                onChangeText={setDescricao}
            />
            <Button title="Salvar Aviso" onPress={handleSaveWarning} />
        </View>
    );
};

export default WarningScreen;
