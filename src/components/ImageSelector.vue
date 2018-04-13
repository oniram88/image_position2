<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12">
        <b-form>
          <b-row v-if="show_configuration">

            <b-col cols="4">
              <b-form-group label="Immagine">
                <b-form-input v-model="image_source" placeholder="Inserisci url per immagine"></b-form-input>
              </b-form-group>
            </b-col>


            <b-col cols="2">
              <b-form-group label="Larghezza tela">
                <b-form-input v-model.number="larghezza_tela"
                              type="number"
                              placeholder="Larghezza della tela in mm"></b-form-input>
              </b-form-group>
            </b-col>


            <b-col cols="2">
              <b-form-group label="Altezza tela">
                <b-form-input v-model.number="altezza_tela"
                              type="number"
                              placeholder="Altezza della tela in mm"></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="2">
              <b-form-group label="Offset X tela">
                <b-form-input v-model.number="offset_x"
                              type="number"
                              placeholder="Offset X in mm"></b-form-input>
              </b-form-group>
            </b-col>


            <b-col cols="2">
              <b-form-group label="Offset Y">
                <b-form-input v-model.number="offset_y"
                              type="number"
                              placeholder="Offset Y in mm"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-button @click="show_configuration=false">
                Nascondi impostazioni
              </b-button>
            </b-col>
          </b-row>
          <b-row>

            <b-col>
              <b-button-group>
                <b-button v-for="btn in zoom_buttons" :key="btn.level"
                          :pressed="btn.level == selected_zoom"
                          @click="selected_zoom=btn.level">x{{btn.level}}
                </b-button>
              </b-button-group>

            </b-col>

            <b-col>
              <b-button @click="show_configuration=true" v-if="!show_configuration">
                visualizza impostazioni
              </b-button>
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
          <div id="center_image"
               v-bind:style="style_center_position"></div>
          <div id="clicked_position"
               v-bind:style="style_clicked_position"></div>
          <b-img v-on:click="mouse_move" ref="image" :src="image_source"
                 :style="style_zoom_level"></b-img>
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
      let offset_x = localStorage.get('offset_x') || 0;
      let offset_y = localStorage.get('offset_y') || 0;

      return {
        show_configuration: true,
        zoom_buttons: [
          {level: 1},
          {level: 1.5},
          {level: 2},
          {level: 2.5},
          {level: 3},
          {level: 3.5},
          {level: 4}
        ],
        selected_zoom: 1,
        test: 'xiao',
        image_source: image_path,
        offset_x: offset_x,
        offset_y: offset_y,
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
      center_position_x() {
        return this.offset_x * this.selected_zoom;
      },
      center_position_y() {
        return this.offset_y * this.selected_zoom;
      },
      style_clicked_position() {
        return {
          top: `${this.y}px`,
          left: `${this.x}px`
        }
      },
      style_center_position() {
        return {
          top: `${this.center_position_y}px`,
          left: `${this.center_position_x}px`
        }
      },
      style_zoom_level() {
        return {width: this.selected_zoom * 100 + "%"};//`zoom_level${this.selected_zoom.toString().replace('.', '_')}`
      },
      sx_t() {
        return {
          x: (this.larghezza_tela / this.image_width * (this.x - this.center_position_x)) * -1,
          y: (this.altezza_tela / this.image_height * (this.y - this.center_position_y)) * -1
        }
      },
      dx_t() {
        return {
          x: (this.larghezza_tela / this.image_width * (this.x - this.center_position_x)),
          y: (this.altezza_tela / this.image_height * (this.y - this.center_position_y)) * -1
        }
      },
      sx_b() {
        return {
          x: (this.larghezza_tela / this.image_width * (this.x - this.center_position_x)) * -1,
          y: (this.altezza_tela / this.image_height * (this.y - this.center_position_y))
        }
      },
      dx_b() {
        return {
          x: (this.larghezza_tela / this.image_width * (this.x - this.center_position_x)),
          y: (this.altezza_tela / this.image_height * (this.y - this.center_position_y))
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
      },
      offset_x(new_val) {
        localStorage.set('offset_x', new_val);
      },
      offset_y(new_val) {
        localStorage.set('offset_y', new_val);
      }
    },
    created() {
      this.update_image_dim()
    },
    methods: {
      update_image_dim: _.debounce(function () {
        this.image_width = this.$refs.image.width;
        this.image_height = this.$refs.image.height;

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
    position: relative;
    img {
      width: 100%;
    }
    #center_image,#clicked_position {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 3px;
      background-color: red;
      &#clicked_position{
        background-color: #00e516;
      }
    }
  }
</style>
