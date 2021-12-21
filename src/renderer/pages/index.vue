<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header> EC2 </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list nav dense>
            <v-list-item to="/ec2/ping">
              <v-list-item-icon>
                <v-icon> mdi-link </v-icon>
              </v-list-item-icon>
              <v-list-item-title> Ping is not working </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
