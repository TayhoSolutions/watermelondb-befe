import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import AddTaskForm from "../src/components/AddTaskForm";
import Project from "../src/model/Project";
import TaskList from "../src/components/TaskList";
import { database } from "../src/database";
import { styles } from "../src/theme/styles";
import { useLocalSearchParams } from "expo-router";
import withObservables from "@nozbe/with-observables";

interface ProjectDetailProps {
    project: Project | null;
}

const ProjectDetailScreen: React.FC<ProjectDetailProps> = ({ project }) => {
    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.card, { marginTop: 16 }]}>
                <Text style={styles.title}>{project.name}</Text>
                {project.description ? <Text style={styles.description}>{project.description}</Text> : null}
            </View>
            <AddTaskForm projectId={project.id} />
            <TaskList tasks={project.tasks} />
        </View>
    );
};

const enhance = withObservables(["id"], ({ id }: { id: string }) => ({
    project: database.collections.get<Project>("projects").findAndObserve(id),
}));

const ProjectDetailScreenWrapper: React.FC = () => {
    const { id } = useLocalSearchParams();
    const projectId = Array.isArray(id) ? id[0] : id;

    if (!projectId) {
        return (
            <View style={styles.container}>
                <Text>No project ID provided</Text>
            </View>
        );
    }

    const EnhancedComponent = enhance(ProjectDetailScreen);
    return <EnhancedComponent id={projectId} />;
};

export default ProjectDetailScreenWrapper;
