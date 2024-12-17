<script setup lang="ts">
import Modal from './Modal.vue'
import { onMounted, ref } from 'vue';
import './style.css'
import { createBlendy, Blendy } from '../../src';

const blendy = ref<Blendy | null>(null)
const showModal = ref(false)

onMounted(() => {
  blendy.value = createBlendy()
})
</script>

<template>
  <div>
    <Teleport to="body">
      <Modal v-if="showModal"
        @close="() => {
          blendy?.untoggle('example', () => {
            showModal = false
          })
        }"></Modal>
    </Teleport>
    <button class="button"
      data-blendy-from="example"
      @click="() => {
        showModal = true
        blendy?.toggle('example')
      }"><span>Open</span></button>
  </div>
</template>
