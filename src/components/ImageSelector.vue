<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12">
        <b-form>
          <b-row>

            <b-col cols="6">
              <b-form-input v-model="image_source" placeholder="Inserisci url per immagine"></b-form-input>
            </b-col>


            <b-col cols="2">
              <b-form-input v-model.number="larghezza_tela"
                            type="text"
                            placeholder="Larghezza della tela in mm"></b-form-input>
            </b-col>


            <b-col cols="2">
              <b-form-input v-model.number="altezza_tela"
                            type="text"
                            placeholder="Altezza della tela in mm"></b-form-input>
            </b-col>


            <b-col cols="2">
              <b-button-group>
                <b-button v-for="btn in zoom_buttons" :key="btn.level"
                          :pressed="btn.level == selected_zoom"
                          @click="selected_zoom=btn.level">x{{btn.level}}
                </b-button>
              </b-button-group>
            </b-col>


          </b-row>

        </b-form>
      </b-col>
    </b-row>

    <b-row class="mt-2">


      <b-col cols="12">

        <b-row align-h="between">
          <b-col cols="2">
            x mm:{{sx_t.x | round}}<br>
            y mm:{{sx_t.y | round}}<br>
          </b-col>
          <b-col cols="2">
            x mm:{{dx_t.x | round}}<br>
            y mm:{{dx_t.y | round}}<br>
          </b-col>
        </b-row>


      </b-col>


      <b-col cols="12">
        <div id="container_immagine">
          <b-img v-on:click="mouse_move" ref="image" :src="image_source"
                 :class="class_zoom_level"></b-img>
        </div>
      </b-col>

      <b-col cols="12">

        <b-row align-h="between">
          <b-col cols="2">
            x mm:{{sx_b.x | round}}<br>
            y mm:{{sx_b.y | round}}<br>
          </b-col>
          <b-col cols="2">
            x mm:{{dx_b.x | round}}<br>
            y mm:{{dx_b.y | round}}<br>
          </b-col>
        </b-row>


      </b-col>


    </b-row>

  </b-container>

</template>

<script>
  /* eslint-disable handle-callback-err */

  const _ = require('lodash')
  const localStorage = require('web-storage')().localStorage;

  export default {
    name: 'image_selector',
    data: function () {

      let image_path = localStorage.get('image_path');
      let altezza_tela = localStorage.get('altezza_tela') || '';
      let larghezza_tela = localStorage.get('larghezza_tela') || '';

      return {
        zoom_buttons: [
          {level: 1},
          {level: 1.5},
          {level: 2},
          {level: 2.5},
          {level: 3}
        ],
        selected_zoom: 1,
        test: 'xiao',
        image_source: image_path,
        altezza_tela: altezza_tela,
        larghezza_tela: larghezza_tela,
        x: 0,
        y: 0,
        image_width: 0,
        image_height: 0

      }
    },
    filters: {
      round(val) {
        if (_.isNumber(val)) {
          return Math.round(val);
        }
        return '';
      }
    },
    computed: {
      class_zoom_level() {
        return `zoom_level${this.selected_zoom.toString().replace('.', '_')}`
      },
      sx_t() {
        return {
          x: this.larghezza_tela / this.image_width * this.x,
          y: this.altezza_tela / this.image_height * this.y
        }
      },
      dx_t() {
        return {
          x: this.larghezza_tela - this.sx_t.x,
          y: this.sx_t.y
        }
      },
      sx_b() {
        return {
          x: this.sx_t.x,
          y: this.altezza_tela - this.sx_t.y
        }
      },
      dx_b() {
        return {
          x: this.larghezza_tela - this.sx_t.x,
          y: this.altezza_tela - this.sx_t.y
        }
      }
    },
    watch: {
      selected_zoom() {
        this.update_image_dim()
      },
      image_source(new_val) {
        this.update_image_dim()
        localStorage.set('image_path', new_val);
      },
      altezza_tela(new_val) {
        localStorage.set('altezza_tela', new_val);
        this.update_image_dim()
      },
      larghezza_tela(new_val) {
        localStorage.set('larghezza_tela', new_val);
        this.update_image_dim()
      }
    },
    created() {
      this.update_image_dim()
    },
    methods: {
      update_image_dim: _.debounce(function () {
        this.image_width = this.$refs.image.width
        this.image_height = this.$refs.image.height
      }, 300),
      mouse_move(e) {
        this.x = e.pageX - e.target.x
        this.y = e.pageY - e.target.y
      }
    }
  }
</script>

<style scoped lang="scss">
  #container_immagine {
    overflow: scroll;
    max-height: 450px;
    img {
      width: 100%;
      &.zoom_level1_5 {
        width: 150%;
      }
      &.zoom_level2 {
        width: 200%;
      }
      &.zoom_level2_5 {
        width: 250%;
      }
      &.zoom_level3 {
        width: 300%;
      }
    }
  }
</style>
