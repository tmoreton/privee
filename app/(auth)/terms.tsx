import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function () {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
      <View className="flex-1 bg-black items-center justify-center w-full mb-10">
        <Text className="text-white text-2xl font-bold my-5">Terms of Service</Text>
        <View className="w-full px-3">
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">1. Acceptance of Terms</Text>
            <Text className="text-gray-400 leading-6">By accessing or using Privee, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">2. Eligibility</Text>
            <Text className="text-gray-400 leading-6">Privee is only available to individuals who are 13 years of age or older. By using Privee, you represent and warrant that you are at least 13 years old.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">3. User Accounts</Text>
            <Text className="text-gray-400 leading-6">You must create an account to use certain features of Privee. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">4. Content and Conduct</Text>
            <Text className="text-gray-400 leading-6">You are responsible for the content you upload, stream, or share on Privee. You agree not to upload, post, or transmit any content that is illegal, offensive, or infringes on the rights of others. Privee reserves the right to remove any content that violates these terms.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">5. Monetization</Text>
            <Text className="text-gray-400 leading-6">Privee allows users to monetize their content. By using Privee's monetization features, you agree to comply with all applicable laws and regulations. Privee is not responsible for any taxes or fees associated with your earnings.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">6. Privacy</Text>
            <Text className="text-gray-400 leading-6">Your use of Privee is also governed by our Privacy Policy, which can be found here. By using Privee, you consent to the collection and use of your information as outlined in the Privacy Policy.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">7. Intellectual Property</Text>
            <Text className="text-gray-400 leading-6">All content on Privee, including text, graphics, logos, and software, is the property of Privee or its content suppliers and is protected by intellectual property laws. You may not use, reproduce, or distribute any content from Privee without our prior written permission.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">8. Termination</Text>
            <Text className="text-gray-400 leading-6">Privee reserves the right to terminate or suspend your account at any time, without notice, for conduct that Privee believes violates these Terms of Service or is harmful to other users. You may terminate your account at any time by contacting us at support@Privee.com.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">9. Disclaimers</Text>
            <Text className="text-gray-400 leading-6">Privee is provided “as is” and “as available” without warranties of any kind. Privee does not guarantee the accuracy, completeness, or usefulness of any content on the app.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">10. Limitation of Liability</Text>
            <Text className="text-gray-400 leading-6">To the fullest extent permitted by law, Privee shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the app.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">11. Changes to Terms</Text>
            <Text className="text-gray-400 leading-6">Privee reserves the right to modify these Terms of Service at any time. Your continued use of Privee after any such changes constitutes your acceptance of the new terms.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">12. Governing Law</Text>
            <Text className="text-gray-400 leading-6">These Terms of Service are governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law principles.</Text>
          </View>
          <View className="my-2">
            <Text className="text-white text-lg font-semibold">13. Contact Information</Text>
            <Text className="text-gray-400 leading-6">If you have any questions about these Terms of Service, please contact us at support@privee.app.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
