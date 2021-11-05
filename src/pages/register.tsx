import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../components/inputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values }) // this return a promise needed to stop the spinner or isSubmitting

          if (response.data?.register.errors) {
            console.log(toErrorMap(response.data.register.errors))
            setErrors(toErrorMap(response.data.register.errors))
            // set errors shows error below input field. to show error below particular field we say {username: "too small"}
          } else if (response.data?.register.user) {
            // worked
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="username"
            />
            <Box mt={4}>
              <InputField name="email" placeholder="email" label="email" />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
