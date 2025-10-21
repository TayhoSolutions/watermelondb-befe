import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import Task from "../model/Task";
import { database } from "../database";
import { styles } from "../theme/styles";

interface AddTaskFormProps {
    projectId: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ projectId }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAddTask = async () => {
        if (!title.trim()) return;

        await database.write(async () => {
            await database.get<Task>("tasks").create((task) => {
                task.title = title;
                task.description = description;
                task.isCompleted = false;
                task.projectId = projectId;
            });
        });

        setTitle("");
        setDescription("");
    };

    return (
        <View>
            <TextInput style={styles.input} placeholder="Task Title" value={title} onChangeText={setTitle} />
            <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddTask}>
                <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddTaskForm;
