import { FlatList, Text, TouchableOpacity, View } from "react-native";

import Project from "../model/Project";
import React from "react";
import { styles } from "../theme/styles";
import { useRouter } from "expo-router";
import withObservables from "@nozbe/with-observables";

interface ProjectListProps {
    projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
    const router = useRouter();

    const handleProjectPress = (projectId: string) => {
        router.push(`/project-detail?id=${projectId}`);
    };

    const renderProject = ({ item }: { item: Project }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleProjectPress(item.id)}>
            <Text style={styles.title}>{item.name}</Text>
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
        />
    );
};

const enhance = withObservables(["projects"], ({ projects }) => ({
    projects,
}));

export default enhance(ProjectList);
