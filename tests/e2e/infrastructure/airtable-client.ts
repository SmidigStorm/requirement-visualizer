import { AIRTABLE_CONFIG } from "../config/airtable.config"

interface AirtableRecord<T> {
  id: string
  fields: T
}

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export class AirtableClient {
  private baseUrl = AIRTABLE_CONFIG.baseUrl
  private headers = {
    Authorization: `Bearer ${AIRTABLE_CONFIG.apiToken}`,
    "Content-Type": "application/json",
  }

  async create<T extends Record<string, unknown>>(
    table: string,
    fields: T
  ): Promise<AirtableRecord<T>> {
    const response = await fetch(`${this.baseUrl}/${table}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ fields }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create record in ${table}: ${error}`)
    }

    return response.json()
  }

  async delete(table: string, recordId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${table}/${recordId}`, {
      method: "DELETE",
      headers: this.headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete record ${recordId} from ${table}: ${error}`)
    }
  }

  async list<T>(
    table: string,
    filterByFormula?: string
  ): Promise<AirtableRecord<T>[]> {
    const params = new URLSearchParams()
    if (filterByFormula) {
      params.set("filterByFormula", filterByFormula)
    }

    const url = `${this.baseUrl}/${table}?${params.toString()}`
    const response = await fetch(url, {
      headers: this.headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list records from ${table}: ${error}`)
    }

    const data: AirtableListResponse<T> = await response.json()
    return data.records
  }

  async batchDelete(table: string, recordIds: string[]): Promise<void> {
    if (recordIds.length === 0) return

    // Airtable allows max 10 records per batch delete
    const batchSize = 10
    for (let i = 0; i < recordIds.length; i += batchSize) {
      const batch = recordIds.slice(i, i + batchSize)
      const params = batch.map((id) => `records[]=${id}`).join("&")

      const response = await fetch(`${this.baseUrl}/${table}?${params}`, {
        method: "DELETE",
        headers: this.headers,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to batch delete from ${table}: ${error}`)
      }
    }
  }
}
