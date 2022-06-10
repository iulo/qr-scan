// import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
// import { VBtn } from 'vuetify/components'

export function loadVuetify() {
  return createVuetify({
    components: {
      // VBtn
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    }
  })
}
