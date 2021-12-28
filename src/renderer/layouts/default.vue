<template>
  <v-app>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <!-- site title -->
      <v-toolbar-title> Awsome Doctor 👩‍⚕️ 👨‍⚕️ </v-toolbar-title>

      <v-spacer />

      <!-- home button -->
      <tt-btn bottom to="/" tt="Home" icon="mdi-home-outline" />
      <!-- edit button -->
      <tt-btn bottom to="/editor" tt="Editor" icon="mdi-circle-edit-outline" />
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

export default {
  components: { TtBtn },
  data() {
    return {
      leftDrawer: true,
    };
  },
  created() {
    this.$ipc.one("load-config", (event, arg) => {
      this.$store.commit("loadConfig", arg);
      this.$ipc.send("get-aws-credentials", {
        profile: this.$store.state.profile,
        region: this.$store.state.region,
      });
    });
    this.$ipc.one("get-aws-credentials", (event, arg) => {
      this.$aws.configure({ ...arg, region: this.$store.state.region });
    });

    let { tempAk, tempSk, useProfile, ...rest } =
      this.$store.getters.defaultState;
    this.$ipc.send("load-config", rest);
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
