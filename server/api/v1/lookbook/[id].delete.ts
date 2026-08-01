import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Lookbook ID is required'
      })
    }

    await query('DELETE FROM lookbook WHERE id = ?', [id])

    return {
      success: true,
      message: `Lookbook item ${id} deleted successfully`,
      id: Number(id)
    }
  } catch (err: any) {
    console.error('Error deleting lookbook entry:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Failed to delete lookbook entry'
    })
  }
})
