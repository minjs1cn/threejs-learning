<template>
  <div class="layout">
    <aside>
      <slot name="aside"></slot>
    </aside>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  height: 100%;
}

aside {
  flex: 0 0 200px;
  min-height: 100%;
  overflow-y: auto;
  background-color: var(--primary);
}

@media screen and (max-width: 768px) {
  aside {
    display: none;
  }
}

main {
  flex: 1;
  min-height: 100%;
  overflow: hidden;
}
</style>
