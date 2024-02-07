<script setup></script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <form @submit.prevent>
      <div class="item">
      <label for="name">なまえ</label>
      <span id="name-description"
        >とくていの　もじは　とりのぞかれるぞ！</span>
      <input
        id="name"
        v-model="trainerName"
        aria-describedby="name-description"
        @keydown.enter="valid && onOpen(true)"
      />
    </div>
    <GamifyButton type="button" :disabled="!valid" @click="onOpen(true)"
      >けってい</GamifyButton>
   </form>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
