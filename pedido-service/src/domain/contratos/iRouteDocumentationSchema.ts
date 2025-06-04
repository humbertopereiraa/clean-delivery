export interface IRouteDocumentationSchema {
  body?: SchemaDefinition
  querystring?: SchemaDefinition
  params?: SchemaDefinition
  headers?: SchemaDefinition
  response?: {
    [statusCode: number]: SchemaDefinition
  }
  tags?: string[]
  summary?: string
  description?: string
}

export interface SchemaDefinition {
  type: string
  required?: string[]
  properties?: Record<string, PropertyDefinition>
  items?: SchemaDefinition
  example?: any
  description?: string
  enum?: string[]
  default?: any
}

export interface PropertyDefinition {
  type: string
  format?: string
  example?: any
  description?: string
  enum?: string[]
  default?: any
  properties?: Record<string, PropertyDefinition>
  required?: string[]
  items?: PropertyDefinition
  minLength?: number
}
