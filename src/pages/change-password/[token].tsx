// you have to name the file as [name].
//the name can be anything, the name doesn't have to match the variable name given in the link in  server.
// the name of the file doesn't concern the name of the url in server

import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { InputField } from '../../components/inputField'
import { Wrapper } from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'

//NextPage<{ token: string }>
// this means that whatever after http://localhost:3000/change-password/ is stored in 'token' variable. the variable name is used for query

// this token variable is accessed via query object in getinitialprops and passed to ({ token }) => {

const ChangePassword: NextPage /*<{ token: string }> */ = (/*{ token }*/) => {
  const router = useRouter()
  console.log(router.query)
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            // The in operator returns true if the specified property is in the specified object
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            // worked
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} style={{ color: 'red' }}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   }
// }

export default withUrqlClient(createUrqlClient, { ssr: false })(
  ChangePassword as any
)
