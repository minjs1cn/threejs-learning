<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { Game, Direction } from "game-greedy-snake";
import hotkeys from "hotkeys-js";

const container = ref<HTMLDivElement | null>(null);
const timer = ref<number>(0);

const size = 40;

function init() {
  const { clientWidth, clientHeight } = container.value!;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(clientWidth, clientHeight);
  renderer.setViewport(0, 0, clientWidth, clientHeight);
  container.value!.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const meshes: THREE.Mesh[] = [];
  const obstacles: THREE.Mesh[] = [];
  const width = Math.floor(Math.min(clientWidth, clientHeight) / size);
  const n = Math.floor(width / 2);
  const game = new Game({
    map: {
      width,
      height: width,
    },
    snake: {
      bodyLength: 3,
    },
  });
  game.init();
  hotkeys("w", function () {
    game.setDirection(Direction.UP);
  });
  hotkeys("s", function () {
    game.setDirection(Direction.DOWN);
  });
  hotkeys("a", function () {
    game.setDirection(Direction.LEFT);
  });
  hotkeys("d", function () {
    game.setDirection(Direction.RIGHT);
  });

  // 相机
  // const camera = new THREE.PerspectiveCamera(
  //   45,
  //   clientWidth / clientHeight,
  //   1,
  //   1000
  // );
  const camera = new THREE.OrthographicCamera(
    clientWidth / -2,
    clientWidth / 2,
    clientHeight / 2,
    clientHeight / -2,
    1,
    1000
  );
  scene.add(camera);

  game.body.forEach((_, index) => {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({
      color: index === 0 ? 0xfff000 : 0xff0000,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    meshes.push(cube);
  });

  game.obstacles.forEach((_) => {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    obstacles.push(cube);
  });

  console.log(meshes);
  let total = 0,
    started = true;

  // 相机位置
  camera.position.set(0, 0, 50);
  // 相机朝向
  camera.lookAt(0, 0, 0);

  function animation() {
    timer.value = requestAnimationFrame(animation);

    game.body.forEach((_, index) => {
      if (meshes[index]) {
        meshes[index].position.set(
          (game.body[index].x - n) * size,
          (n - game.body[index].y) * size,
          0
        );
      } else {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        meshes[index] = cube;
      }
    });
    game.obstacles.forEach((_, index) => {
      obstacles[index].position.set(
        (game.obstacles[index].x - n) * size,
        (n - game.obstacles[index].y) * size,
        0
      );
    });

    if (total % 10 === 0 && started) {
      started = game.update();
      if (!started) {
        alert("游戏结束");
      }
    }
    total++;

    renderer.render(scene, camera);
  }

  animation();
}

onMounted(() => {
  init();
});
</script>
<template>
  <div class="scene" ref="container"></div>
</template>
