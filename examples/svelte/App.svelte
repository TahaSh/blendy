<script lang="ts">
  import { createBlendy, type Blendy } from '../../src'
  import { onMount } from 'svelte'
  import './style.css'
  import Modal from './Modal.svelte'
  let blendy: Blendy | null = null
  let showModal = false

  onMount(() => {
    blendy = createBlendy()
  })
</script>

<div>
  {#if showModal}
    <div class="modal-container">
      <Modal
        onclose={() => {
          blendy?.untoggle('example', () => {
            showModal = false
          })
        }}
      ></Modal>
    </div>
  {/if}
  <button
    class="button"
    data-blendy-from="example"
    onclick={() => {
      showModal = true
      blendy?.toggle('example')
    }}><span>Open</span></button
  >
</div>
