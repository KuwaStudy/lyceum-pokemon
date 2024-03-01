<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { data: trainersJson } = await useFetch(
  () => `/api/trainer/${route.params.name.replace(/\.json$/,"")}`,
  {
    default: () => [],
    server: false,
    baseUrl: config.public.backendOrigin,
    method: "GET",
  },
);
</script>
<template>
  <GamifyButton type="button" @click="router.push('/trainer')">トレーナー一覧に戻る</GamifyButton>
  <h1>トレーナ情報</h1>
   <div class="trainer-info">
    <img src="/avatar.png" />
    <h2>{{ trainersJson.name }}</h2>
  </div>
</template>