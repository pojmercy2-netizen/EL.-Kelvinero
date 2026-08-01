import { getCurrentUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const currentUser = await getCurrentUser(event)
  return currentUser
})
