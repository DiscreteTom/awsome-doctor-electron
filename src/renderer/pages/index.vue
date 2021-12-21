<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(content, category) in $workflow"
        :key="category"
      >
        <v-expansion-panel-header> {{ category }} </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list nav dense>
            <v-list-item
              v-for="(workflow, workflowName) in content"
              :key="workflowName"
              :to="`/${category}/${workflowName}`"
            >
              <v-list-item-icon>
                <v-icon> mdi-link </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ workflow.title }} </v-list-item-title>
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
  mounted() {},
};
</script>
