import * as Sentry from '@sentry/react-native';
import { Button, StyleSheet, Text, View } from 'react-native';

const testError = () => {
    try {
        throw new Error('Test error');
    } catch (error) {
        const sentryID = Sentry.captureException(error);
        
        Sentry.captureFeedback({
            message: 'This is a test feedback from the user.', 
            name: 'User Feedback',
            email: 'user@example.com',
            associatedEventId: sentryID
        });
    }
}

const Page = () => {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>This is feed</Text>
            <Button onPress={testError} title='Send Test Error' />
        </View>
    )
}

export default Page;
const styles = StyleSheet.create({})