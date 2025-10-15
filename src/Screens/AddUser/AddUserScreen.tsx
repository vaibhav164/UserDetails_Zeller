import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { styles } from './styles';
import { strings } from '../../utils/Constants/strings';
import { NameRegx } from '../../utils/Constants/constants';
import { saveUser } from '../../LocalDB/LocalStograge';
import { createTables, getDBConnection, getUsers } from '../../LocalDB/LocalDB';
import { Customer } from '../HomeScreen/HomeScreen';

type UserRole = 'Admin' | 'Manager';

export interface NewUserFormData {
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface Props {
  navigation: any;
}

export const AddUserScreen: React.FC<Props> = ({ navigation}) => {
  const [form, setForm] = useState<NewUserFormData>({
    firstName: '',
    lastName: '',
    role: 'Admin',
  });
  const [error, setError] = useState<string | null>(null);
  function handleChange<K extends keyof NewUserFormData>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleRoleSelect(role: UserRole) {
    setForm((prev) => ({ ...prev, role }));
  }

  function validate(): boolean {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError(strings.first_last_Name_required);
      return false;
    }
    if (!NameRegx.test(form.firstName) || form.firstName.length > 50) {
      setError(strings.first_name_invalid);
      return false;
    }
    if (!NameRegx.test(form.lastName) || form.lastName.length > 50) {
      setError(strings.last_name_invalid);
      return false;
    }
    setError(null);
    return true;
  }
async function onCreateUser(newUser: Customer) {
  try {
    const db = await getDBConnection();

    // Ensure tables created (only one time ideally)
    await createTables(db);

    // Add new user to local DB
    await saveUser(db, newUser);
    Alert.alert('Success', 'User added successfully', [
  { text: 'OK', onPress: () => {
    setForm({
    firstName: '',
    lastName: '',
    role: 'Admin',
  }); 
  navigation.goBack()} },
    ]);
    const users = await getUsers(db);

  } catch (err) {
    console.error('Error adding user to DB:', err);
  }
}
  function handleSubmit() {
    if (validate()) {
        // createTables
        let newUser: Customer = { id: Math.random().toString(), name: form.firstName + ' ' + form.lastName, role:form.role.toUpperCase() as 'Admin' | 'Manager' };
        console.log('Form submitted:', newUser);
        onCreateUser(newUser);
    }
  }
  function onClose(){
    navigation.goBack();
  }
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>×</Text>
          </TouchableOpacity>
          <Text style={styles.header}>New User</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            autoCapitalize="words"
            testID="firstNameInput"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            autoCapitalize="words"
            testID="lastNameInput"
          />
          <Text style={styles.label}>User Role</Text>
          <View style={styles.roleSwitch}>
            {(['Admin', 'Manager'] as UserRole[]).map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleBtn,
                  form.role === role && styles.roleBtnSelected,
                ]}
                onPress={() => handleRoleSelect(role)}
                testID={`userRole-${role}`}
              >
                <Text
                  style={[
                    styles.roleText,
                    form.role === role && styles.roleTextSelected,
                  ]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={handleSubmit}
          testID="createUserBtn"
        >
          <Text style={styles.createBtnText}>Create User</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


