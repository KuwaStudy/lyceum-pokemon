<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const page = ref(0);
const limit = ref(20);
const offset = computed(() => page.value * limit.value);
const { data: pokemons, refresh } = await useFetch(
  () =>
    `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit.value}`,
  {
    default: () => [],
  },
);
const hasPrev = computed(() => page.value > 0);
const maxPage = computed(() => Math.floor(pokemons.value.count / limit.value));
const hasNext = computed(() => page.value < maxPage.value);
const onFirst = async () => {
  page.value = 0;
  await refresh();
};
const onLast = async () => {
  page.value = maxPage.value;
  await refresh();
};
const onPrev = async () => {
  page.value--;
  await refresh();
};
const onNext = async () => {
  page.value++;
  await refresh();
};
const onCatch = async (pokemon_name) => {
  console.log(`/api/trainer/${route.params.name.replace(/\.json$/,"")}/pokemon`);
  const response = await $fetch(`/api/trainer/${route.params.name.replace(/\.json$/,"")}/pokemon`, {
    server: false,
    baseURL: config.public.backendOrigin,
    method: "POST",
    body: {
      name: pokemon_name,
    },
  }).catch((e) => e);
  //if (response instanceof Error) return;
  router.push(`/trainer/${route.params.name.replace(/\.json$/,"")}`);
};
const getUrl = (url) => {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
          + url.replace(/.$/,"").replace(/https:\/\/pokeapi\.co\/api\/v2\/pokemon\//,"") + ".png";
}
</script>

<template>
  <div>
    <h1>ポケモンをつかまえる</h1>
    <div>
      <table>
        <th>
          <GamifyButton @click="onFirst">先頭</GamifyButton>
        </th>
        <th>
          <GamifyButton :disabled="!hasPrev" @click="onPrev">まえへ</GamifyButton>
        </th>
        <th>
          <GamifyButton :disabled="!hasNext" @click="onNext">つぎへ</GamifyButton>
        </th>
        <th>
          <GamifyButton @click="onLast">最後</GamifyButton>
        </th>
        <th>
          {{ page }} / {{ maxPage }}
        </th>
      </table>
    </div>
    <table>
      <tr v-for="pokemon in pokemons.results" :key="pokemon.name">
        <td>
          {{ pokemon.name }}
        </td>
        <td>
          <img :src="getUrl(pokemon.url)">
        </td>
        <td>
          <GamifyButton type="button" @click="onCatch(`${pokemon.name}`)">きみに決めた</GamifyButton>
        </td>
      </tr>
    </table>
    <br/>
    <GamifyButton type="button" @click="router.push(`/trainer/${route.params.name}`)">戻る</GamifyButton>
  </div>
</template>

<style scoped>
th {
  padding: 5px 10px;
}

td {
  padding: 0px 0px;
  border: solid 1px;
  min-width:180px;
  text-align: center; 
}

table {
  border-collapse:  collapse;
}
</style>