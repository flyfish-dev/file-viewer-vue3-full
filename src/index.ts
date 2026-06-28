import allRenderers from '@file-viewer/preset-all'
import {
  FileViewer as BaseFileViewer,
  createFlyfishFileViewer as createBaseFlyfishFileViewer,
  type CreateFlyfishFileViewerOptions,
  type FileViewerProps,
  type FileViewerVue3Handle,
  type FileViewerVue3PluginOptions,
  type FlyfishFileViewerNativeController,
  type ViewerMountOptions,
  type ViewerOptions
} from '@file-viewer/vue3'
import { computed, defineComponent, h, ref, useAttrs, type App, type PropType } from 'vue'

export * from '@file-viewer/vue3'

export const fileViewerFullPreset = allRenderers

export function withFullViewerOptions(options: ViewerOptions = {}): ViewerOptions {
  const { preset = allRenderers, rendererMode = 'replace', ...rest } = options
  return {
    ...rest,
    preset,
    rendererMode,
    autoRenderers: rest.autoRenderers ?? true
  }
}

export function withFullMountOptions(options: ViewerMountOptions = {}): ViewerMountOptions {
  return {
    ...options,
    options: withFullViewerOptions(options.options)
  }
}

type ExposedViewerRecord = Record<PropertyKey, unknown>
type ExposedViewerMethod = (...args: unknown[]) => unknown

function createFullExpose(getViewer: () => FileViewerVue3Handle | null): FileViewerVue3Handle {
  return new Proxy({}, {
    get(_target, property) {
      return (...args: unknown[]) => {
        const viewer = getViewer() as (FileViewerVue3Handle & ExposedViewerRecord) | null
        if (!viewer) {
          throw new Error('FileViewer is not mounted.')
        }
        const value = viewer[property]
        return typeof value === 'function'
          ? (value as ExposedViewerMethod).apply(viewer, args)
          : value
      }
    }
  }) as FileViewerVue3Handle
}

export const FileViewer = defineComponent({
  name: 'FileViewerFull',
  inheritAttrs: false,
  props: {
    url: String,
    file: null,
    options: Object as PropType<FileViewerProps['options']>
  },
  setup(props, { expose }) {
    const attrs = useAttrs()
    const viewer = ref<FileViewerVue3Handle | null>(null)
    const fullOptions = computed(() => withFullViewerOptions(props.options))

    expose(createFullExpose(() => viewer.value))

    return () => h(BaseFileViewer, {
      ...attrs,
      url: props.url,
      file: props.file,
      options: fullOptions.value,
      ref: viewer
    })
  }
})

export const createFlyfishFileViewer = (
  container: HTMLElement,
  options: CreateFlyfishFileViewerOptions = {}
): FlyfishFileViewerNativeController => {
  return createBaseFlyfishFileViewer(container, {
    ...options,
    options: withFullViewerOptions(options.options)
  })
}

export const mountFlyfishFileViewer = createFlyfishFileViewer

class Installer {
  private installed = false

  install(app: App, options: FileViewerVue3PluginOptions = {}) {
    if (this.installed) {
      return
    }
    app.component(options.componentName || 'file-viewer', FileViewer)
    this.installed = true
  }
}

export default new Installer()
