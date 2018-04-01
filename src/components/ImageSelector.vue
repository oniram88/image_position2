<template>
    <b-container>
        <b-row align-h="center">
            <b-col cols="12">
                <b-form>
                    <b-row>

                        <b-col cols="6">
                            <b-form-input v-model="image_source" placeholder="Choose a file..."></b-form-input>
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

                            <b-btn @click="onSubmit">Carica immagine</b-btn>
                        </b-col>

                        <b-col cols="12">
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

        <b-row>
            <b-col cols="10">
                <div id="container_immagine">
                    <b-img v-on:mousemove="mouse_move" ref="image" :src="image_source"
                           :class="class_zoom_level"></b-img>
                </div>
            </b-col>
            <b-col cols="2">

                x:{{x}}<br>
                y:{{y}}<br>
                image_height:{{image_width}}<br>
                image_height:{{image_height}}<br>
                <br>

                x mm:{{x_mm}}<br>
                y mm:{{y_mm}}<br>

            </b-col>
        </b-row>

    </b-container>

</template>

<script>
    /* eslint-disable handle-callback-err */

    const _ = require('lodash')

    export default {
      name: 'image_selector',
      data: function () {
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
          image: '',
          image_source: '',
          altezza_tela: '',
          larghezza_tela: '',
          x: 0,
          y: 0,
          image_width: 0,
          image_height: 0

        }
      },
      computed: {
        class_zoom_level () {
          return `zoom_level${this.selected_zoom.toString().replace('.', '_')}`
        },
        x_mm () {
          return this.larghezza_tela / this.image_width * this.x
        },
        y_mm () {
          return this.altezza_tela / this.image_height * this.y
        }
      },
      watch: {
        selected_zoom () {
          this.update_image_dim()
        },
        image_source () {
          this.update_image_dim()
        }
      },
      methods: {
        update_image_dim: _.debounce(function () {
          this.image_width = this.$refs.image.width
          this.image_height = this.$refs.image.height
        }, 300),
        onSubmit: function () {
          console.log(this.image_path)
        },

        onReset () {

        },
        mouse_move (e) {
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
