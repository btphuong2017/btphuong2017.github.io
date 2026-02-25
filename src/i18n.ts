import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => ({
  messages: {},
  locale: "vi",
  timeZone: "Asia/Ho_Chi_Minh",
}))
