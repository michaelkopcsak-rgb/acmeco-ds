import { Main, PageContainer, Stack } from './components/Layout/Layout'
import { Heading } from './components/Heading/Heading'
import { Text } from './components/Text/Text'

// The dev app is a placeholder: the components live in Storybook (npm run storybook).
export default function App() {
  return (
    <Main>
      <PageContainer>
        <Stack gap="md">
          <Heading level={1}>acmeco-ds</Heading>
          <Text>Prototype · AcmeCo is a fictional brand. Run npm run storybook to see the components.</Text>
        </Stack>
      </PageContainer>
    </Main>
  )
}
