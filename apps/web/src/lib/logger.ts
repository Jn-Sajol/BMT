export const logger = {
  info: (msg: string, meta?: any) => {
    console.log(JSON.stringify({ level: "INFO", message: msg, timestamp: new Date().toISOString(), ...meta }))
  },
  error: (msg: string, err?: any) => {
    console.error(JSON.stringify({ level: "ERROR", message: msg, error: err?.message, timestamp: new Date().toISOString() }))
  },
}
