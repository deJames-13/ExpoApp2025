import React, { useRef, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserForm } from './form';

export function UserModal({ visible, onDismiss, user, onSave, mode = 'create', debug = false }) {
  const formRef = useRef(null);
  const [key, setKey] = useState(`modal-${Date.now()}`);
  const [isReady, setIsReady] = useState(false);

  // Force re-render when user data or visibility changes
  useEffect(() => {
    if (visible) {
      setIsReady(false);
      // Generate a new key to force component remounting
      const newKey = `user-modal-${user?._id || 'new'}-${Date.now()}`;
      setKey(newKey);
      
      // Debug user data
      if (debug && user) {
        console.log("UserModal: Modal opened with mode:", mode);
        console.log("UserModal: User data:", JSON.stringify(user, null, 2));
      }
      
      // Add a slight delay to ensure the form is ready
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, visible, mode, debug]);

  const handleSave = () => {
    if (formRef.current) {
      console.log("UserModal: Submitting form...");
      formRef.current.submitForm();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New User';
      case 'edit':
        return 'Edit User';
      case 'view':
        return 'User Details';
      default:
        return 'User';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{getTitle()}</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.formContainer}>
            {!isReady && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading user data...</Text>
              </View>
            )}
            
            {isReady && (
              <UserForm
                key={key}
                user={user}
                mode={mode}
                onSubmit={onSave}
                formRef={formRef}
              />
            )}
          </ScrollView>

          {/* Footer */}
          {mode !== 'view' && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onDismiss}
              >
                <Text style={styles.buttonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSave}
                disabled={!isReady}
              >
                <Text style={styles.buttonSaveText}>
                  {mode === 'create' ? 'Create' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* View mode only has close button */}
          {mode === 'view' && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={onDismiss}
              >
                <Text style={styles.buttonCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    maxHeight: '70%',
  },
  formContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4B5563',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  buttonCancelText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  buttonSave: {
    backgroundColor: '#2563EB',
  },
  buttonSaveText: {
    color: 'white',
    fontWeight: '500',
  },
  buttonClose: {
    backgroundColor: '#F3F4F6',
  },
  buttonCloseText: {
    color: '#4B5563',
    fontWeight: '500',
  },
});
