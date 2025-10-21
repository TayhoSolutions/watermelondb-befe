import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import Project from "../model/Project";
import { database } from "../database";
import { styles } from "../theme/styles";

const AddProjectForm: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleAddProject = async () => {
        if (!name.trim()) return;

        await database.write(async () => {
            await database.get<Project>("projects").create((project) => {
                project.name = name;
                project.description = description;
            });
        });

        setName("");
        setDescription("");
    };

    return (
        <View>
            <TextInput style={styles.input} placeholder="Project Name" value={name} onChangeText={setName} />
            <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddProject}>
                <Text style={styles.buttonText}>Add Project</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddProjectForm;
