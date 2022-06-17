import * as convert from 'color-convert'
import { v4 as uuidv4 } from 'uuid'
import { ColorObject, ColorModeEnum } from '@module/color/color.entity';

export const buildColorObj = (colors: string[]): ColorObject[] => {
  let i = 0
  return colors.map(color => {
    const hex = getHexValue(color)

    const rgb = convert.hex.rgb(hex)
    const hsv = convert.hex.hsv(hex)
    const hsl = convert.hex.hsl(hex)
    const hwb = convert.hex.hwb(hex)
    const lab = convert.hex.lab(hex)
    const xyz = convert.hex.xyz(hex)
    const cmyk = convert.hex.cmyk(hex)

    const newColor = {
      _id: uuidv4(),
      title: `Color ${++i}`,
      tags: [],
      selectedColorMode: ColorModeEnum.hex,
      hex: `#${hex}`,
      rgb: {
        css: `rgb(${rgb})`,
        red: rgb[0],
        green: rgb[1],
        blue: rgb[2],
      },
      hsv: {
        css: `hsv(${hsv})`,
        hue: hsv[0],
        saturation: hsv[1],
        value: hsv[2],
      },
      hsl: {
        css: `hsl(${hsl})`,
        hue: hsl[0],
        saturation: hsl[1],
        lightness: hsl[2],
      },
      hwb: {
        css: `hwb(${hwb})`,
        hue: hwb[0],
        whiteness: hwb[1],
        blackness: hwb[2],
      },
      lab: {
        css: `lab(${lab})`,
        lightness: lab[0],
        a: lab[1],
        b: lab[2],
      },
      xyz: {
        css: `xyz(${xyz})`,
        x: xyz[0],
        y: xyz[1],
        z: xyz[2],
      },
      cmyk: {
        css: `cmyk(${cmyk})`,
        cyan: cmyk[0],
        magenta: cmyk[1],
        yellow: cmyk[2],
        key: cmyk[3],
      },
    }
    return newColor
  })
}

export const getHexValue = (color: string) => {
  if (color.match(/^#[0-9a-f]{3,6}$/i)) {
    return color.substring(1) // strips #
  }
  const rgbColor = color.match(
    /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i,
  )
  return convert.rgb.hex(rgbColor[1], rgbColor[2], rgbColor[3])
}

export const toHex = (color: string) => {
  const hexRegEx = new RegExp(/^#[0-9a-f]{3,6}$/i)
  if (hexRegEx.test(color)) {
    return color
  }
  const rgb = color.match(
    /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i,
  )
  return rgb && rgb.length === 4
    ? '#' +
    ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
    : ''
}
