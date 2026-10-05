import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Notification } from '../../types/customer';

// Mock initial customer notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
  id: 'notif-1',
  title: 'Order Preparing Fresh!',
  body: "Aunty Sunita's Kitchen has started preparing your Special Gujarati Dal Tadka with fresh ingredients.",
  type: 'order',
  isRead: false,
  createdAt: '10 mins ago',
  data: { orderId: 'HB-92841' },
},
{
  id: 'notif-2',
  title: 'Subscription Reminder: Tomorrow’s Lunch',
  body: 'Your Homely Daily Lunch Dabba is scheduled for tomorrow between 12:30 PM - 01:15 PM.',
  type: 'subscription',
  isRead: false,
  createdAt: '1 hour ago',
  data: { subscriptionId: 'sub-01' },
},
{
  id: 'notif-3',
  title: 'Wallet Cashback Credited',
  body: '₹50 cashback has been added to your HomeBite Wallet for your first subscription renewal.',
  type: 'payment',
  isRead: true,
  createdAt: 'Yesterday, 6:30 PM',
},
{
  id: 'notif-4',
  title: 'Weekend Special: Traditional Biryani',
  body: 'Shree Sai Student & Working Mess is serving special Sunday Dum Biryani thalis. Pre-book your slot!',
  type: 'promotion',
  isRead: true,
  createdAt: '2 days ago',
  data: { providerId: 'prov-2' },
},
{
  id: 'notif-5',
  title: 'Hygiene & Quality Standard Update',
  body: 'All HomeBite kitchen partners in Baner have completed monthly kitchen safety and sanitization audits.',
  type: 'system',
  isRead: true,
  createdAt: '4 days ago',
},
];

export default function CustomerNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders'>('all');

  const filtered = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'orders') return item.type === 'order' || item.type === 'subscription';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handlePressItem = (item: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );

    // Deep navigation based on notification payload
    if (item.data?.orderId) {
      router.push({
        pathname: '/customer/order-tracking',
        params: { orderId: item.data.orderId },
      });
    } else if (item.data?.subscriptionId) {
      router.push({
        pathname: '/customer/subscription-details',
        params: { subscriptionId: item.data.subscriptionId },
      });
    } else if (item.data?.providerId) {
      router.push({
        pathname: '/customer/provider-details',
        params: { providerId: item.data.providerId },
      });
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return { name: 'receipt' as const, bg: '#FFF2F2', color: '#FF5A5F' };
      case 'subscription':
        return { name: 'calendar-check' as const, bg: '#E8F5E9', color: '#00875A' };
      case 'payment':
        return { name: 'wallet-outline' as const, bg: '#E0F2FE', color: '#0284C7' };
      case 'promotion':
        return { name: 'tag-outline' as const, bg: '#FEF3C7', color: '#D97706' };
      default:
        return { name: 'bell-outline' as const, bg: '#F2F2F7', color: '#636366' };
    }
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
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'unread' && styles.filterChipActive]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[styles.filterChipText, filter === 'unread' && styles.filterChipTextActive]}
          >
            Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'orders' && styles.filterChipActive]}
          onPress={() => setFilter('orders')}
        >
          <Text
            style={[styles.filterChipText, filter === 'orders' && styles.filterChipTextActive]}
          >
            Orders & Meals
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bell-sleep-outline" size={56} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! Updates regarding your food orders and meal subscriptions will appear here.
            </Text>
          </View>
        ) : (
          filtered.map((item) => {
            const iconConfig = getNotificationIcon(item.type);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
                onPress={() => handlePressItem(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, { backgroundColor: iconConfig.bg }]}>
                  <MaterialCommunityIcons
                    name={iconConfig.name}
                    size={20}
                    color={iconConfig.color}
                  />
                </View>

                <View style={styles.contentWrap}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.notifTitle, !item.isRead && styles.notifTitleUnread]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMessage} numberOfLines={3}>
                    {item.body}
                  </Text>
                  <Text style={styles.notifTime}>{item.createdAt}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filterChipActive: {
    backgroundColor: '#FF5A5F',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  notifCardUnread: {
    borderColor: '#FFD3D4',
    backgroundColor: '#FFFBFA',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 6,
  },
  notifTitleUnread: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5A5F',
  },
  notifMessage: {
    fontSize: 12,
    color: '#636366',
    lineHeight: 17,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
});
