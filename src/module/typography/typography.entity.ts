export class TypographyEntity {
  typography: TypographyObject[]
}

export interface TypographyObject {
  _id: string
  title?: string
  tags?: string[]
  element?: string
  color?: string
  font?: string
  fontFamily: string
  fontSize?: string
  fontVariant?: string
  source?: TypographySourceObject
}

export interface TypographySourceObject {
  ref?: string
  provider?: string
  variants?: string[]
}
