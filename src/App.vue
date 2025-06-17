<!-- src/App.vue -->
<template>
  <router-view/>
</template>

<script setup></script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}

/* モバイル基準 */
.wrapper{
  margin:0 auto;
  padding:0 16px;
  max-width:600px;   /* スマホ視野幅 */
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

/* タブレット以上でも中央寄せは維持 ─ 横幅だけ広がらない */
@media (min-width: 960px){
  .wrapper{ padding:0 24px; }
}
</style>
