export class DatabaseConfig {
  readonly host: string
  readonly namespace: string
  readonly database: string
  readonly username: string
  readonly password: string

  constructor(env?: Cloudflare.Env) {
    this.host = env ? env.SURREAL_HOST : process.env.SURREAL_HOST!
    this.namespace = env
      ? env.SURREAL_NAMESPACE
      : process.env.SURREAL_NAMESPACE!
    this.database = env
      ? env.SURREAL_DATABASE
      : process.env.SURREAL_DATABASE!
    this.username = env
      ? env.SURREAL_USER
      : process.env.SURREAL_USER!
    this.password = env
      ? env.SURREAL_PASS
      : process.env.SURREAL_PASS!
  }

  apiPath(): string {
    return `${this.host}/api/${this.namespace}/${this.database}`
  }

  apiHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Basic ${this.username} ${this.password}`,
      "Surreal-NS": `${this.namespace}`,
      "Surreal-DB": `${this.database}`,
    }
  }
}
