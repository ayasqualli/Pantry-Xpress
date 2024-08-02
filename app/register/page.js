import dynamic from 'next/dynamic'

const Register = dynamic(() => import('./register'), { ssr: false })

export default function RegisterPage() {
  return <Register />;
}