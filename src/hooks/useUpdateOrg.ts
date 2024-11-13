// hooks/useEditOrganization.js
import useSWR, { mutate } from 'swr'
import axios from 'axios'
import { apiUrl } from '../utils/apiUrl'

const useEditOrganization = (orgId: string) => {
  const { data, error } = useSWR(orgId ? `${apiUrl}/organization/${orgId}` : null, fetcher)

  // Fetcher function for SWR
  async function fetcher(url: string) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data
  }

  // Update organization function
  const updateOrganization = async (updatedData: any) => {
    try {
      // Perform the PUT request to update organization data
      const response = await axios.put(
        `${apiUrl}/organization/${orgId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )
      
      // Update SWR cache for the organization
      mutate(`${apiUrl}/organization/${orgId}`, { ...data, ...updatedData }, false)

      // Optionally revalidate data after mutation to refresh SWR cache with fresh data
      await mutate(`${apiUrl}/organization/${orgId}`)
      
      return response.data
    } catch (error) {
      console.error('Failed to update organization:', error)
      throw error
    }
  }

  return {
    organization: data,
    isLoading: !error && !data,
    isError: error,
    updateOrganization,
  }
}

export default useEditOrganization
