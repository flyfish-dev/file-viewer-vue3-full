import type { ViewerOptions } from '@file-viewer/vue3'

export const DEFAULT_FULL_ASSET_BASE_URL = '/file-viewer/'

let defaultFullAssetBaseUrl: string | undefined = DEFAULT_FULL_ASSET_BASE_URL

export function normalizeFullAssetBaseUrl(baseUrl?: string | URL | null) {
  if (!baseUrl) {
    return undefined
  }
  const value = String(baseUrl).trim()
  if (!value) {
    return undefined
  }
  return value.endsWith('/') ? value : `${value}/`
}

export function createFullAssetOptions(assetBaseUrl?: string | URL | null): ViewerOptions {
  const baseUrl = normalizeFullAssetBaseUrl(assetBaseUrl)
  if (!baseUrl) {
    return {}
  }
  return {
    archive: {
      workerUrl: `${baseUrl}vendor/libarchive/worker-bundle.js`,
      wasmUrl: `${baseUrl}vendor/libarchive/libarchive.wasm`
    },
    cad: {
      wasmPath: `${baseUrl}wasm/cad/`,
      workerUrl: `${baseUrl}wasm/cad/dwg-worker.js`,
      dwfWasmUrl: `${baseUrl}wasm/cad/dwfv-render.wasm`
    },
    data: {
      sqlWasmUrl: `${baseUrl}wasm/data/sql-wasm.wasm`
    },
    docx: {
      workerUrl: `${baseUrl}vendor/docx/docx.worker.js`,
      workerJsZipUrl: `${baseUrl}vendor/docx/jszip.min.js`
    },
    drawing: {
      viewerScriptUrl: `${baseUrl}vendor/drawio/viewer-static.min.js`
    },
    pdf: {
      workerUrl: `${baseUrl}vendor/pdf/pdf.worker.mjs`,
      cMapUrl: `${baseUrl}vendor/pdf/cmaps/`,
      wasmUrl: `${baseUrl}vendor/pdf/wasm/`,
      standardFontDataUrl: `${baseUrl}vendor/pdf/standard_fonts/`,
      cjkFontFallbackPath: `${baseUrl}vendor/pdf/fonts/`
    },
    presentation: {
      workerUrl: `${baseUrl}vendor/pptx/pptx.worker.js`
    },
    spreadsheet: {
      workerUrl: `${baseUrl}vendor/xlsx/sheet.worker.js`
    },
    typst: {
      compilerWasmUrl: `${baseUrl}wasm/typst/typst_ts_web_compiler_bg.wasm`,
      rendererWasmUrl: `${baseUrl}wasm/typst/typst_ts_renderer_bg.wasm`,
      fontAssetsUrl: `${baseUrl}wasm/typst/fonts/`
    }
  }
}

function mergeNestedOptions<Options extends object>(
  defaults: Options | undefined,
  overrides: Options | undefined
): Options {
  if (!defaults) {
    return overrides as Options
  }
  if (!overrides) {
    return defaults
  }
  return {
    ...defaults,
    ...overrides
  } as Options
}

export function mergeFullAssetOptions(
  options: ViewerOptions = {},
  assetBaseUrl: string | URL | null | undefined = defaultFullAssetBaseUrl
): ViewerOptions {
  const assetOptions = createFullAssetOptions(assetBaseUrl)
  return {
    ...options,
    archive: mergeNestedOptions(assetOptions.archive, options.archive),
    cad: mergeNestedOptions(assetOptions.cad, options.cad),
    data: mergeNestedOptions(assetOptions.data, options.data),
    docx: mergeNestedOptions(assetOptions.docx, options.docx),
    drawing: mergeNestedOptions(assetOptions.drawing, options.drawing),
    pdf: mergeNestedOptions(assetOptions.pdf, options.pdf),
    presentation: mergeNestedOptions(assetOptions.presentation, options.presentation),
    spreadsheet: mergeNestedOptions(assetOptions.spreadsheet, options.spreadsheet),
    typst: mergeNestedOptions(assetOptions.typst, options.typst)
  }
}

export function getDefaultFullAssetBaseUrl() {
  return defaultFullAssetBaseUrl
}

export function setDefaultFullAssetBaseUrl(assetBaseUrl?: string | URL | null) {
  defaultFullAssetBaseUrl = normalizeFullAssetBaseUrl(assetBaseUrl)
}
