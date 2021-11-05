import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: LogoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  const router = useRouter()
  // OPTIONAL: if this request is made in nextjs server then we cant fetch the user as cookie is not forwarded to graphQL API.BUT NOW HAVE FORWARDED THE COOKIE TO API WITH HEADERS IN CREATEURQLCLIENT. SO, THIS CAN BE REMOVED IF NEEDED

  let body = null

  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          onClick={() => {
            logout()
            router.reload()
            // reset the cache to when logout to remove the upvotes or Green/red color on buttons by user
          }}
          isLoading={LogoutFetching}
        >
          logout
        </Button>
      </Flex>
    )
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          {/* href="url in next js server" as="real url" */}
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  )
}
