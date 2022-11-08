<template>
  <div class="share-sidebar container-fluid" :style="{ width:getShareWidth }"
       :class="{'share-expanded': !isShareCollapsed}">
    <TransitionGroup name="list" tag="div" class="row no-gutters share-list" mode="out-in">
      <b-col cols="12" class="py-2" v-for="folder in folderList" :key="folder.name">
        <b-card>
          <b-card-body class="row p-0">
            <b-col cols="2"><font-awesome-icon icon="fa-solid fa-folder" size="sm"/></b-col>
            <b-col>{{ folder.name }}</b-col>
          </b-card-body>
        </b-card>
      </b-col>
    </TransitionGroup>
    <b-row class="share-form">
      <b-col cols="12" class="pr-0">
        <b-button :pressed.sync="checked" variant="primary" pill>Compartir</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Folder from "@/models/folder";
import {defineComponent} from "vue";

const SHARE_WIDTH = 275;
const SHARE_WIDTH_COLLAPSED = 0;

export default defineComponent({
  name: "SharePanel",
  props: {},
  data() {
    return {
      checked: false
    }
  },
  computed: {
    isShareCollapsed(): boolean {
      return !this.$store.state.isShareActive;
    },
    getShareWidth(): string {
      return `${this.isShareCollapsed ? SHARE_WIDTH_COLLAPSED : SHARE_WIDTH}px`;
    },
    folderList(): Folder[] {
      return this.$store.state.shareList;
    }
  },
})
</script>

<style scoped lang="scss">

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;

  & > .btn-branch {
    transition: all 0.5s ease-in-out;
  }
}

.list-enter,
.list-leave-to {
  opacity: 0;

  & > .btn-branch {
    opacity: 0;
  }
}


.list-leave-active {
  position: absolute;
  transform: translateX(200%);
}

.share-sidebar {
  padding: 0;
  display: flex;
  float: right;
  position: fixed;
  background-color: white;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;

  transition: width 0.5s ease-in-out, opacity ease-in-out 0.5s;

  flex-direction: column;

  &.share-expanded {
    opacity: 100%;
  }

  &:not(.share-expanded) {
    opacity: 0;
  }

  .share-list {
    display: block;
    overflow: auto;
    margin-bottom: 50px;
    height: 100%;
    padding: 10px 15px;
  }

  .share-form {
    position: fixed;
    bottom: 0;
    right: 0;
    height: 50px;
    width: 290px;
    margin: 0;
  }
}

</style>

