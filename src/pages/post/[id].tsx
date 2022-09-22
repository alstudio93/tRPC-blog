import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Markdown from '../../components/Markdown';
import Navbar from '../../components/Navbar';
import { trpc } from '../../utils/trpc'

const SinglePost = ({id}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {data} = trpc.useQuery(["post.get-post-by-id", {id}]);

  return (
    <>  
        <Navbar />
            <main className='max-w-6xl mx-auto pt-10'>
            <h1 className='text-center text-6xl pb-10'>{data?.title}</h1>
            <Markdown>{data?.content as string}</Markdown>  
        </main>
    </>
  )
}

export default SinglePost

export const getServerSideProps: GetServerSideProps = async({query})=> {
const {id} = query

    return {
        props: {
            id
        }
    }
}