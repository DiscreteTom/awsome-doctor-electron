<template>
  <v-app>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <!-- site title -->
      <v-toolbar-title> Awsome Doctor 👩‍⚕️ 👨‍⚕️ </v-toolbar-title>

      <v-spacer />

      <!-- home button -->
      <tt-btn bottom to="/" tt="Home" icon="mdi-home-outline" />
      <!-- settings button -->
      <tt-btn bottom to="/settings" icon="mdi-cog-outline" tt="Settings" />
    </v-app-bar>

    <v-navigation-drawer v-model="leftDrawer" clipped app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Services </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item
        v-for="(content, category) in $workflow"
        :key="category"
        :to="`/${category}`"
      >
        <v-list-item-action>
          <v-icon> mdi-cloud-outline </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ category }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TtBtn from "../components/TtBtn.vue";
import { ipcRenderer } from "electron";

export default {
  components: { TtBtn },
  data() {
    return {
      leftDrawer: true,
    };
  },
  created() {
    ipcRenderer.on("load-config", (event, arg) => {
      this.$store.commit("loadConfig", arg);
      ipcRenderer.send("get-aws-credentials", {
        profile: this.$store.state.profile,
        region: this.$store.state.region,
      });
    });
    ipcRenderer.on("get-aws-credentials", (event, arg) => {
      this.$aws.configure({ ...arg, region: this.$store.state.region });
    });

    ipcRenderer.send("load-config", this.$store.getters.defaultState);
  },
};
</script>

<style>
body {
  margin: 0 !important;
}
html {
  overflow: auto;
}
</style>
