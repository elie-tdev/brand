import * as chargebee from 'chargebee'

export const InitChargebee = () => {
  chargebee.configure({
    site: process.env.CHARGEBEE_SITE,
    api_key: process.env.CHARGEBEE_API_KEY,
  })
}
