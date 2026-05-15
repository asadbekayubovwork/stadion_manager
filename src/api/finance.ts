import { http } from './http'
import type { FinanceData } from '../types'

export type FinancePeriod = 'today' | 'week' | 'month'

export function getFinance(period: FinancePeriod = 'week') {
  return http.get<FinanceData>('/finance/get', { period })
}
