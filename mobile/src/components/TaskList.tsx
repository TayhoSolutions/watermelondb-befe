import { FlatList, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import Task from "../model/Task";
import { colors } from "../theme/colors";
import { styles } from "../theme/styles";
import withObservables from "@nozbe/with-observables";

interface TaskListProps {
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    const handleToggleTask = async (task: Task) => {
        await task.update(() => {
            task.isCompleted = !task.isCompleted;
        });
    };

    const renderTask = ({ item }: { item: Task }) => (
        <TouchableOpacity
            style={[styles.card, item.isCompleted && { backgroundColor: colors.background }]}
            onPress={() => handleToggleTask(item)}
        >
            <Text
                style={[
                    styles.title,
                    item.isCompleted && {
                        textDecorationLine: "line-through",
                        color: colors.gray,
                    },
                ]}
            >
                {item.title}
            </Text>
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
        />
    );
};

const enhance = withObservables(["tasks"], ({ tasks }) => ({
    tasks,
}));

export default enhance(TaskList);
