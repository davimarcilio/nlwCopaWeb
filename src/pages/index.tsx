interface HomeProps {
  guessCount: number;
  poolCount: number;
  userCount: number;
}
import Image from 'next/image'
import appPreviewImg from '../assets/aplicacao-trilha-ignite.png'
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from '../assets/avatares.png';
import iconCheckImg from '../assets/icon.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  async function createPool(event: FormEvent) {

    event.preventDefault()
    try {
      const response = await api.post('/pools', {
        title: poolTitle,

      })
      const { code } = response.data
      await navigator.clipboard.writeText(code)
      alert('Bolão criado com sucesso, codigo copiado')
      setPoolTitle('');
    } catch (error) {
      alert('Falha ao criar o bolão, tente novamente.' + error)
    }

  }
  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'><span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando</strong>
        </div>
        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            type="text"
            onChange={event => setPoolTitle(event.target.value)}
            className='flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-gray-100'
            required
            placeholder="Qual nome do seu bolão?"
            value={poolTitle} />
          <button className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' type="submit">CRIAR MEU BOLÃO</button>
        </form>
        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>
        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100 items-center'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'><span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span></div>
          </div>
          <div className='w-px h-14 bg-gray-600'></div>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'><span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span></div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" quality={100} />
    </div>
  )
}
export const getServerSideProps = async () => {
  const [guessCountResponse, poolCountResponse, userCountResponse] = await Promise.all([
    api.get('/guesses/count'),
    api.get('/pools/count'),
    api.get('/users/count'),
  ])
  return {
    props: {
      guessCount: guessCountResponse.data.count,
      poolCount: poolCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
