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
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import type { CustomerAddress } from '../../types/customer';

// Mock existing addresses
const INITIAL_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    type: "home",
    line1: "123 Example Road",
    line2: "Near Orchid School, Baner",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    isDefault: true,
    deliveryInstructions:
      "Ring bell and leave with security if unavailable",
  },
  {
    id: "addr-2",
    label: "Work",
    type: "work",
    line1: "Tower B, 5th Floor, Cybercity IT Park",
    line2: "Baner Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    isDefault: false,
    deliveryInstructions: "",
  },
];

export default function CustomerAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<CustomerAddress[]>(INITIAL_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [label, setLabel] = useState<string>('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Pune');
  const [pincode, setPincode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setLabel('Home');
    setAddressLine1('');
    setAddressLine2('');
    setCity('Pune');
    setPincode('');
    setDeliveryInstructions('');
    setModalVisible(true);
  };

  const openEditModal = (addr: CustomerAddress) => {
  setEditingId(addr.id);
  setLabel(addr.label);
  setAddressLine1(addr.line1);
  setAddressLine2(addr.line2 ?? "");
  setCity(addr.city);
  setPincode(addr.pincode);
  setDeliveryInstructions(addr.deliveryInstructions ?? "");
  setModalVisible(true);
};

  const handleSave = () => {
    if (!addressLine1.trim() || !pincode.trim()) {
      Alert.alert('Required Fields', 'Please enter your house/flat details and pincode.');
      return;
    }

    if (editingId) {
      // Edit
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                label,
                addressLine1,
                addressLine2,
                city,
                pincode,
                deliveryInstructions,
              }
            : item
        )
      );
    } else {
      // Add new
      const newAddr: CustomerAddress = {
        id: `addr-${Date.now()}`,
        label,
        type: "home",
         line1: addressLine1,
         line2: addressLine2,
        city,
         state: "Maharashtra",
        pincode,
        isDefault: addresses.length === 0,
        deliveryInstructions,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setModalVisible(false);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to remove this delivery address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setAddresses((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
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
        <Text style={styles.headerTitle}>My Saved Addresses</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add New Address Button */}
        <TouchableOpacity
          style={styles.addNewCard}
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <View style={styles.plusIconWrap}>
            <Feather name="plus" size={20} color="#FF5A5F" />
          </View>
          <View style={styles.addNewTextWrap}>
            <Text style={styles.addNewTitle}>Add New Address</Text>
            <Text style={styles.addNewSubtitle}>Deliver fresh meals to another location</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#8E8E93" />
        </TouchableOpacity>

        <Text style={styles.sectionHeading}>Saved Delivery Locations</Text>

        {addresses.map((addr) => {
          const isHome = addr.label === 'Home';
          const isWork = addr.label === 'Work';

          return (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                  <View style={styles.iconTag}>
                    <Ionicons
                      name={isHome ? 'home' : isWork ? 'briefcase' : 'location'}
                      size={16}
                      color="#FF5A5F"
                    />
                  </View>
                  <Text style={styles.addressLabel}>{addr.label}</Text>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>

                <View style={styles.actionsTop}>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => openEditModal(addr)}
                  >
                    <Feather name="edit-2" size={16} color="#636366" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => handleDelete(addr.id)}
                  >
                    <Feather name="trash-2" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.addressLinePrimary}>{addr.line1}</Text>
              {addr.line2 ? (
                <Text style={styles.addressLineSecondary}>{addr.line2}</Text>
              ) : null}
              <Text style={styles.addressLineCity}>
                {addr.city} - {addr.pincode}
              </Text>

              {addr.deliveryInstructions ? (
                <View style={styles.instructionsContainer}>
                  <MaterialIcons name="info-outline" size={14} color="#8E8E93" />
                  <Text style={styles.instructionsText}>
                    {addr.deliveryInstructions}
                  </Text>
                </View>
              ) : null}

              {!addr.isDefault && (
                <TouchableOpacity
                  style={styles.setDefaultBtn}
                  onPress={() => handleSetDefault(addr.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.setDefaultText}>Set as Default Address</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Address' : 'New Address'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color="#1C1C1E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type selector */}
              <Text style={styles.inputLabel}>Save as</Text>
              <View style={styles.tagSelector}>
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tagItem, label === t && styles.tagItemActive]}
                    onPress={() => setLabel(t)}
                  >
                    <Text
                      style={[
                        styles.tagItemText,
                        label === t && styles.tagItemTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Form Fields */}
              <Text style={styles.inputLabel}>Flat / House No. / Building *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Flat 301, Sunshine Residency"
                value={addressLine1}
                onChangeText={setAddressLine1}
              />

              <Text style={styles.inputLabel}>Street / Area / Landmark</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Near Baner High Street"
                value={addressLine2}
                onChangeText={setAddressLine2}
              />

              <View style={styles.inputRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.textInput}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>Pincode *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="411045"
                    keyboardType="number-pad"
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Delivery Instructions (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. Ring bell, do not call, leave with guard"
                multiline
                numberOfLines={2}
                value={deliveryInstructions}
                onChangeText={setDeliveryInstructions}
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>
                  {editingId ? 'Update Address' : 'Save Delivery Address'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addNewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFD3D4',
    marginBottom: 20,
  },
  plusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addNewTextWrap: {
    flex: 1,
  },
  addNewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  addNewSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconTag: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  defaultBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.5,
  },
  actionsTop: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    padding: 6,
  },
  addressLinePrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  addressLineSecondary: {
    fontSize: 13,
    color: '#636366',
    marginBottom: 2,
  },
  addressLineCity: {
    fontSize: 13,
    color: '#8E8E93',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    gap: 6,
  },
  instructionsText: {
    fontSize: 11,
    color: '#636366',
    flex: 1,
  },
  setDefaultBtn: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 10,
  },
  setDefaultText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 6,
    marginTop: 10,
  },
  tagSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  tagItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  tagItemActive: {
    borderColor: '#FF5A5F',
    backgroundColor: '#FFF2F2',
  },
  tagItemText: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  tagItemTextActive: {
    color: '#FF5A5F',
    fontWeight: '700',
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
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
  },
  saveBtn: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
