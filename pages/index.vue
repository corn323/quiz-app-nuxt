<template>
  <v-row align="center" justify="center" style="height: calc(100vh - 120px); display: flex; background-color: #0f0f0f;">
    <v-col cols="12" class="text-center">
      <v-card class="pa-5 mx-auto" max-width="400" color="#2F3136" dark rounded="lg" elevation="10">
        <v-card-title class="text-h5 justify-center mb-4 white--text">
          歡迎來到題庫系統
        </v-card-title>
        <v-divider class="mb-4" color="#4F545C"></v-divider>
        <v-card-text>
          <v-btn to="/add-question" class="my-3 d-block w-100 custom-button" color="#7289DA" large dark rounded
            elevation="5">
            <v-icon left>mdi-plus-circle</v-icon>
            新增題目
          </v-btn>
          <v-btn to="/questions" class="my-3 d-block w-100 custom-button" color="#43B581" large dark rounded
            elevation="5">
            <v-icon left>mdi-text-box-search</v-icon>
            查看題目
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 7px !important;
}

.custom-button .v-btn__content {
  display: flex;
  align-items: center;
  line-height: normal !important;
}
</style>