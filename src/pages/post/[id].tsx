import { Box, Heading } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons'
import { Layout } from '../../components/Layout'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl()
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    )
  }
  return (
    <Layout>
      <Heading>{data.post.title}</Heading>
      {data.post.text}
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
      {/* ?. : this used to check if objects is null or undefined */}
    </Layout>
  )
}
// let x = foo?.bar.baz();
// this code will check if foo is defined otherwise it will return undefined

// old way :

// if(foo != null && foo != undefined) {
//    x = foo.bar.baz();
// }

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
