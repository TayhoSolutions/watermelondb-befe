import React from "react";
import { Text, View } from "react-native";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Q } from "@nozbe/watermelondb";

import AddTaskForm from "../src/components/AddTaskForm";
import Project from "../src/model/Project";
import Task from "../src/model/Task";
import TaskList from "../src/components/TaskList";
import { database } from "../src/database";
import { styles } from "../src/theme/styles";
import { useLocalSearchParams } from "expo-router";
import withObservables from "@nozbe/with-observables";

interface ProjectDetailInnerProps {
    project: Project | null;
    tasks: Task[];
}

const ProjectDetailScreen: React.FC<ProjectDetailInnerProps> = ({ project, tasks }) => {
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
            <TaskList tasks={tasks} />
        </View>
    );
};

const enhance = withObservables(["id"], ({ id }: { id: string }) => {
    const projectObservable = database.collections.get<Project>("projects").findAndObserve(id);

    return {
        project: projectObservable,
        tasks: database.collections.get<Task>("tasks").query(Q.where("project_id", id)).observe(),
    };
});

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
