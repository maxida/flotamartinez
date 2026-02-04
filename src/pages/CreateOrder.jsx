import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// CreateOrder page disabled — redirecting to dashboard
export default function CreateOrder() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/', { replace: true }) }, [navigate])
  return null
}
