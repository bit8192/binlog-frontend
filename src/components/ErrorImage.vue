<template>
  <div class="text-center bg-gainsboro color-white" style="padding: 60px">
    <font-awesome-icon icon="image" size="3x" />
  </div>
</template>

<script lang="ts">
import {library} from "@fortawesome/fontawesome-svg-core";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {Options, Vue} from "vue-class-component";

library.add(faImage)
@Options({
  name: "ErrorImage"
})
export default class ErrorImage extends Vue{
}
</script>

<style scoped>

</style>
