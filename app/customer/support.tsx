import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do meal subscriptions work?',
    answer:
      'You can subscribe to daily, weekly, or monthly breakfast, lunch, or dinner tiffin plans from local housewives and messes. You can pause anytime or skip individual days with zero financial penalty.',
  },
  {
    id: 'faq-2',
    question: 'What if I want to skip a meal tomorrow?',
    answer:
      'Go to your Subscriptions tab, tap "Skip Tomorrow" or choose the date in Subscription Details. Your subscription validity will automatically be extended by one day.',
  },
  {
    id: 'faq-3',
    question: 'How is kitchen hygiene and quality ensured?',
    answer:
      'All HomeBite home chefs and messes undergo physical kitchen hygiene inspections and packaging quality checks before being approved onto the platform.',
  },
  {
    id: 'faq-4',
    question: 'Can I cancel an instant meal order?',
    answer:
      'Orders can be cancelled with a full refund within 2 minutes of placement or before the kitchen partner accepts and begins cooking.',
  },
];

export default function CustomerSupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleLiveChat = () => {
    Alert.alert(
      'HomeBite Live Chat',
      'Connecting to HomeBite customer delight executive... Average wait time is under 1 minute.',
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const handleCallSupport = () => {
    Alert.alert('Call Support', 'Dial HomeBite Customer Care at +91 1800 200 9988?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL('tel:18002009988').catch(() => {
            Alert.alert('Error', 'Unable to dial phone number on this device.');
          });
        },
      },
    ]);
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      Alert.alert('Missing Details', 'Please provide a brief subject and description of your issue.');
      return;
    }

    Alert.alert(
      'Ticket Created',
      `Support ticket #${Math.floor(100000 + Math.random() * 900000)} has been submitted. Our team will contact you within 30 minutes.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setTicketSubject('');
            setTicketDescription('');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Contact Options */}
        <View style={styles.quickContactRow}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleLiveChat}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: '#FFF2F2' }]}>
              <Ionicons name="chatbubbles" size={22} color="#FF5A5F" />
            </View>
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactSubtitle}>Instant response</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleCallSupport}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="call" size={22} color="#00875A" />
            </View>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSubtitle}>Toll Free 24/7</Text>
          </TouchableOpacity>
        </View>

        {/* Raise an Issue / Ticket */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Raise a Support Request</Text>
          <Text style={styles.sectionSubtitle}>
            Have a problem with food quality, delivery delays, or refunds?
          </Text>

          <Text style={styles.inputLabel}>Subject / Order Reference</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Order #HB-92841 food was delayed"
            value={ticketSubject}
            onChangeText={setTicketSubject}
          />

          <Text style={styles.inputLabel}>Describe what happened</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Please write specific details so our team can resolve it quickly..."
            multiline
            numberOfLines={4}
            value={ticketDescription}
            onChangeText={setTicketDescription}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmitTicket}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Submit Request</Text>
          </TouchableOpacity>
        </View>

        {/* Frequently Asked Questions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQ_LIST.map((faq) => {
              const isExpanded = expandedFaq === faq.id;

              return (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestionRow}
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer Support Hours */}
        <View style={styles.footerNote}>
          <MaterialCommunityIcons name="heart-outline" size={16} color="#FF5A5F" />
          <Text style={styles.footerNoteText}>
            HomeBite Customer Delight is available 7 days a week, 8:00 AM - 11:00 PM
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  quickContactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  contactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  contactSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 14,
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 6,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 10,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  faqList: {
    marginTop: 8,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingVertical: 12,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 10,
    lineHeight: 18,
  },
  faqAnswerText: {
    fontSize: 12,
    color: '#636366',
    lineHeight: 18,
    marginTop: 8,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    flex: 1,
  },
});
