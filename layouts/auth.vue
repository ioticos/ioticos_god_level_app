<template>
  <div class="wrapper">
    <notifications></notifications>

    <router-view name="header"></router-view>

    <div :class="{ content: true }" style="margin-top: 100px;">
      <zoom-center-transition :duration="200" mode="out-in">
        <!-- your content here -->
        <nuxt />
      </zoom-center-transition>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import { SlideYDownTransition, ZoomCenterTransition } from "vue2-transitions";

export default {
  name: "auth",
  components: {
    ZoomCenterTransition
  },
  data() {
    return {
      sidebarBackground: "primary" //vue|blue|orange|green|red|primary
    };
  },

  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar("sidebar");
        initScrollbar("main-panel");
        initScrollbar("sidebar-wrapper");

        docClasses.add("perfect-scrollbar-on");
      } else {
        docClasses.add("perfect-scrollbar-off");
      }
    }
  },
  mounted() {
    this.initScrollbar();
  }
};
</script>

<style lang="scss">
$scaleSize: 0.95;

@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }

  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
