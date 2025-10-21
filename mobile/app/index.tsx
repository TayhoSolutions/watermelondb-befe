import { Text, View } from "react-native";

import AddProjectForm from "../src/components/AddProjectForm";
import ProjectList from "../src/components/ProjectList";
import { Q } from "@nozbe/watermelondb";
import React from "react";
import { database } from "../src/database";
import { styles } from "../src/theme/styles";
import withObservables from "@nozbe/with-observables";

const HomeScreen: React.FC = () => {
    const projects = database.collections.get("projects").query().observe();

    return (
        <View style={styles.container}>
            <AddProjectForm />
            <ProjectList projects={projects} />
        </View>
    );
};

const enhance = withObservables([], () => ({
    projects: database.collections.get("projects").query().observe(),
}));

export default enhance(HomeScreen);
