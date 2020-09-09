import React, {useState, FormEvent, useEffect} from 'react';
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'

import logoImg from '../../assets/logo.svg'

import { Title, Form, Repositories, Error } from './styles'
import Repository from '../Repository';

interface Respository {
    full_name: string;
    description: string;
    owner:{
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [inputError, setInputError] = useState('')
    const [newRepo, setNewRepo] = useState('')
    const [repositories, setRepositories] = useState<Respository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories')

        if(storageRepositories) {
            return JSON.parse(storageRepositories)
        }
        return []
    })

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddRepo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!newRepo){
            setInputError('Esqueceu de colocar o repo :s')
            return

        }try {

            const response = await api.get<Respository>(`repos/${newRepo}`)

            const repository = response.data
            if(repositories.indexOf(repository)){
              setInputError('Este repositório ja está na lista')
              return
            }

            setRepositories([...repositories, repository])
            setNewRepo('')
            setInputError('')

        } catch (Err) {

            setInputError('Erro na busca por esse repo')

        }

    }

    return (
    <>
        <img src={logoImg} alt="Github Explorer"/>
        <Title>Explore Repositórios no GitHub</Title>

        <Form hasError={Boolean(!!inputError)} onSubmit={handleAddRepo}>
            <input
            value={newRepo}
            onChange={ (e)=> setNewRepo(e.target.value)}
            placeholder="Digite o nome do repo"/>
            <button type="submit">Pesquisar</button>
        </Form>

        { inputError && <Error>{inputError}</Error> }

        <Repositories>
            {repositories.map(repository => (
                <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>

                    <img src={repository.owner.avatar_url} alt={repository.owner.login}/>

                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>

                    <FiChevronRight size={20} />
                </Link>
            ))}
        </Repositories>
    </>
    )
}

export default Dashboard;
