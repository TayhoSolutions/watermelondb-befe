import { FlatList, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import Task from "../model/Task";
import { colors } from "../theme/colors";
import { styles } from "../theme/styles";
import withObservables from "@nozbe/with-observables";

interface TaskListProps {
    tasks: Task[];
}

interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const handleToggleTask = async () => {
        await task.database.write(async () => {
            await task.update((t) => {
                t.isCompleted = !t.isCompleted;
            });
        });
    };

    return (
        <TouchableOpacity
            style={[styles.card, task.isCompleted && { backgroundColor: colors.background }]}
            onPress={handleToggleTask}
        >
            <Text
                style={[
                    styles.title,
                    task.isCompleted && {
                        textDecorationLine: "line-through",
                        color: colors.gray,
                    },
                ]}
            >
                {task.title}
            </Text>
            {task.description ? <Text style={styles.description}>{task.description}</Text> : null}
        </TouchableOpacity>
    );
};

// Make TaskItem reactive by observing the task
const EnhancedTaskItem = withObservables(["task"], ({ task }: TaskItemProps) => ({
    task: task.observe(),
}));

const ObservableTaskItem = EnhancedTaskItem(TaskItem);

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    const renderTask = ({ item }: { item: Task }) => <ObservableTaskItem task={item} />;

    return (
        <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
        />
    );
};

export default TaskList;
