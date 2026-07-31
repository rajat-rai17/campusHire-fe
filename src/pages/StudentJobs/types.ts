export type UserRole = 'admin' | 'user' | 'owner'

export type Job = {
  companyId: any
  programId: any
  jobId: number
  title: string
  description: string
  interviewDate: Date
  location: string
  companies: string
  programs: string[]
  type: string
  locationType: string
}
